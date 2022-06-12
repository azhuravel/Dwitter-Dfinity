import Types "./types";
import UserCanisterModule "./userCanisterModule";
import UserModule "./user";
import Principal "mo:base/Principal";
import Map "mo:base/HashMap";

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

        private let ANONYM_PRINCIPAL = Principal.fromText("2vxsx-fae");

        let DELETED_USER : User = {
            id = ANONYM_PRINCIPAL;
            nftAvatar = null;
            createdTime = 0;
            username = "DELETED";
            displayname = "DELETED";
            bio = null;
        };

        public func createPost(userId : UserId, request : CreatePostRequest) : async ?PostInfo {
            //let post = postsStorage.savePost(userId, request);
            do ? {
                let post = createRequestToPost(userId, request);

                let authorCanister = userCanisterService.getByUserId(userId);
                let wallUserCanister = userCanisterService.getByUserId(userId);

                await wallUserCanister!.savePost(post);

                return ?getPostInfo(await authorCanister!.getUser(), post);
                // switch (userCanister) {
                //     case (null) {
                //         return null;
                //     }; // nothing, throw an exception
                //     case (?userCanister) { 
                //         await userCanister.savePost(post); 
                //         return ?getPostInfo(await userCanister.getUser(), post);
                //     };
                // };
            }
        };

        public func createPostAndSpendToken(userId : UserId, request : CreatePostAndSpendTokenRequest) : async ?PostInfo {
            //let post = postsStorage.savePost(userId, request);
            let post = createRequestToPost(userId, request);

            let userCanister = userCanisterService.getByPrincipal(request.targetUserPrincipal);
            await userCanister.storePostAndSpendToken(userId, post); 

            return ?getPostInfo(await userCanister.getUser(), post);
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
                    let postInfos = await reverseAndFetchPostInfos(await userCanister.getUser(), posts);
                    return postInfos;
                };
            }
        };

        private func reverseAndFetchPostInfos(author : User, posts: [Post]) : async ?[PostInfo]  {
            do ? {
                let authors = Map.HashMap<UserId, User>(1, Principal.equal, Principal.hash);
                for (post in posts.vals()) {
                    let authorId = post.userId;
                    let canister = userCanisterService.getByUserId(authorId);
                    switch (canister) {
                        case (null) {
                            // nothing
                        };
                        case (?canister) {
                            let user = await canister.getUser();
                            authors.put(authorId, user);
                        };
                    }
                };


                let N = posts.size(); // total amount of posts
                Array.tabulate<PostInfo>(N, func(i:Nat) : PostInfo {
                    // posts[] stores posts orders by created time ASCending
                    // the last created post is post[N-1]
                    let post = posts[N - i - 1];
                    let author = authors.get(post.userId);
                    switch (author) {
                        case (null) {
                            return getPostInfo(DELETED_USER, post);
                        };
                        case (?author) {
                            return getPostInfo(author, post);
                        };
                    }
                })
            }
        };

        private func getPostInfo(author : User, post : Post) : PostInfo {
            let postInfo : PostInfo = {
                id = post.id;
                kind = post.kind;
                createdTime = post.createdTime;
                text = post.text;
                nft = post.nft;
                username = author.username;
                displayname = author.displayname;
                nftAvatar = author.nftAvatar;
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