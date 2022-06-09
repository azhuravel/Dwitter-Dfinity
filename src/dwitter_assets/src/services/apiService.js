import { Actor } from "@dfinity/agent";
import {idlFactory} from '../../../declarations/user/user.did.js';
import {plugWhitelist} from '../constants';
import AuthService from "../services/authService.js";


const userActorsCache = {};

const makeUserActor = async (canisterPrincipal) => {
    const cachedUserActor = userActorsCache[canisterPrincipal];
    if (cachedUserActor) {
        return cachedUserActor;
    }

    const plug = window?.ic?.plug;

    // https://github.com/Psychedelic/plug/issues/384
    const whitelist = [
        ...plugWhitelist,
        canisterPrincipal,
    ];
    const host = AuthService.getPlugHost();
    await plug.createAgent({whitelist, host});

    const userActor = await plug.createActor({
        canisterId: canisterPrincipal,
        interfaceFactory: idlFactory,
    });
    if (!userActor) {
        return null;
    }

    userActorsCache[canisterPrincipal] = userActor;

    return userActor;
}


class ApiService {
    setDwitterActor(dwitterActor) {
        this.dwitterActor = dwitterActor;
    }

    async getCurrentUser() {
        if (!this.dwitterActor) {
            return null;
        }

        const resp = await this.dwitterActor.getCurrentUser();
        const user = resp?.[0] ?? null;
        console.log('apiService.getCurrentUser()', user);
        return user;
    }

    async getUserByUsername(username) {
        if (!this.dwitterActor) {
            return null;
        }
        
        const resp = await this.dwitterActor.getUserByUsername(username);
        const user = resp?.[0] ?? null;
        console.log('apiService.getUserByUsername()', username, user);

        return user;
    }

    async signUpUser(username, displayname) {
        if (!this.dwitterActor) {
            return null;
        }

        // Check, whether user exists.
        let resp = await this.dwitterActor.getCanisterPrincipalByUsername(username);
        let canisterPrincipal = resp?.[0] ?? null;
        if (canisterPrincipal) {
            return null;
        }

        // Create user canister.
        canisterPrincipal = await this.dwitterActor.createUserCanister({username, displayname});
        
        // Get user info.        
        resp = await this.dwitterActor.getUserByUsername(username);
        const user = resp?.[0] ?? null;

        console.log('apiService.signUpUser()', username, displayname, canisterPrincipal, user);
        return user;
    }

    async getUserPosts(username) {
        if (!this.dwitterActor) {
            return [];
        }

        const resp = await this.dwitterActor.getUserPosts(username);
        const posts = resp?.[0] ?? [];
        console.log('apiService.getUserPosts()', username, posts);
        return posts;
    }

    async createPost(text, nft, kind) {
        if (!this.dwitterActor) {
            return [];
        }

        const resp = await this.dwitterActor.createPost({text, nft, kind});
        const post = resp?.[0] ?? null;
        console.log('apiService.createPost()', text, nft, kind, post);
        return post;
    }
    
    async createUser(username, displayname) {
        const resp = await this.dwitterActor.createUser({username, displayname});
        console.log('apiService.createUser()', username, displayname, resp);
    }

    async buyToken(canisterPrincipal, blockIndex) {      
        const userActor = await makeUserActor(canisterPrincipal);
        const resp = await userActor.recieveToken(blockIndex);
        console.log('apiService.buyToken()', blockIndex, resp);
        return resp;
    }

    async makeUserActor(canisterPrincipal) {
        const userActor = await makeUserActor(canisterPrincipal);
        return userActor;
    }

    async sellToken(canisterPrincipal) {      
        const userActor = await makeUserActor(canisterPrincipal);
        const resp = await userActor.sellToken();
        console.log('apiService.sellToken()', resp);
        return resp;
    }

    async updateUser(username, displayname, bio, nftAvatar) {
        if (!this.dwitterActor) {
            return null;
        }

        await this.dwitterActor.updateUser({
            username, 
            displayname, 
            bio: [bio],
            nftAvatar: nftAvatar,
        });
        
        const resp = await this.dwitterActor.getUserByUsername(username);
        const user = resp?.[0] ?? null;
        console.log('apiService.updateUser()', username, displayname, bio, nftAvatar, resp);
        return user;
    }

    async createPostOnWall(targetUserPrincipal, text, nft, kind) {
        if (!this.dwitterActor) {
            return [];
        }

        const resp = await this.dwitterActor.createPostAndSpendToken({targetUserPrincipal, text, nft, kind});
        const post = resp?.[0] ?? null;
        console.log('apiService.createPostOnWall()', text, nft, kind, post);
        return post;
    }
}

export default ApiService;