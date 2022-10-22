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
    type UserPostId = Types.UserPostId;
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
                let postToSave = createRequestToPost(userId, request);

                let authorId = getAuthorId(postToSave);
                let authorCanister = userCanisterService.getByUserId(authorId); // original author
                let wallUserCanister = userCanisterService.getByUserId(userId); // the user wall to post

                let post = await wallUserCanister!.savePost(postToSave);

                if (isReshare(post)) {
                    await authorCanister!.incReshareCount(post.resharePostId!);
                };
                
                ignore await sendPostToSubscribers(post, userId, wallUserCanister); // send to all subscribers of the wall uesr 

                return ?getPostInfo(await wallUserCanister!.getUser(), post); // post info with wall user as creator
            }
        };

        private func sendPostToSubscribers(post : Post, userId : UserId, userCanister : ?UserCanister) : async ?() {
            do ? {
                let user = await userCanister!.getUserInfo(userId);
                for (subscriber in user!.subscribers.vals()) {
                    let subscriberCanister = userCanisterService.getByUserId(Principal.fromText(subscriber));
                    let userPostId : UserPostId = {
                        postId = post.id;
                        userId = userId;
                    };
                    ignore await subscriberCanister!.addPostToFeed(userPostId, user!.balance * 10000);
                };
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

        public func getFeed(userId : UserId) : async ?[PostInfo] {
            let userCanister = userCanisterService.getByUserId(userId);
            do ? {
                let feed = await userCanister!.getFeed();
                let posts = await fetchFeedPosts(feed);
                // fetch posts 
                await reverseAndFetchPostInfos(posts);
            }
        };

        public func like(likerId : UserId, username : Text, postId : Nat) : async () {
            let userCanister = userCanisterService.getByUsername(username);
            switch(userCanister) {
                case (null) {
                    // nothing
                };

                case (?userCanister) {
                    await userCanister.likePost(likerId, postId);
                };
            };
        };

        public func dislike(likerId : UserId, username : Text, postId : Nat) : async () {
            let userCanister = userCanisterService.getByUsername(username);
            switch(userCanister) {
                case (null) {
                    // nothing
                };

                case (?userCanister) {
                    await userCanister.dislikePost(likerId, postId);
                };
            };
        };

        private func getPostInfos(userCanister : ?UserCanister) : async ?[PostInfo] {
            switch(userCanister) {
                case (null) {
                    return null;
                };
                case (?userCanister) {
                    let posts = await userCanister.getPosts();
                    let postInfos = await reverseAndFetchPostInfos(posts);
                    return ?postInfos;
                };
            }
        };

        private func fetchFeedPosts(feed : [UserPostId]) : async [Post] {
            let result = Buffer.Buffer<Post>(0);

            for (userPostId in feed.vals()) {
                let userCanister = userCanisterService.getByUserId(userPostId.userId);
                switch (userCanister) {
                    case (null) {
                        
                    };

                    case (?userCanister) {
                        let user = await userCanister.getUser();
                        let post = await userCanister.getPost(userPostId.postId);
                        switch(post) {
                            case (null) { };
                            case (?post) {
                                result.add(post);
                            };
                        };
                    };
                };
            };
            return result.toArray(); 
        };

        private func fetchFeed(feed : [UserPostId]) : async [PostInfo] {
            let result = Buffer.Buffer<PostInfo>(0);

            for (userPostId in feed.vals()) {
                let userCanister = userCanisterService.getByUserId(userPostId.userId);
                switch (userCanister) {
                    case (null) {

                    };

                    case (?userCanister) {
                        let user = await userCanister.getUser();
                        let post = await userCanister.getPost(userPostId.postId);
                        switch(post) {
                            case (null) { };
                            case (?post) {
                                let postInfo = getPostInfo(user, post);
                                result.add(postInfo);
                            };
                        };
                    };
                };
            };
            return result.toArray(); 
        };

        private func reverseAndFetchPostInfos(posts: [Post]) : async [PostInfo]  {
            let result = Buffer.Buffer<PostInfo>(0);

            let reversedPosts = Array.reverse(posts);
            for (post in reversedPosts.vals()) {
                let authorId = getAuthorId(post);
                // let isReshare = isPostReshare(post);
                let authorCanister = userCanisterService.getByUserId(authorId);
                let userCanister = userCanisterService.getByUserId(post.userId);
                switch (userCanister) {
                    case(null) {
                        // 
                    };

                    case (?userCanister) {
                        let user = await userCanister.getUser();
                        switch (authorCanister) {
                            case (null) {
                                let postInfo = getPostInfo(DELETED_USER, post);
                                result.add(postInfo);
                            };

                            case (?authorCanister) {
                                let author = await authorCanister.getUser();

                                switch (post.resharePostId) {
                                    case (null) {
                                        let postInfo = getPostInfo(author, post);
                                        result.add(postInfo);
                                    };

                                    case (?resharePostId) {
                                        let resharePost = await authorCanister.getPost(resharePostId);

                                        switch (resharePost) {
                                            case (null) { };
                                            case (?resharePost) {
                                                //let postInfo = getPostInfo(user, resharePost);
                                                let postInfo = getPostInfoReshare(user, post, resharePost);
                                                result.add(postInfo);
                                            };
                                        }
                                    };
                                }
                            };
                        };
                    };
                };
            };

            return result.toArray();
        };

        private func getPostInfoReshare(reshareUser : User, reshare : Post, original : Post) : PostInfo {
            let postInfo : PostInfo = {
                id = reshare.id;
                userId = Principal.toText(reshareUser.id);
                kind = original.kind;
                createdTime = original.createdTime;
                text = original.text;
                nft = original.nft;

                reshareCount = original.reshareCount;
                resharePostId = reshare.resharePostId;
                reshareUserId = getTextFromPrincipal(reshare.reshareUserId);
                reshareUsername = reshare.reshareUsername;
                reshareDisplayname = reshare.reshareDisplayname;
                
                username = reshareUser.username;
                displayname = reshareUser.displayname;
                nftAvatar = reshareUser.nftAvatar;

                likers = toTextArray(reshare.likers);
            };
            return postInfo;
        };

        private func getPostInfo(author : User, post : Post) : PostInfo {
            let postInfo : PostInfo = {
                id = post.id;
                userId = Principal.toText(author.id);
                kind = post.kind;
                createdTime = post.createdTime;
                text = post.text;
                nft = post.nft;

                reshareCount = post.reshareCount;
                resharePostId = post.resharePostId;
                reshareUserId = getTextFromPrincipal(post.reshareUserId);
                reshareUsername = post.reshareUsername;
                reshareDisplayname = post.reshareDisplayname;
                
                username = author.username;
                displayname = author.displayname;
                nftAvatar = author.nftAvatar;

                likers = toTextArray(post.likers);
            };
            return postInfo;
        };

        private func toTextArray(users : [UserId]) : [Text] {
            return Array.map(users, func (userId : Principal) : Text {
                                    return Principal.toText(userId);
                                }
            );
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
                reshareUsername = null;
                reshareDisplayname = null;
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
                reshareUsername = request.reshareUsername;
                reshareDisplayname = request.reshareDisplayname;

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

        private func getTextFromPrincipal(principal : ?Principal) : ?Text {
            switch (principal) {
                case (null) {
                    return null;
                };

                case (?principal) {
                    return ?Principal.toText(principal);
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

        private func isReshare(post : Post) : Bool {
            switch (post.reshareUserId) {
                case (null) {
                    return false;
                };

                case (?reshareUserId) {
                    return true;
                };
            };
        };
    }
}