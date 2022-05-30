import { Actor } from "@dfinity/agent";
import {idlFactory} from '../../../declarations/user/user.did.js';


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

    async getUserByUsername2(username) {
        // Get user canisterId.
        let resp = await this.dwitterActor.getCanisterPrincipalByUsername(username);
        let canisterPrincipal = resp?.[0] ?? null;
        if (!canisterPrincipal) {
            return null;
        }
        
        // Get user info.        
        const plug = window?.ic?.plug;
        const userActor = await plug.createActor({
            canisterId: canisterPrincipal,
            interfaceFactory: idlFactory,
        });
        resp = await userActor.getUserInfo();
        user = resp?.[0] ?? null;

        console.log('apiService.getUserByUsername2()', username, user);
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
        const plug = window?.ic?.plug;
        const userActor = await plug.createActor({
            canisterId: canisterPrincipal,
            interfaceFactory: idlFactory,
        });
        resp = await userActor.getUserInfo();
        user = resp?.[0] ?? null;

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
}

export default ApiService;