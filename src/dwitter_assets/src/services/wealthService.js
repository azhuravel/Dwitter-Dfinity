// RosettaApi is an open-source specification for integrating with blockchain
// About RosettaApi: https://www.rosetta-api.org/docs/welcome.html
// About RosettaApi for Dfinity: https://smartcontracts.org/docs/integration/ledger-quick-start.html
//
// The implemenation in rosettaApi.js is really copy paste from https://www.stoicwallet.com/
import RosettaApi from './rosettaApi.js';

import { principalToAccountIdentifier } from '../services/utils.js';

const rosettaApi = new RosettaApi();

export default class WealthService {
    static getAccountIdentifier(principal) {
        return principalToAccountIdentifier(principal, 0);
    }

    static async getBalance(accountIdentifier) {
        return rosettaApi.getAccountBalance(accountIdentifier, 0); // 0 is for main wallet
    }
}