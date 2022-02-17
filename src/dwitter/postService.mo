import Array "mo:base/Array";
import Types "./types";
import Storage "./storage";

module {
    type Post = Types.Post;
    type UserId = Types.UserId;
    type User = Types.User;
    type PostInfo = Types.PostInfo;
    type CreatePostRequest = Types.CreatePostRequest;

    public class PostService(postsStorage: Storage.Posts, usersStorage: Storage.Users) {
        public func createPost(userId : UserId, request : CreatePostRequest): PostInfo {
            let post = postsStorage.savePost(userId, request);
            return fetchPostInfo(post);
        };

        public func getByUserId(userId : UserId): ?[PostInfo] {
            let posts = postsStorage.getPosts(userId);
            switch(posts) {
                case (null) {
                    return null;
                };
                case (?posts) {
                    return fetchPostInfos(posts);
                };
            }
        };

        public func getByUsername(username : Text): ?[PostInfo] {
            let user = usersStorage.getByUsername(username);
            switch(user) {
                case (null) {
                    return null;
                };
                case (?user) {
                    return getByUserId(user.id);
                };
            }
        };

        public func fetchPostInfos(posts: [Post]) : ?[PostInfo]  {
            do ? {
                Array.tabulate<PostInfo>(posts.size(), func(i:Nat) : PostInfo {
                    fetchPostInfo(posts[i])
                })
            }
        };

        public func toArray() : [Post] {
            postsStorage.toArray()
        };

        public func fromArray(array : [Post]) {
            postsStorage.fromArray(array)
        };

        private func fetchPostInfo(post : Post) : PostInfo {
            let user = usersStorage.get(post.userId);
            switch(user) {
                case (?user) {
                    let postInfo : PostInfo = {
                        id = post.id;
                        createdTime = post.createdTime;
                        text = post.text;
                        username = user.username;
                        displayname = user.displayname;
                    };
                    return postInfo;
                };
                case (null) {
                    let postInfo : PostInfo = {
                        id = post.id;
                        createdTime = post.createdTime;
                        text = post.text;
                        username = "DELETED";
                        displayname = "DELETED";
                    };
                    return postInfo;
                };
            };
        }
    }
}