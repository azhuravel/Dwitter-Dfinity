import Types "./types";
import Buffer "mo:base/Buffer";
import Map "mo:base/HashMap";
import Nat "mo:base/Nat";
import Nat64 "mo:base/Nat64";
import Nat8 "mo:base/Nat8";
import Hash "mo:base/Hash";
import Principal "mo:base/Principal";
import Option "mo:base/Option";
import Stack "mo:base/Stack";
import Blob "mo:base/Blob";
import Iter "mo:base/Iter";

import Cycles "mo:base/ExperimentalCycles";
import Ledger "ic/ledger";
import Utils "utils";

shared(msg) actor class UserCanister() = this {
    type User = Types.User;
    type UserId = Types.UserId;
    type UserInfo = Types.UserInfo;
    type Post = Types.Post;
    type TokenResponse = Types.TokenResponse;
    type UserTokenInfo = Types.UserTokenInfo;
    type CanisterInfo = Types.CanisterInfo;

    type Operation = Ledger.Operation;
    type AccountIdentifier = Ledger.AccountIdentifier;
    type ICP = Ledger.ICP;

    let ANONYM_PRINCIPAL = Principal.fromText("2vxsx-fae");

    let EMPTY_USER : User = {
        id = ANONYM_PRINCIPAL;
        nftAvatar = null;
        createdTime = 0;
        username = "DELETED";
        displayname = "DELETED";
        bio = null;
    };

    // equal to initial count of cycles
    let MAX_CYCLES = 100_000_000_000;

    let ICP_CENT : Nat64 = 1_000_000;
    let ICP : Nat64 = ICP_CENT * 100;

    // init by constructor
    stable let owner = msg.caller;

    stable var user = EMPTY_USER;
    stable var version = 1;
    stable var userAccountIdentifier = "";
    stable var canisterAccountIdentifier = "";

    // ledger
    let ledger : Ledger.Interface = actor(Ledger.CANISTER_ID);

    // topups, just for info
    let topups = Buffer.Buffer<Nat>(0);

    // canister upgrade storage
    stable var serializedPosts : [Post] = [];
    stable var serializedTransactions : [(Nat64, UserId)] = [];
    stable var serializedTokensOwners : [(UserId, Nat64)] = [];
    stable var serializedTokensPrices : [Nat64] = [];

    // extendable list of user posts
    let posts = Buffer.Buffer<Post>(0);

    // posts indexed by post.id
    let postById = Map.HashMap<Nat, Nat>(1, Nat.equal, Hash.hash);

    // tokens
    let transactions = Map.fromIter<Nat64, UserId>(serializedTransactions.vals(), 10, Nat64.equal, Utils.hashNat64);
    let tokensOwners = Map.fromIter<UserId, Nat64>(serializedTokensOwners.vals(), 10, Principal.equal, Principal.hash);

    let tokensPrices = Buffer.Buffer<Nat64>(0);

    stable var tokensCount : Nat64 = 0; // tokensPrice.size in nutshell
    stable var totalLocked : Nat64 = 0; // sum of tokensPrices

    stable var lastTokenPrice : Nat64 = 0;
    stable var nextTokenPrice : Nat64 = 1;

    stable var userBalance : Nat64 = 0;

    public func getPost(id : Nat) : async ?Post {
        let index = postById.get(id);
        switch (index) {
            case (null) { return null; };
            case (?index) { return ?posts.get(index); };
        }
    };

    public query func getPosts() : async [Post] {
        return posts.toArray();
    };

    public shared(msg) func savePost(post : Post) : async () {
        let isSelfPost = msg.caller == user.id;
        // ensure that have enough tokens to make a post
        storePost(post);
    };

    // deprecated
    public shared query (msg) func getUser() : async User {
        return user;
    };

    public shared(msg) func setUser(_user : User) : async () {
        user := _user;

        // TODO: optimization for page load speed, need to refresh later
        await _updateBalance();
    };

    public query func getUserInfo(caller : Principal) : async ?UserInfo {
        calcAccountIdentifiers();

        let ownedTotalCount = nullToZero(tokensOwners.get(caller));

        let tokenInfo : UserTokenInfo = {
            buyPrice = buyPrice();
            sellPrice = lastTokenPrice;
            cap = tokensCount * lastTokenPrice;
            totalCount = tokensCount;
            ownedCount = ownedTotalCount;
            totalLocked = totalLocked;
        };

        // cannot be top level field as "this" is not accessable on that level 
        let thisCanisterPrincipal = Principal.toText( Principal.fromActor(this) );

        let userInfo : UserInfo = {
            userPrincipal = user.id;
            canisterPrincipal = thisCanisterPrincipal;
            accountIdentifier = canisterAccountIdentifier;
            nftAvatar = user.nftAvatar;
            createdTime = user.createdTime;
            username = user.username;
            displayname = user.displayname;
            bio = user.bio;
            balance = userBalance;
            
            token = tokenInfo;
        };

        return ?userInfo;
    };

    public shared(msg) func updateUser(updatedUser : User) : async() {
        assert (owner == msg.caller);
        user := updatedUser;
    };

    private func calcAccountIdentifiers() {
        if (userAccountIdentifier == "") {
            userAccountIdentifier := Utils.accountToText(Utils.principalToAccount(user.id));
        };

        if (canisterAccountIdentifier == "") {
            canisterAccountIdentifier := getAccountIdentifier();
        };
    };
 
    private func storePost(post : Post) {
        // add post in the storage
        posts.add(post);

        // add post to index
        let bufferIndex : Nat = posts.size() - 1;
        postById.put(post.id, bufferIndex);
    };

    public func storePostAndSpendToken(author : Principal, post : Post) : async() {
        let wallOwner = user.id;
        let selfPost = author == wallOwner;

        if (not selfPost) {
            transferToken(author, wallOwner, 1); // transfer from post author to wall owner
        };

        // add post in the storage
        posts.add(post);

        // add post to index
        let bufferIndex : Nat = posts.size() - 1;
        postById.put(post.id, bufferIndex);
    };

    public shared(msg) func recieveToken(blockIndex : Nat64) : async TokenResponse {
        let callerId = msg.caller;

        // 1. check that already not recieved token
        let tx = transactions.get(blockIndex);
        if (tx != null) {
            return #err { text = "Already recieved token"; };
        };

        // 2. calculate current buy price
        let price = buyPrice();

        // 2. get payment amount
        let operation = await getOperationByBlock(blockIndex);
        switch (operation) {
            case (null) {
                return #err { text = "Transaction not found"};
            };
            case (?operation) {
                switch(operation) {
                    case (#Transfer({from : AccountIdentifier; amount : ICP})) {
                        // TODO check 'from'
                        assert price <= amount.e8s;
                    };

                    case (_) {
                        return #err { text = "Not transfer transaction"};
                    };
                }
            };
        };

        // 3. mint token and give it to the caller

        // 3.1 give token to the user 
        let callerTokens = nullToZero(tokensOwners.get(msg.caller));
        tokensOwners.put(msg.caller, callerTokens + 1);

        // 3.2 register transaction
        transactions.put(blockIndex, callerId);

        // 3.3 tokens count & price
        tokensCount := tokensCount + 1;
        totalLocked := totalLocked + price;
        tokensPrices.add(price);

        // 3.4 next tokens price
        nextTokenPrice := buyPrice();
        lastTokenPrice := price;

        // 4. return the success
        return #ok { price = price; };
    };

    public shared(msg) func sellToken() : async TokenResponse {
        let tokenResponse = await burnToken(msg.caller);
        switch (tokenResponse) {
            case (#err({ text : Text })) {
                // no need to transfer ICP
            };

            case (#ok({ price : Nat64 })) {
                // send transfer to user
                let response = await sendICP(msg.caller, price);
                return response;
            };
        };
        return tokenResponse;
    };

    public shared query (msg) func getCanisterInfo() : async CanisterInfo {
        let info : CanisterInfo = {
            version = version;
            cyclesBalance = Cycles.balance();
        };
        return info;
    };

    public shared (msg) func updateBalance() : async() {
        await _updateBalance();
    };

    private func _updateBalance() : async() {
        calcAccountIdentifiers();

        let balance = await ledger.account_balance_dfx({
            account = userAccountIdentifier;
        });
        userBalance := balance.e8s;
    };

    private func getAccountIdentifier() : Text {
        let thisCanisterPrincipal = Principal.fromActor(this);
        let identifier = Utils.principalToAccount(thisCanisterPrincipal);
        return Utils.accountToText(identifier);
    };

    private func sendICP(destinationPrincipal : Principal, amount : Nat64) : async TokenResponse {
        let fee = Nat64.fromNat(10_000);
        let price = amount - fee;
        let wallet = Utils.principalToAccount(destinationPrincipal);
        let block = await ledger.send_dfx({
            memo = 1;
            amount = {
                e8s = price
            };
            fee = {
                e8s = 10_000;
            };
            to = Utils.accountToText(wallet);
            from_subaccount = null;
            created_at_time = null;
        });
        return #ok { price = price; };
    };

    private func burnToken(owner : Principal) : async TokenResponse {
        let tokensOwned = nullToZero( tokensOwners.get(owner) );

        if (tokensOwned < 1) {
            return #err { text = "Not enough tokens to sell"; };
        };

        let sellPrice = tokensPrices.removeLast();

        switch (sellPrice) {
            case (null) {
                return #err { text = "Internal error"; };
            };

            case (?sellPrice) {
                tokensOwners.put(owner, tokensOwned - 1);
                tokensCount := tokensCount - 1;
                totalLocked := totalLocked - sellPrice;

                lastTokenPrice := tokensPrices.get(tokensPrices.size() - 1);
                nextTokenPrice := buyPrice();

                return #ok { price = sellPrice; };
            };
        }
    };

    private func transferToken(from : UserId, to : UserId, count : Nat64) {
        let tokensFrom = nullToZero( tokensOwners.get(from) );
        let tokensTo = nullToZero( tokensOwners.get(to) );

        assert tokensFrom >= count;

        tokensOwners.put(from, tokensFrom - count);
        tokensOwners.put(to, tokensTo + count);
    };

    private func buyPrice() : Nat64 {
        var tokensSquared = (tokensCount+1)**(2);

        if (userBalance < 20 * ICP) {
            return ICP_CENT * tokensSquared;
        };

        return ICP_CENT * tokensSquared * log10(userBalance); 
    };

    private func log10(x : Nat64) : Nat64 {
        let _log2 = log2(x);
        return _log2 / 3;
    };

    private func log2(x : Nat64) : Nat64 {
        var _x : Nat64 = x;
        var n : Nat64 = 0;
        if (_x >= 2**32) { _x >>= 32; n += 32; };
        if (_x >= 2**16) { _x >>= 16; n += 16; };
        if (_x >= 2**8) { _x >>= 8; n += 8; };
        if (_x >= 2**4) { _x >>= 4; n += 4; };
        if (_x >= 2**2) { _x >>= 2; n += 2; };
        if (_x >= 2**1) { /* x >>= 1; */ n += 1; };
        return n;
    };

    /* Operation by block */
    private func getOperationByBlock(block : Nat64) : async ?Operation {
        let getBlockArgs = {
            start = block;
            length = Nat64.fromNat(1);
        };

        let response = await ledger.query_blocks(getBlockArgs);

        let blocks = response.blocks;
        if (blocks.size() > 0) {
            return blocks[0].transaction.operation;
        } else {
            return null;
        }
    };

    /* Method to allow topup canister */

    public func wallet_receive() : async { accepted: Nat64 } {
        let amount = Cycles.available();
        let deposit = Cycles.accept(amount);
        topups.add(deposit);
        { accepted = Nat64.fromNat(deposit) };
    };

    public shared query (msg) func getTopUps() : async [Nat] {
        return topups.toArray();
    };

    /* Canister update logic */
    
    system func preupgrade() {
        serializedPosts := posts.toArray();
        serializedTransactions := Iter.toArray(transactions.entries());
        serializedTokensPrices := tokensPrices.toArray();
        serializedTokensOwners := Iter.toArray(tokensOwners.entries());
    };

    system func postupgrade() {
        for (post in serializedPosts.vals()) {
            storePost(post);
        };

        for (price in serializedTokensPrices.vals()) {
            tokensPrices.add(price);
        }; 

        serializedPosts := [];
        serializedTransactions := [];
        serializedTokensOwners := [];
        serializedTokensPrices := [];
    };

    /* Utility func */
    private func nullToZero(n : ?Nat64) : Nat64 {
        return Option.get(n, Nat64.fromNat(0));
    };
};