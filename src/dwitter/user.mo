import Types "./types";
import Buffer "mo:base/Buffer";
import Map "mo:base/HashMap";
import Nat "mo:base/Nat";
import Hash "mo:base/Hash";

import Nat64 "mo:base/Nat64";
import Cycles "mo:base/ExperimentalCycles";

actor class UserCanister() {
    type UserId = Types.UserId;
    type User = Types.User;
    type Post = Types.Post;

    stable var user : ?User = null;

    // extendable list of user posts
    let posts = Buffer.Buffer<Post>(0);

    // posts indexed by post.id
    let postById = Map.HashMap<Nat, Nat>(1, Nat.equal, Hash.hash);

    public func getPost(id : Nat) : async ?Post {
        let index = postById.get(id);
        switch (index) {
            case (null) { return null; };
            case (?index) { return ?posts.get(index); };
        }
    };

    public func getPosts() : async [Post] {
        return posts.toArray();
    };

    public func savePost(post : Post) : async () {
        storePost(post);
    };

    public func getUser() : async ?User {
        return user;
    };

    public func updateUser(updatedUser : User) : async() {
        user := ?updatedUser;
    };

    private func storePost(post : Post) {
        // add post in the storage
        posts.add(post);

        // add post to index
        let bufferIndex : Nat = posts.size() - 1;
        postById.put(post.id, bufferIndex);
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

    /* Utils methods */

    func isEq(x: UserId, y: UserId): Bool { x == y };
};