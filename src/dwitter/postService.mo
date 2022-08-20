import Types "./types";
import UserCanisterModule "./userCanisterModule";
import UserModule "./user";
import Hash "mo:base/Hash";
import Nat "mo:base/Nat";
import Principal "mo:base/Principal";
import Map "mo:base/HashMap";

import Array "mo:base/Array";
import Time "mo:base/Time";
import Buffer "mo:base/Buffer";

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
            subscribers = [];
            subscribedTo = [];
        };

        public func createPost(userId : UserId, request : CreatePostRequest) : async ?PostInfo {
            do ? {
                let post = createRequestToPost(userId, request);

                let authorCanister = userCanisterService.getByUserId(userId);
                let wallUserCanister = userCanisterService.getByUserId(userId);

                await wallUserCanister!.savePost(post);

                return ?getPostInfo(await authorCanister!.getUser(), post);
            }
        };

        public func createPostAndSpendToken(userId : UserId, request : CreatePostAndSpendTokenRequest) : async ?PostInfo {
            let post = createSpentTokenRequestToPost(userId, request);

            let userCanister = userCanisterService.getByPrincipal(request.targetUserPrincipal);
            await userCanister.storePostAndSpendToken(userId, post);

            let authorCanister = userCanisterService.getByUserId(userId);
            switch(authorCanister) {
                case (null) {
                    return null;
                };

                case (?authorCanister) {
                    return ?getPostInfo(await authorCanister.getUser(), post);
                };
            }
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
                    let postInfos = await reverseAndFetchPostInfos(posts);
                    return postInfos;
                };
            }
        };

        private func reverseAndFetchPostInfos(posts: [Post]) : async ?[PostInfo]  {
            let result = Buffer.Buffer<PostInfo>(0);

            let reversedPosts = Array.reverse(posts);
            for (post in reversedPosts.vals()) {
                let authorId = getAuthorId(post);
                // let isReshare = isPostReshare(post);
                let canister = userCanisterService.getByUserId(authorId);
                switch (canister) {
                    case (null) {
                        let postInfo = getPostInfo(DELETED_USER, post);
                        result.add(postInfo);
                    };

                    case (?canister) {
                        let user = await canister.getUser();

                        switch (post.resharePostId) {
                            case (null) {
                                let postInfo = getPostInfo(user, post);
                                result.add(postInfo);
                            };

                            case (?resharePostId) {
                                let resharePost = await canister.getPost(resharePostId);

                                switch (resharePost) {
                                    case (null) { };
                                    case (?resharePost) {
                                        let postInfo = getPostInfo(user, resharePost);
                                        result.add(postInfo);
                                    };
                                }
                            };
                        }
                    };
                };
            };

            return ?result.toArray();
        };

        private func getPostInfo(author : User, post : Post) : PostInfo {
            let postInfo : PostInfo = {
                id = post.id;
                kind = post.kind;
                createdTime = post.createdTime;
                text = post.text;
                nft = post.nft;

                reshareCount = post.reshareCount;
                resharePostId = post.resharePostId;
                reshareUserId = post.reshareUserId;
                
                username = author.username;
                displayname = author.displayname;
                nftAvatar = author.nftAvatar;

                likers = post.likers;
            };
            return postInfo;
        };

        private func createSpentTokenRequestToPost(uid : UserId, request : CreatePostAndSpendTokenRequest) : Post {
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

                reshareUserId = null;
                resharePostId = null;
                reshareCount = 0;

                likers = [];
            };

            return post;
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

                reshareUserId = getPrincipalFromText(request.reshareUserId);
                resharePostId = request.resharePostId;

                reshareCount = 0;

                likers = [];
            };

            return post;
        };

        private func getPrincipalFromText(text : ?Text) : ?Principal {
            switch (text) {
                case (null) {
                    return null;
                };

                case (?text) {
                    return ?Principal.fromText(text);
                };
            };
        };


        private func getAuthorId(post : Post) : UserId {
            switch (post.reshareUserId) {
                case (null) {
                    return post.userId;
                };

                case (?reshareUserId) {
                    return reshareUserId;
                };
            };
        };
    }
}