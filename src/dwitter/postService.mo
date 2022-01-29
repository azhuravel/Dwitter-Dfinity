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
        public func savePost(userId : UserId, request : CreatePostRequest): () {
            postsStorage.savePost(userId, request);
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
                    let currentPost = posts[i];
                    let currentUser = usersStorage.get(currentPost.userId);
                    switch(currentUser) {
                        case (?currentUser) {
                            let postInfo : PostInfo = {
                                id = currentPost.id;
                                createdTime = currentPost.createdTime;
                                text = currentPost.text;
                                username = currentUser.username;
                                displayname = currentUser.displayname;
                            };
                            postInfo
                        };
                        case (null) {
                            let postInfo : PostInfo = {
                                id = currentPost.id;
                                createdTime = currentPost.createdTime;
                                text = currentPost.text;
                                username = "DELETED";
                                displayname = "DELETED";
                            };
                            postInfo
                        };
                    };
                })
            }
        };
    }
}