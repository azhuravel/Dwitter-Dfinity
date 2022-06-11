import {idlFactory} from '../../../declarations/dwitter/dwitter.did.js';
import {appState_notLoggedIn, appState_registrationPage, appState_loggedIn} from '../constants';
import {plugWhitelist} from '../constants';


const keyLocalStorageAuth = 'authed_v3';

export default class AuthService {
    static async _getDwitterActorFromPlug() {
        const plug = window?.ic?.plug;
        if (!plug) {
            return {};
        }

        const plugIsConnected = await plug.isConnected();
        if (!plugIsConnected) {
            return {};
        }

        if (!plug.agent) {
            await plug.createAgent({ 
                whitelist: plugWhitelist, 
                host: AuthService.getPlugHost(),
            });
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
        const principal = await plug.agent.getPrincipal();

        return {dwitterActor, principal};
    }

    static async getDwitterActorFromPlug() {
        const authedBy = localStorage.getItem(keyLocalStorageAuth);
        if (!authedBy) {
            return {};
        }
        return await AuthService._getDwitterActorFromPlug();
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
        localStorage.setItem(keyLocalStorageAuth, true);
        return await AuthService._getDwitterActorFromPlug();
    }

    static async logout() {
        localStorage.removeItem(keyLocalStorageAuth);
    }

    static getAppState(dwitterActor, currentUser) {
        if (!dwitterActor && !currentUser) {
            return appState_notLoggedIn;
        } else if (dwitterActor && !currentUser) {
            return appState_registrationPage;
        } else if (dwitterActor && currentUser) {
            return appState_loggedIn;
        }
        return appState_notLoggedIn;
    }
}
