import { delay } from '../utils/utils.js';

class MockedApiService {
    setDwitterActor(dwitterActor) {}

    async getCurrentUser() {
        await delay(200);
        return {
            bio: [],
            id: 'rno2w-sqaaa-aaaaa-aaacq-cai',
            canisterPrincipal: "rno2w-sqaaa-aaaaa-aaacq-cai",
            createdTime: 1654452070892038000n,
            displayname: "qweqwe",
            nftAvatar: [],
            token: {
                buyPrice: 1_000_000n,
                cap: 0n,
                ownedCount: 0n,
                sellPrice: 0n,
                totalCount: 0n,
                totalLocked: 0n,
            },
            username: "qweqwe",
        };
    }

    async getUserByUsername(username) {
        await delay(200);
        return {
            bio: [],
            canisterPrincipal: "rno2w-sqaaa-aaaaa-aaacq-cai1",
            createdTime: 1654452070892038000n,
            displayname: "asdasd",
            nftAvatar: [],
            token: {
                buyPrice: 1_000_000n,
                cap: 0n,
                ownedCount: 0n,
                sellPrice: 0n,
                totalCount: 0n,
                totalLocked: 0n,
            },
            username: "asdasd",
        };
    }

    async signUpUser(username, displayname) {
        await delay(200);
        return {
            bio: [],
            canisterPrincipal: "rno2w-sqaaa-aaaaa-aaacq-cai",
            createdTime: 1654452070892038000n,
            displayname: displayname,
            nftAvatar: [],
            token: {
                buyPrice: 1_000_000n,
                cap: 0n,
                ownedCount: 0n,
                sellPrice: 0n,
                totalCount: 0n,
                totalLocked: 0n,
            },
            username: username,
        };
    }

    async getUserPosts(username) {
        return [
            {
                createdTime: 1654546395725877000n,
                displayname: "qweqwe",
                id: 6n,
                kind: "TEXT",
                nft: [],
                nftAvatar: [],
                text: "greukghrekuhg bkwefwe fwefjwnefkwe f wefkjbwekf wekf kwejfkwhefjwef wejfkwef kwefjkwebfkjwbefjkwb",
                username: "qweqwe",
                likers: ['rno2w-sqaaa-aaaaa-aaacq-cai'],
                reshareCount: 0,
            },
            {
                createdTime: 1654546395725877001n,
                displayname: "qweqwe",
                id: 6n,
                kind: "TEXT",
                nft: [],
                nftAvatar: [],
                text: "greukghrekuhg 2323 4535345",
                username: "qweqwe",
                likers: [],
                reshareCount: 20,
            }
        ];
    }

    async createPost(text, nft, kind) {
        return {
            createdTime: 1654546395725877000n,
            displayname: "qweqwe",
            id: 6n,
            kind: kind,
            nft: [],
            nftAvatar: [],
            text: text,
            username: "qweqwe",
        };
    }
    
    async createUser(username, displayname) {
    }

    async sharePost() {
    }
    
    async likePost(username, postId) {
    }

    async dislikePost(username, postId) {
    }

    async subscribeToUser(username) {
    }

    async unsubscribeFromUser(username) {
    }

    async buyToken(canisterPrincipal, blockIndex) {
        await delay(200);
        return {
            ok: {
                price: 1_000_000n,
            },
        };
    }

    async makeUserActor(canisterPrincipal) {
        // const userActor = await makeUserActor(canisterPrincipal);
        // return userActor;
    }

    async sellToken(canisterPrincipal) {      
        await delay(200);
        return {
            ok: {
                price: 1_000_000n,
            },
        };
    }

    async updateUser(username, displayname, bio, nftAvatar) {
        await delay(200);
        return {
            bio: [],
            canisterPrincipal: "rno2w-sqaaa-aaaaa-aaacq-cai",
            createdTime: 1654452070892038000n,
            displayname: displayname,
            nftAvatar: [],
            token: {
                buyPrice: 10000000n,
                cap: 0n,
                ownedCount: 0n,
                sellPrice: 0n,
                totalCount: 0n,
                totalLocked: 0n,
            },
            username: username,
        };
    }

    async createPostOnWall(targetUserPrincipal, text, nft, kind) {
        return {
            createdTime: 1654546395725877000n,
            displayname: "qweqwe",
            id: 6n,
            kind: kind,
            nft: [],
            nftAvatar: [],
            text: text,
            username: "qweqwe",
        };
    }
}

export default MockedApiService;