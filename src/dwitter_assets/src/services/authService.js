import {idlFactory} from '../../../declarations/dwitter/dwitter.did.js';
import {AuthClient} from "@dfinity/auth-client";
import {canisterId, createActor} from '../../../declarations/dwitter';


const keyLocalStorageAuth = 'authed';
const keyLocalStorageAuth_ii = 'ii';
const keyLocalStorageAuth_plug = 'plug';

const plugWhitelist = [process.env.DWITTER_CANISTER_ID, process.env.DWITTER_ASSETS_CANISTER_ID];

const delay = async (ms) => new Promise(res => setTimeout(res, ms));

const isAnonymous = (identity) => {
    // Проверка на то, что текущий пользователь является анонимом. Подробней:
    // https://forum.dfinity.org/t/checking-if-principal-is-anonymous-in-motoko/9672
    const principal = identity.getPrincipal();
    const principalText = principal.toText();
    return principalText === '2vxsx-fae';
}

const mockDwitterActor = () => {    
    // return null;
    return {
        createPost: async () => {
            await delay(1000);
            return [{
                id: '665444',
                username: 'uuuserrr',
                displayname: 'mockeduser',
                text: 'Created!!!',
                createdTime: 1000000000n,
            }];
        },
        createUser: async () => {
            return [];
        },
        getCurrentUser: async () => { 
            await delay(100);
            return [{
                id: '123123',
                username: 'uuuserrr',
                displayname: 'Mock User',
                createdTime: 1000000000n,
                nftAvatar: null,
                bio: [],
                // nftAvatar: [{
                //     standard: 'EXT',
                //     canisterId: 'sr4qi-vaaaa-aaaah-qcaaq-cai',
                //     index: '1',
                // }],
            }]; 
        },
        getMyPosts: async () => {
            // await delay(500);
            return [[
                {
                    id: '1111111',
                    username: 'uuuserrr',
                    displayname: 'mockeduser',
                    text: 'This is my post @qweqweq @ntynt',
                    createdTime: 1000000000n,
                },
                {
                    id: '2222222',
                    username: 'uuuserrr',
                    displayname: 'mockeduser',
                    text: 'This is my SECOND post @ntynt',
                    createdTime: 1000000000n,
                },
            ]];
        },
        getUserByUsername: async (username) => {
            switch (username) {
                case 'qweqwe':
                    await delay(800);
                    break;
                case 'ntynt':
                    await delay(200);
                    break;
                default:
                    await delay(2000);
            }
            return [{
                id: '123123',
                username: username,
                displayname: 'USER:' + username,
                createdTime: 1000000000n,
                // nftAvatar: null,
                // nftAvatar: [{
                //     standard: 'EXT',
                //     canisterId: 'sr4qi-vaaaa-aaaah-qcaaq-cai',
                //     index: '1',
                // }],
            }]; 
        },
        getUserPosts: async () => {
            await delay(500);
            return [[
                {
                    id: '1111111',
                    username: 'uuuserrr',
                    displayname: 'mockeduser',
                    text: 'This is my post @qweqweq @ntynt',
                    createdTime: 1000000000n,
                },
                {
                    id: '2222222',
                    username: 'uuuserrr',
                    displayname: 'mockeduser',
                    text: 'This is my SECOND post @ntynt',
                    createdTime: 1000000000n,
                },
            ]];
        },
        updateUser: async () => {
            await delay(2000);
            return [{
                id: '123123',
                username: 'uuuserrr',
                displayname: 'Mock User',
                createdTime: 1000000000n,
                // nftAvatar: null,
                nftAvatar: [{
                    canisterId: "3db6u-aiaaa-aaaah-qbjbq-cai",
                    index: "1295",
                    standard: "EXT",
                }],
            }]; 
        },
    };
}

