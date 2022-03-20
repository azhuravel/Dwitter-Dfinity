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