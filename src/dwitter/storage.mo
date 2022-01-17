import Array "mo:base/Array";
import Map "mo:base/HashMap";
import Iter "mo:base/Iter";
import Option "mo:base/Option";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Types "./types";

module { 
    type Post = Types.Post;
    type UserId = Types.UserId;
    type User = Types.User;

    public class Posts() {
        let map = Map.HashMap<UserId, [Post]>(1, isEq, Principal.hash);

        public func savePost(uid : UserId, post : Post) {
            let posts = map.get(uid);
            var updatedPosts : [Post] = [post];
            switch (posts) {
                case (null) {
                    // nothing
                };
                case (?existingPosts) { 
                    updatedPosts := Array.append<Post>(updatedPosts, existingPosts);
                };
            };
            map.put(uid, updatedPosts);
        };

        public func getPosts(uid : UserId) : ?[Post]  {
            map.get(uid);
        };

        public func getUsers(): [UserId] {
            var users: [UserId] = [];
            for ((uid, posts) in map.entries()) {
                users := Array.append<UserId>(users, [uid]);
            };
            users
        };
    };
    
    public class Users() {
        let users = Map.HashMap<UserId, User>(1, isEq, Principal.hash);
        let byUsername = Map.HashMap<Text, UserId>(1, Text.equal, Text.hash);

        public func get(id : UserId) : ?User {
            users.get(id)
        };

        public func getByUsername(username : Text) : ?User {
            let id = byUsername.get(username);
            switch (id) {
                case (null) {
                    return null;
                };
                case (?id) {
                    return get(id);
                }
            }
        };

        public func saveUser(uid : UserId, user : User) {
            users.put(uid, user);
            byUsername.put(user.username, uid);
        };
    };

    func isEq(x: UserId, y: UserId): Bool { x == y };
};