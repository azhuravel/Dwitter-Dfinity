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
    return {
        createPost: async () => {
            return [];
        },
        createUser: async () => {
            return [];
        },
        getCurrentUser: async () => { 
            // await delay(1000);
            return [{
                id: '123123',
                username: 'mockeduser',
                displayname: 'Mock User',
                createdTime: 1000000000n,
            }]; 
        },
        getMyPosts: async () => {
            return [];
        },
        getUserByUsername: async () => {
            // await delay(800);
            return [{
                id: '123123',
                username: 'qweqweq',
                displayname: 'Mock User 2',
                createdTime: 1000000000n,
            }]; 
        },
        getUserPosts: async () => {
            await delay(500);
            return [[
                {
                    id: '1111111',
                    username: 'mockeduser',
                    displayname: 'mockeduser',
                    text: 'This is my post @qweqweq',
                    createdTime: 1000000000n,
                },
                {
                    id: '2222222',
                    username: 'mockeduser',
                    displayname: 'mockeduser',
                    text: 'This is my SECOND post @ntynt',
                    createdTime: 1000000000n,
                },
            ]];
        },
        updateUser: async () => {
            return [];
        },
    };
}

export default class AuthService {
    static async getDwitterActorByPlug() {
        const plug = window?.ic?.plug;
        if (!plug) {
            return;
        }

        const plugIsConnected = await plug.isConnected();
        if (!plugIsConnected) {
            return;
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
        return dwitterActor;
    }

    static async getDwitterActorByII() {
        const authClient = await AuthClient.create();
        const identity = await authClient.getIdentity();
        if (!authClient.isAuthenticated() || isAnonymous(identity)) {
            return;
        }
        const dwitterActor = await createActor(process.env.DWITTER_CANISTER_ID, { agentOptions: { identity }});
        return dwitterActor;
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


    static async getDwitterActor() {
        if (process.env.USE_MOCKS) {
            return mockDwitterActor();
        }

        const authedBy = localStorage.getItem(keyLocalStorageAuth);
        let dwitterActor = null;
        switch (authedBy) {
            case keyLocalStorageAuth_ii:
                dwitterActor = await AuthService.getDwitterActorByII();
                break;
            case keyLocalStorageAuth_plug:
                dwitterActor = await AuthService.getDwitterActorByPlug();
                break;
        }
        return dwitterActor;
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
        const dwitterActor = await AuthService.getDwitterActorByPlug();
        const currentUser = await AuthService.getCurrentUser(dwitterActor);
        localStorage.setItem(keyLocalStorageAuth, keyLocalStorageAuth_plug);
        return {dwitterActor, currentUser};
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
        const identity = await authClient.getIdentity();
        const dwitterActor = await createActor(canisterId, { agentOptions: { identity }});
        const currentUser = await AuthService.getCurrentUser(dwitterActor);
        localStorage.setItem(keyLocalStorageAuth, keyLocalStorageAuth_ii);
        return {dwitterActor, currentUser};
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
