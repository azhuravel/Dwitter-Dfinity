import { delay } from '../utils/utils.js';

class MockedApiService {
    setDwitterActor(dwitterActor) {}

    async getCurrentUser() {
        await delay(200);
        return {
            bio: [],
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
        await delay(2000);
        return {
            bio: [],
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
                text: "greukghrekuhg",
                username: "qweqwe",
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