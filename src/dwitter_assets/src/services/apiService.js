import { Actor } from "@dfinity/agent";
import {idlFactory} from '../../../declarations/user/user.did.js';
import {plugWhitelist} from '../constants';
import AuthService from "./authService.js";


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

const logger = (str, ...args) => {
    console.log(+(new Date()) + ': ' + str, ...args);
}


class ApiService {
    setDwitterActor(dwitterActor) {
        this.dwitterActor = dwitterActor;
    }

    async getCurrentUser() {
        logger('START apiService.getCurrentUser()');
        if (!this.dwitterActor) {
            return null;
        }

        const resp = await this.dwitterActor.getCurrentUser();
        const user = resp?.[0] ?? null;
        logger('END apiService.getCurrentUser()', user);
        return user;
    }

    async getUserByUsername(username) {
        logger('START apiService.getUserByUsername()', username);
        if (!this.dwitterActor) {
            return null;
        }
        
        const resp = await this.dwitterActor.getUserByUsername(username);
        const user = resp?.[0] ?? null;
        logger('END apiService.getUserByUsername()', username, user);

        return user;
    }

    async signUpUser(username, displayname) {
        logger('START apiService.signUpUser()', username, displayname);
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

        logger('END apiService.signUpUser()', username, displayname, canisterPrincipal, user);
        return user;
    }

    async getUserPosts(username) {
        logger('START apiService.getUserPosts()', username);
        if (!this.dwitterActor) {
            return [];
        }

        const resp = await this.dwitterActor.getUserPosts(username);
        const posts = resp?.[0] ?? [];
        logger('END apiService.getUserPosts()', username, posts);
        return posts;
    }

    async getFeed(username) {
        logger('START apiService.getUserPosts()', username);
        const resp = await this.dwitterActor.getFeed();
        const posts = resp?.[0] ?? [];
        logger('END apiService.getUserPosts()');
        return posts;
    }

    async createPost(text, nft, kind) {
        logger('START apiService.createPost()', text, nft, kind);
        if (!this.dwitterActor) {
            return [];
        }

        const resp = await this.dwitterActor.createPost({text, nft, kind});
        const post = resp?.[0] ?? null;
        logger('END apiService.createPost()', text, nft, kind, post);
        return post;
    }
    
    async createUser(username, displayname) {
        logger('START apiService.createUser()', username, displayname);
        const resp = await this.dwitterActor.createUser({username, displayname});
        logger('END apiService.createUser()', username, displayname, resp);
    }

    async likePost(username, postId) {
        logger('START apiService.likePost()', username, postId);
        const resp = await this.dwitterActor.likePost({username, postId});
        logger('END apiService.likePost()', username, postId, resp);
    }

    async dislikePost(username, postId) {
        logger('START apiService.dislikePost()', username, postId);
        const resp = await this.dwitterActor.dislikePost({username, postId});
        logger('END apiService.dislikePost()', username, postId, resp);
    }

    async subscribeToUser(username) {
        logger('START apiService.subscribeToUser()', username);
        const resp = await this.dwitterActor.subscribe({username});
        logger('END apiService.subscribeToUser()', username, resp);
    }

    async unsubscribeFromUser(username) {
        logger('START apiService.unsubscribeFromUser()', username);
        const resp = await this.dwitterActor.unsubscribe({username});
        logger('END apiService.unsubscribeFromUser()', username, resp);
    }

    async sharePost() {
    }

    async buyToken(canisterPrincipal, blockIndex) {      
        logger('START apiService.buyToken()', blockIndex);
        const userActor = await makeUserActor(canisterPrincipal);
        const resp = await userActor.recieveToken(blockIndex);
        logger('END apiService.buyToken()', blockIndex, resp);
        return resp;
    }

    async makeUserActor(canisterPrincipal) {
        const userActor = await makeUserActor(canisterPrincipal);
        return userActor;
    }

    async sellToken(canisterPrincipal) {      
        logger('START apiService.sellToken()');
        const userActor = await makeUserActor(canisterPrincipal);
        const resp = await userActor.sellToken();
        logger('END apiService.sellToken()', resp);
        return resp;
    }

    async updateUser(username, displayname, bio, nftAvatar) {
        logger('START apiService.updateUser()', username, displayname, bio, nftAvatar);
        if (!this.dwitterActor) {
            return null;
        }

        if (!bio) {
            bio = [];
        } else {
            bio = [bio];
        }

        await this.dwitterActor.updateUser({ 
            displayname, 
            bio: bio,
            nftAvatar: nftAvatar,
        });
        
        const resp = await this.dwitterActor.getUserByUsername(username);
        const user = resp?.[0] ?? null;
        logger('END apiService.updateUser()', username, displayname, bio, nftAvatar, resp);
        return user;
    }

    async createPostOnWall(targetUserPrincipal, text, nft, kind) {
        logger('START apiService.createPostOnWall()', text, nft, kind);
        if (!this.dwitterActor) {
            return [];
        }

        const reshareUserId = [];
        const resharePostId = [];
        const reshareDisplayname = [];
        const reshareUsername = [];


        const resp = await this.dwitterActor.createPost({text, nft, kind, reshareUserId, resharePostId, reshareDisplayname, reshareUsername});
        const post = resp?.[0] ?? null;
        logger('END apiService.createPostOnWall()', text, nft, kind, post);
        return post;
    }
}

export default ApiService;