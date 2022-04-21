// RosettaApi is an open-source specification for integrating with blockchain
// About RosettaApi: https://www.rosetta-api.org/docs/welcome.html
// About RosettaApi for Dfinity: https://smartcontracts.org/docs/integration/ledger-quick-start.html
//
// The implemenation in rosettaApi.js is really copy paste from https://www.stoicwallet.com/
import RosettaApi from '../../utils/rosettaApi.js';

import { Actor } from "@dfinity/agent";
import { principalToAccountIdentifier, icpAgent } from '../../utils/utils.js';
import nftService from '../nftService.js';

import hzldIDL from './candid/hzld.did.js'; // comment from Enterpot: "hardcode to hzld..."
import extIDL from './candid/ext.did.js';
import advancedIDL from './candid/advanced.did.js';
import wrapperIDL from './candid/wrapper.did.js';
import icpunksIDL from './candid/icpunks.did.js';
import icdripIDL from './candid/icdrip.did.js';
import icpuppy from './candid/icpuppy.js';
import ictuts from './candid/ictuts.js';
import mintregister from './candid/mintregister.did.js';
import moonwalkerIDL from './candid/moonwalker.did.js';
import ic3dIDL from './candid/ic3d.did.js';
import pokedIDL from './candid/poked.did.js';
import icapesIDL from './candid/icapes.did.js';
import departureIDL from './candid/departure.did.js';
import imaginationIDL from './candid/imagination.did.js';

const delay = async (ms) => new Promise(res => setTimeout(res, ms));

class WealthService {
    // DAB standard list: https://github.com/Psychedelic/DAB-js/blob/main/src/registries/nfts_registry.ts
    // map from DAB standard to IDL
    standardMap = {
        'DepartureLabs' : departureIDL,
        'ICPunks' : icpunksIDL,
        'EXT' : extIDL
      };

    // copy paste from Entrepot
    cidStandardMap = {
        "qz7gu-giaaa-aaaaf-qaaka-cai" : hzldIDL,
        "kxh4l-cyaaa-aaaah-qadaq-cai" : advancedIDL,
        "bxdf4-baaaa-aaaah-qaruq-cai" : wrapperIDL,
        "y3b7h-siaaa-aaaah-qcnwa-cai" : wrapperIDL,
        "jeghr-iaaaa-aaaah-qco7q-cai" : wrapperIDL,
        "4nvhy-3qaaa-aaaah-qcnoq-cai" : icpunksIDL,
        "qcg3w-tyaaa-aaaah-qakea-cai" : icpunksIDL,
        "d3ttm-qaaaa-aaaai-qam4a-cai" : icdripIDL,
        "3db6u-aiaaa-aaaah-qbjbq-cai" : wrapperIDL,
        "bzsui-sqaaa-aaaah-qce2a-cai" : pokedIDL,
        "ctt6t-faaaa-aaaah-qcpbq-cai" : icapesIDL,
        "3mttv-dqaaa-aaaah-qcn6q-cai" : icapesIDL,
        "v3zkd-syaaa-aaaah-qcm5a-cai" : icapesIDL,
        "unssi-hiaaa-aaaah-qcmya-cai" : icapesIDL,
        "zvycl-fyaaa-aaaah-qckmq-cai" : icapesIDL,
        "px5ub-qqaaa-aaaah-qcjxa-cai" : imaginationIDL,
        "njgly-uaaaa-aaaah-qb6pa-cai" : icpuppy,
        "ahl3d-xqaaa-aaaaj-qacca-cai" : ictuts,
        "er7d4-6iaaa-aaaaj-qac2q-cai" : moonwalkerIDL,
        "nfvlz-jaaaa-aaaah-qcciq-cai" : ic3dIDL,
        "xkbqi-2qaaa-aaaah-qbpqq-cai" : icpunksIDL,
        "q6hjz-kyaaa-aaaah-qcama-cai" : wrapperIDL,
        "fl5nr-xiaaa-aaaai-qbjmq-cai" : departureIDL,
        "33uhc-liaaa-aaaah-qcbra-cai" : mintregister,
    }

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
    async getBalance(principal) {
        if (process.env.USE_MOCKS) {
            delay(200);
            return 101;
        }

        const accountIdentifier = WealthService.getAccountIdentifier(principal);
        return this.rosettaApi
                .getAccountBalance(accountIdentifier)
                .then((balance) => (Number(balance) / 100000000).toFixed(2));
    }

    async getNftWealth(principal) {
        if (process.env.USE_MOCKS) {
            delay(200);
            return 501;
        }

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
            
            if (this.cidStandardMap.hasOwnProperty(canisterId)) {
                idl = this.cidStandardMap[canisterId];
            } else if (this.standardMap.hasOwnProperty(standard)) {
                idl = this.standardMap[standard];
            } else {
                // by default try to invoke as EXT 
                idl = extIDL;
            }

            try {
                // actor of nft collection
                const nftActor = Actor.createActor(idl, {agent : this.icpAgent, canisterId});
                const stats = await this.getStats(nftActor);
                if (stats.average) { // if not, than impossible to calculate
                    wealth += stats.average * count;
                }
            } catch (e) {
                console.error(e, e.stack);
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