import {idlFactory} from '../../../declarations/dwitter/dwitter.did.js';
import {AuthClient} from "@dfinity/auth-client";
import {canisterId, createActor} from '../../../declarations/dwitter';

const plugWhitelist = [process.env.DWITTER_CANISTER_ID, process.env.DWITTER_ASSETS_CANISTER_ID];

const isAnonymous = (identity) => {
    // Проверка на то, что текущий пользователь является анонимом. Подробней:
    // https://forum.dfinity.org/t/checking-if-principal-is-anonymous-in-motoko/9672
    const principal = identity.getPrincipal();
    const principalText = principal.toText();
    return principalText === "2vxsx-fae";
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

        // Ошибка "Fail to verify certificate" решается запросом rootKey().
        // Подробней: https://forum.dfinity.org/t/fail-to-verify-certificate-in-development-update-calls/4078
        await plug.agent.fetchRootKey();

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
        const authedBy = localStorage.getItem('authed');
        console.log('authedBy = ', authedBy);
        let dwitterActor = null;
        switch (authedBy) {
            case 'ii':
                dwitterActor = await AuthService.getDwitterActorByII();
                break;
            case 'plug':
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
        return '';
    }

    static async loginByII() {
        const authClient = await AuthClient.create();
        await authClient.login({ identityProvider: process.env.LOCAL_II_CANISTER });
        const identity = await authClient.getIdentity();
        const dwitterActor = await createActor(canisterId, { agentOptions: { identity }});
        const currentUser = await AuthService.getCurrentUser(dwitterActor);
        return {dwitterActor, currentUser};
    }
}