export default class AuthService {
    static async getAuthInfoByPlug() {
        const plug = window?.ic?.plug;
        if (!plug) {
            return {};
        }

        const plugIsConnected = await plug.isConnected();
        if (!plugIsConnected) {
            return {};
        }

        if (!plug.agent) {
            await plug.createAgent({ whitelist: plugWhitelist, host: AuthService.getPlugHost() });
        }

        // Ошибка при запуске локально "Fail to verify certificate" решается запросом rootKey().
        // Подробней: https://forum.dfinity.org/t/fail-to-verify-certificate-in-development-update-calls/4078
        if (process.env.NODE_ENV === 'development') {
            await plug.agent.fetchRootKey();
        }

        const dwitterActor = await plug.createActor({
            canisterId: process.env.DWITTER_CANISTER_ID,
            interfaceFactory: idlFactory,
        });
        const principal = await window.ic.plug.agent.getPrincipal();

        return { dwitterActor, principal };
    }

    static async getAuthInfoByII() {
        const authClient = await AuthClient.create();
        const identity = await authClient.getIdentity();
        if (!authClient.isAuthenticated() || isAnonymous(identity)) {
            return {};
        }
        const dwitterActor = await createActor(process.env.DWITTER_CANISTER_ID, { agentOptions: { identity }});
        const principal = identity.getPrincipal();
        return { dwitterActor, principal };
    }

    static async getCurrentUser(dwitterActor) {
        if (!dwitterActor) {
            return null;
        }

        const userResponse = await dwitterActor.getCurrentUser();
        if (!userResponse) {
            return null;
        }

        const currentUser = userResponse[0];
        if (!currentUser) {
            return null;
        }

        return currentUser;
    }

    static async getAuthCtx() {
        if (process.env.USE_MOCKS) {
            return {dwitterActor: mockDwitterActor(), principal: ''};
        }

        const authedBy = localStorage.getItem(keyLocalStorageAuth);
        let authCtx = {};
        switch (authedBy) {
            case keyLocalStorageAuth_ii:
                authCtx = await AuthService.getAuthInfoByII();
                break;
            case keyLocalStorageAuth_plug:
                authCtx = await AuthService.getAuthInfoByPlug();
                break;
        }

        return authCtx;
    }

    static getPlugHost() {
        // Если приложение запущено локально, то необходимо сообщить Plug, куда переадресовывать 
        // пользователя после аутентификации.
        // По умолчанию plug указывает на production окружение в интернете.
        if (process.env.NODE_ENV === 'development') {
            return `http://${process.env.DWITTER_ASSETS_CANISTER_ID}.localhost:8000`
        }
        return 'https://mainnet.dfinity.network';
    }

    static async loginByPlug() {
        const { dwitterActor, principal } = await AuthService.getAuthInfoByPlug();
        const currentUser = await AuthService.getCurrentUser(dwitterActor);
        localStorage.setItem(keyLocalStorageAuth, keyLocalStorageAuth_plug);
        return { dwitterActor, currentUser, principal };
    }

    static async loginByII() {
        const authClient = await AuthClient.create();
        await new Promise((resolve, reject) => {
            authClient.login({ 
                identityProvider: process.env.II_CANISTER_ID,
                onSuccess: resolve,
                onError: reject,
            });
        });
        const identity = authClient.getIdentity();
        const dwitterActor = createActor(canisterId, { agentOptions: { identity }});
        const currentUser = await AuthService.getCurrentUser(dwitterActor);
        localStorage.setItem(keyLocalStorageAuth, keyLocalStorageAuth_ii);
        const principal = identity.getPrincipal();
        return { dwitterActor, currentUser, principal };
    }

    static async logout() {
        const authedBy = localStorage.getItem(keyLocalStorageAuth);
        switch (authedBy) {
            case keyLocalStorageAuth_ii:
                const authClient = await AuthClient.create();
                authClient.logout();
                break;
        }
        localStorage.removeItem(keyLocalStorageAuth);
    }
}
