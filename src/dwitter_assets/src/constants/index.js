export const appState_notLoggedIn = 0;
export const appState_loading = 1;
export const appState_registrationPage = 2;
export const appState_loggedIn = 3;

export const postKind_text = 'TEXT';

export const plugWhitelist = [
    process.env.DWITTER_CANISTER_ID, 
    process.env.DWITTER_ASSETS_CANISTER_ID,
];

export const POST_MAX_LENGTH = 140;