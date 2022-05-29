import Types "./types";
import Buffer "mo:base/Buffer";
import Map "mo:base/HashMap";
import Nat "mo:base/Nat";
import Nat64 "mo:base/Nat64";
import Hash "mo:base/Hash";
import Principal "mo:base/Principal";
import Option "mo:base/Option";

import Cycles "mo:base/ExperimentalCycles";

shared(msg) actor class UserCanister(_user : Types.User) = this {
    type User = Types.User;
    type UserId = Types.UserId;
    type UserInfo = Types.UserInfo;
    type Post = Types.Post;
    type TokenResponse = Types.TokenResponse;
    type UserTokenInfo = Types.UserTokenInfo;

    stable var user = _user;
    stable let owner = msg.caller;

    // extendable list of user posts
    let posts = Buffer.Buffer<Post>(0);

    // posts indexed by post.id
    let postById = Map.HashMap<Nat, Nat>(1, Nat.equal, Hash.hash);

    // tokens
    let tokensOwners = Map.HashMap<UserId, Nat64>(1, Principal.equal, Principal.hash);
    stable var tokensCount : Nat64 = 0;
    var totalLocked : Nat64 = 0;

    var lastTokenPrice : Nat64 = 0;
    var nextTokenPrice : Nat64 = 1;

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

    public shared query (msg) func getUserInfo() : async ?UserInfo {
        let ownedTotalCount = nullToZero(tokensOwners.get(msg.caller));

        let tokenInfo : UserTokenInfo = {
            buyPrice = nextTokenPrice;
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

    public shared(msg) func recieveToken() : async TokenResponse {
        // let callerId = msg.caller;

        // // 1. check that already not recieved token
        // let tx = transactions.get(blockIndex);
        // if (tx == null) {
        //     return { #err : { text : "Already recieved token"} };
        // }

        // // 2. get payment amount
        // //let payment = block.price;

        // // 2. check payment enough to buy token
        // let price = tokensCount + 1;
        // // temporary
        // let payment = price+1;
        
        // assert price < payment;

        // 3. mint token
        let price = nextTokenPrice;

        let callerTokens = nullToZero(tokensOwners.get(msg.caller));
        tokensOwners.put(msg.caller, callerTokens + 1);
        tokensCount := tokensCount + 1;
        //transactions.put(blockIndex, price);

        totalLocked := totalLocked + price;
        nextTokenPrice := tokensCount;

        // 4. return the payment
        return #ok;
    };

    private func nullToZero(n : ?Nat64) : Nat64 {
        return Option.get(n, Nat64.fromNat(0));
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
};