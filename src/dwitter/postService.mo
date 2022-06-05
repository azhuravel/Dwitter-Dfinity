import Types "./types";
import UserCanisterModule "./userCanisterModule";
import UserModule "./user";

import Array "mo:base/Array";
import Time "mo:base/Time";

module {
    type Post = Types.Post;
    type UserId = Types.UserId;
    type User = Types.User;
    type PostInfo = Types.PostInfo;
    type CreatePostRequest = Types.CreatePostRequest;
    type CreatePostAndSpendTokenRequest = Types.CreatePostAndSpendTokenRequest;
    type UserCanisterService = UserCanisterModule.UserCanisterService;
    type UserCanister = UserModule.UserCanister;

    public class PostService(userCanisterService : UserCanisterService) {
        var idGenerator : Nat = 1;

        public func createPost(userId : UserId, request : CreatePostRequest) : async ?PostInfo {
            //let post = postsStorage.savePost(userId, request);
            let post = createRequestToPost(userId, request);

            let userCanister = userCanisterService.getByUserId(userId);
            switch (userCanister) {
                case (null) {
                    return null;
                 }; // nothing, throw an exception
                case (?userCanister) { 
                    await userCanister.savePost(post); 
                    return ?fetchPostInfo(await userCanister.getUser(), post);
                };
            };
        };

        public func createPostAndSpendToken(userId : UserId, request : CreatePostAndSpendTokenRequest) : async ?PostInfo {
            //let post = postsStorage.savePost(userId, request);
            let post = createRequestToPost(userId, request);

            let userCanister = userCanisterService.getByPrincipal(request.targetUserPrincipal);
            await userCanister.storePostAndSpendToken(userId, post); 

            return ?fetchPostInfo(await userCanister.getUser(), post);
        };

        public func getByUserId(userId : UserId): async ?[PostInfo] {
            let userCanister = userCanisterService.getByUserId(userId);
            return await getPostInfos(userCanister);
        };

        public func getByUsername(username : Text): async ?[PostInfo] {
            let userCanister = userCanisterService.getByUsername(username);
            return await getPostInfos(userCanister);
        };

        private func getPostInfos(userCanister : ?UserCanister) : async ?[PostInfo] {
            switch(userCanister) {
                case (null) {
                    return null;
                };
                case (?userCanister) {
                    let posts = await userCanister.getPosts();
                    return reverseAndFetchPostInfos(await userCanister.getUser(), posts);
                };
            }
        };

        private func reverseAndFetchPostInfos(user : User, posts: [Post]) : ?[PostInfo]  {
            do ? {
                let N = posts.size(); // total amount of posts
                Array.tabulate<PostInfo>(N, func(i:Nat) : PostInfo {
                    // posts[] stores posts orders by created time ASCending
                    // the last created post is post[N-1]
                    fetchPostInfo(user, posts[N - i - 1])
                })
            }
        };

        // public func toArray() : [Post] {
        //     postsStorage.toArray()
        // };

        // public func fromArray(array : [Post]) {
        //     postsStorage.fromArray(array)
        // };

        private func fetchPostInfo(user : User, post : Post) : PostInfo {
            let postInfo : PostInfo = {
                id = post.id;
                kind = post.kind;
                createdTime = post.createdTime;
                text = post.text;
                nft = post.nft;
                username = user.username;
                displayname = user.displayname;
                nftAvatar = user.nftAvatar;
            };
            return postInfo;
        };

        private func createRequestToPost(uid : UserId, request : CreatePostRequest) : Post {
            idGenerator += 1;
            let now = Time.now();

            let post : Post = {
                id = idGenerator;
                createdTime = now;
                userId = uid;
                kind = request.kind;
                text = request.text;
                nft = request.nft;
                userCanister = null;
            };

            return post;
        }
    }
}