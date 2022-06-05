import Types "./types";
import Buffer "mo:base/Buffer";
import Map "mo:base/HashMap";
import Nat "mo:base/Nat";
import Nat64 "mo:base/Nat64";
import Hash "mo:base/Hash";
import Principal "mo:base/Principal";
import Option "mo:base/Option";
import Stack "mo:base/Stack";

import Cycles "mo:base/ExperimentalCycles";
import Ledger "ledger";
import Utils "utils";

shared(msg) actor class UserCanister(_user : Types.User) = this {
    type User = Types.User;
    type UserId = Types.UserId;
    type UserInfo = Types.UserInfo;
    type Post = Types.Post;
    type TokenResponse = Types.TokenResponse;
    type UserTokenInfo = Types.UserTokenInfo;

    type Operation = Ledger.Operation;
    type AccountIdentifier = Ledger.AccountIdentifier;
    type ICP = Ledger.ICP;

    // init by constructor
    stable var user = _user;
    stable let owner = msg.caller;

    // ledger
    let ledger : Ledger.Interface = actor(Ledger.CANISTER_ID);

    // extendable list of user posts
    let posts = Buffer.Buffer<Post>(0);

    // posts indexed by post.id
    let postById = Map.HashMap<Nat, Nat>(1, Nat.equal, Hash.hash);

    // tokens
    let transactions = Map.HashMap<Nat64, UserId>(1, Nat64.equal, Utils.hashNat64);
    let tokensOwners = Map.HashMap<UserId, Nat64>(1, Principal.equal, Principal.hash);
    let tokensPrices = Stack.Stack<Nat64>();
    stable var tokensCount : Nat64 = 0; // tokensPrice.size in nutshell
    stable var totalLocked : Nat64 = 0; // sum of tokensPrices

    stable var lastTokenPrice : Nat64 = 0;
    stable var nextTokenPrice : Nat64 = 1;

    // tokens transactions
    // blockIndex -> pay amount for the token
    //let transactions = Map.HashMap<BlockIndex, int64>();

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

    public func getUserInfo(caller : Principal) : async ?UserInfo {
        let ownedTotalCount = nullToZero(tokensOwners.get(caller));

        let tokenInfo : UserTokenInfo = {
            buyPrice = await buyPrice();
            sellPrice = lastTokenPrice;
            cap = tokensCount * lastTokenPrice;
            totalCount = tokensCount;
            ownedCount = ownedTotalCount;
            totalLocked = totalLocked;
        };

        // cannot be top level field as "this" is not accessable on that level 
        let thisPrincipal = Principal.toText( Principal.fromActor(this) );

        let userInfo : UserInfo = {
            canisterPrincipal = thisPrincipal;
            nftAvatar = user.nftAvatar;
            createdTime = user.createdTime;
            username = user.username;
            displayname = user.displayname;
            bio = user.bio;
            
            token = tokenInfo;
        };

        return ?userInfo;
    };

    public shared(msg) func updateUser(updatedUser : User) : async() {
        assert (owner == msg.caller);
        user := updatedUser;
    };

    private func storePost(post : Post) {
        // add post in the storage
        posts.add(post);

        // add post to index
        let bufferIndex : Nat = posts.size() - 1;
        postById.put(post.id, bufferIndex);
    };

    public func storePostAndSpendToken(authorPrincipal : Principal, post : Post) : async() {
        // TODO: change to burnToken
        let tokenResponse = await burnToken(authorPrincipal);

        switch (tokenResponse) {
            case (#err({text : Text})) {
                return;
            };
            case (_) {
                // nothing
            };
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
        let price = await buyPrice();

        // 2. get payment amount
        // let operation = await getOperationByBlock(blockIndex);
        // switch (operation) {
        //     case (null) {
        //         return #err { text = "Transaction not found"};
        //     };
        //     case (?operation) {
        //         switch(operation) {
        //             case (#Transfer({from : AccountIdentifier; amount : ICP})) {
        //                 // TODO check 'from'
        //                 assert price <= amount.e8s;
        //             };

        //             case (_) {
        //                 return #err { text = "Not transfer transaction"};
        //             };
        //         }
        //     };
        // };

        // 3. mint token and give it to the caller

        // 3.1 give token to the user 
        let callerTokens = nullToZero(tokensOwners.get(msg.caller));
        tokensOwners.put(msg.caller, callerTokens + 1);

        // 3.2 register transaction
        transactions.put(blockIndex, callerId);

        // 3.3 tokens count & price
        tokensCount := tokensCount + 1;
        totalLocked := totalLocked + price;
        tokensPrices.push(price);

        // 3.4 next tokens price
        nextTokenPrice := await buyPrice();
        lastTokenPrice := price;

        // 4. return the success
        return #ok { price = price; };
    };

    public shared(msg) func sellToken() : async TokenResponse {
        let tokenResponse = await burnToken(msg.caller);
        return tokenResponse;
    };

    private func burnToken(owner : Principal) : async TokenResponse {
        let tokensOwned = nullToZero( tokensOwners.get(owner) );

        if (tokensOwned < 1) {
            return #err { text = "Not enough tokens to sell"; };
        };

        let sellPrice = tokensPrices.pop();

        switch (sellPrice) {
            case (null) {
                return #err { text = "Internal error"; };
            };

            case (?sellPrice) {
                tokensOwners.put(owner, tokensOwned - 1);
                tokensCount := tokensCount - 1;
                totalLocked := totalLocked - sellPrice;

                lastTokenPrice := nullToZero(tokensPrices.peek());
                nextTokenPrice := await buyPrice();

                return #ok { price = sellPrice; };
            };
        }
    };

    // private func burnToken(principal : Principal) : TokenResponse {
    //     let tokensOwned = nullToZero( tokensOwners.get(principal) );

    //     if (tokensOwned < 1) {
    //         return #err { text = "Not enough tokens to sell"; };
    //     };

    //     tokensOwners.put(msg.caller, tokensOwned - 1);
    //     tokensCount := tokensCount - 1;
    //     totalLocked := totalLocked - sellPrice;

    //     lastTokenPrice := nullToZero(tokensPrices.peek());
    //     nextTokenPrice := await buyPrice();

    //     return #ok { price = Nat64.fromNat(0); };
    // };

    private func buyPrice() : async Nat64 {
        // let balance = await ledger.account_balance({
        //     account = Utils.principalToAccount(user.id);
        // });

        let balance = {
            e8s = Nat64.fromNat(10_000_000);
        };

        // formula for buy price
        //let k = (balance.e8s + 1) * 10_000_000;
        return (tokensCount+1) * balance.e8s;
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
        { accepted = Nat64.fromNat(deposit) };
    };

    /* Canister update logic */

    stable var serializedPosts : [Post] = [];

    system func preupgrade() {
        serializedPosts := posts.toArray();
    };

    system func postupgrade() {
        for (post in serializedPosts.vals()) {
            storePost(post);
        };

        serializedPosts := [];
    };

    /* Utility func */
    private func nullToZero(n : ?Nat64) : Nat64 {
        return Option.get(n, Nat64.fromNat(0));
    };
};