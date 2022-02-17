import Array "mo:base/Array";
import Map "mo:base/HashMap";
import Iter "mo:base/Iter";
import Option "mo:base/Option";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Nat "mo:base/Nat";
import Hash "mo:base/Hash";
import Buffer "mo:base/Buffer";
import Types "./types";

/*
 * User and posts storage. It currently assumes 1 canister for all the data
 */
module { 
    type Post = Types.Post;
    type UserId = Types.UserId;
    type User = Types.User;
    type CreatePostRequest = Types.CreatePostRequest;

    /*
     * The type helps ensure that storages are serialiazable.
     * It is used to upgrade Dwitter canister without data loss
     */
    type Serializable<T> = {
        toArray : () -> [T];
        fromArray : [T] -> ();
    };

    public class Posts() : Serializable<Post> {
        // Buffer.Buffer<Post> is an extendable list of posts
        let map = Map.HashMap<UserId, Buffer.Buffer<Post>>(1, isEq, Principal.hash);
        var idGenerator : Nat = 1;

        public func savePost(uid : UserId, request : CreatePostRequest) : Post {
            idGenerator += 1;
            let now = Time.now();

            let post : Post = {
                id = idGenerator;
                createdTime = now;
                userId = uid;
                text = request.text;
            };

            storePost(post);

            return post;
        };

        public func getPosts(uid : UserId) : ?[Post]  {
            let buffer = map.get(uid);
            switch(buffer) {
                case (null) { null };
                case (?buffer) { ?buffer.toArray() };
            }
        };

        // Serializes all the data into an array
        public func toArray() : [Post] {
            let buffer = Buffer.Buffer<Post>(0);
            for (posts in map.vals()) {
                for (post in posts.vals()) {
                    buffer.add(post);
                };
            };
            buffer.toArray()
        };

        // Deserializes all the data into an array
        public func fromArray(array : [Post]) : () {
            idGenerator := array.size() + 1;
            for (post in array.vals()) {
                storePost(post);
            };
        };

        func storePost(post : Post) {
            let userPosts = map.get(post.userId);
            switch (userPosts) {
                case (null) {
                    let buffer = Buffer.Buffer<Post>(0);
                    buffer.add(post);
                    map.put(post.userId, buffer);
                };
                case (?userPosts) {
                    userPosts.add(post);
                };
            }
        };
    };
    
    public class Users() : Serializable<User> {
        let users = Map.HashMap<UserId, User>(1, isEq, Principal.hash);
        let byUsername = Map.HashMap<Text, UserId>(1, Text.equal, Text.hash);

        public func get(id : UserId) : ?User {
            users.get(id)
        };

        public func getByUsername(username : Text) : ?User {
            let id = byUsername.get(username);
            switch (id) {
                case (null) { null };
                case (?id) { get(id) };
            }
        };

        public func save(uid : UserId, user : User) : User {
            users.put(uid, user);
            byUsername.put(user.username, uid);
            user
        };

        // Serializes all the data into an array
        public func toArray() : [User] {
            Iter.toArray( users.vals() )
        };

        // Deserializes all the data into an array
        public func fromArray(array : [User]) : () {
            for (user in array.vals()) {
                users.put(user.id, user);
                byUsername.put(user.username, user.id);
            };
        };
    };

    func isEq(x: UserId, y: UserId): Bool { x == y };
};