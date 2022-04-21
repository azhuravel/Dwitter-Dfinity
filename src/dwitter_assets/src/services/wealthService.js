// RosettaApi is an open-source specification for integrating with blockchain
// About RosettaApi: https://www.rosetta-api.org/docs/welcome.html
// About RosettaApi for Dfinity: https://smartcontracts.org/docs/integration/ledger-quick-start.html
//
// The implemenation in rosettaApi.js is really copy paste from https://www.stoicwallet.com/
import RosettaApi from '../utils/rosettaApi.js';

import { Actor } from "@dfinity/agent";
import { principalToAccountIdentifier, icpAgent } from '../utils/utils.js';
import nftService from './nftService.js';
import extIDL from './candid/ext.did.js';
import { debug } from 'util';

const delay = async (ms) => new Promise(res => setTimeout(res, ms));

class WealthService {
    constructor(nftService, icpAgent) {
        this.rosettaApi = new RosettaApi();
        this.nftService = nftService;
        this.icpAgent = icpAgent;
    }
    
    // returns accountIdentifier - wallet, in simple words
    static getAccountIdentifier(principal) {
        // the second param '0' is for main accountIdentifier (main wallet) of principal
        return principalToAccountIdentifier(principal, 0);
    }

    // get balance by accountIdentifier (wallet, in simple words)
    async getBalance(accountIdentifier) {
        return await this.getAssetsWealth(null);

        // if (process.env.USE_MOCKS) {
        //     //delay(200);
        //     return await getAssetsWealth(null);
        // }

        // return this.rosettaApi.getAccountBalance(accountIdentifier);
    }

    nftStandardMap = {
        'EXT' : extIDL
    }

    async getAssetsWealth(principal) {
        // 1. get all NFTs
        // 2. map NFTs to {standard, canisterId, count} 
        // 3. map [standard] to avg price by stats method
        // 4. sum the numbers and calculate the total wealth
        const collections = await this.nftService.getAllCollections(principal);
        let wealth = 0;

        for (let collection of collections) {
            const standard = collection.standard;
            const count = collection.tokens.length;
            const canisterId = collection.canisterId;
            let idl;
            
            if (this.nftStandardMap.hasOwnProperty(standard)) {
                idl = this.nftStandardMap[standard];
            } else {
                throw new Error(idl + " is not a preloaded IDL");
            }

            // actor of nft collection
            const nftActor = Actor.createActor(idl, {agent : this.icpAgent, canisterId});
            const stats = await this.getStats(nftActor);
            if (stats.average) { // if not, than impossible to calculate
                wealth += stats.average * count;
            }
        }
        return wealth;
    }

    getStats(nftActor) { // copy paste from Enterpot
        return new Promise((resolve, reject) => {
            try {
              nftActor.stats().then(r => {
                resolve({
                  total : (Number(r[0]/1000000n)/100).toFixed(2),
                  high : (Number(r[1]/1000000n)/100).toFixed(2),
                  low : (Number(r[2]/1000000n)/100).toFixed(2),
                  floor : (Number(r[3]/1000000n)/100).toFixed(2),
                  listings : Number(r[4]),
                  tokens : Number(r[5]),
                  sales : Number(r[6]),
                  average : (Number(r[6]) ? (Number((r[0]/r[6])/1000000n)/100).toFixed(2) : null),
                });
              }).catch(reject);
            } catch(e) {
              reject(e);
            };
          });
    }
}

const wealthService = new WealthService(nftService, icpAgent);

export default wealthService;