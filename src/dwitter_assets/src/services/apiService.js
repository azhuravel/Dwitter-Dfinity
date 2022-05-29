import { delay } from '../utils/utils.js';
import { Principal } from '@dfinity/principal';
import { getAllUserNFTs, getNFTActor } from '@psychedelic/dab-js';
import { Actor, HttpAgent, getDefaultAgent } from "@dfinity/agent";
import { debug } from 'util';
import { icpAgent } from '../utils/utils.js';


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

    async getUserPosts(username) {
        if (!this.dwitterActor) {
            return [];
        }

        const resp = await this.dwitterActor.getUserPosts(username);
        const posts = resp?.[0] ?? [];
        console.log('apiService.getUserPosts()', username, posts);
        return posts;
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