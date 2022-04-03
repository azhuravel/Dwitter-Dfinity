// RosettaApi is an open-source specification for integrating with blockchain
// About RosettaApi: https://www.rosetta-api.org/docs/welcome.html
// About RosettaApi for Dfinity: https://smartcontracts.org/docs/integration/ledger-quick-start.html
//
// The implemenation in rosettaApi.js is really copy paste from https://www.stoicwallet.com/
import RosettaApi from '../utils/rosettaApi.js';
import { principalToAccountIdentifier } from '../utils/utils.js';

const delay = async (ms) => new Promise(res => setTimeout(res, ms));

class WealthService {
    constructor() {
        this.rosettaApi = new RosettaApi();
    }
    
    // returns accountIdentifier - wallet, in simple words
    static getAccountIdentifier(principal) {
        // the second param '0' is for main accountIdentifier (main wallet) of principal
        return principalToAccountIdentifier(principal, 0);
    }

    // get balance by accountIdentifier (wallet, in simple words)
    async getBalance(accountIdentifier) {
        if (process.env.USE_MOCKS) {
            delay(200);
            return 777;
        }

        return this.rosettaApi.getAccountBalance(accountIdentifier);
    }
}

const wealthService = new WealthService();

export default wealthService;