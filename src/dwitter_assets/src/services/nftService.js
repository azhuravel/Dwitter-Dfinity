import { delay } from '../utils/utils.js';
import { Principal } from '@dfinity/principal';
import { getAllUserNFTs, getNFTActor } from '@psychedelic/dab-js';


class NftService {
    constructor() {}

    async getAllCollections(principalId) {
        // return getAllUserNFTs({ user: Principal.fromText(principalId) });
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(JSON.parse(`[{"name":"Internet Astronauts","canisterId":"sr4qi-vaaaa-aaaah-qcaaq-cai","standard":"EXT","description":"Internet Astronauts is a collection of 10,000 unique digital astronaut NFT collectibles only found on the Internet Computer.","icon":"https://storageapi2.fleek.co/fleek-team-bucket/logos/internetastro.jpeg","tokens":[{"id":"uwp7j-hikor-uwiaa-aaaaa-b4aqa-eaqca-aacbk-q","index":"4181","canister":"sr4qi-vaaaa-aaaah-qcaaq-cai","metadata":[0,13,4,0,0],"url":"https://sr4qi-vaaaa-aaaah-qcaaq-cai.raw.ic0.app/?type=thumbnail&tokenid=uwp7j-hikor-uwiaa-aaaaa-b4aqa-eaqca-aacbk-q","standard":"EXT","collection":"Internet Astronauts"},{"id":"2nrad-6ikor-uwiaa-aaaaa-b4aqa-eaqca-aaesq-a","index":"9376","canister":"sr4qi-vaaaa-aaaah-qcaaq-cai","metadata":[4,37,5,15,0],"url":"https://sr4qi-vaaaa-aaaah-qcaaq-cai.raw.ic0.app/?type=thumbnail&tokenid=2nrad-6ikor-uwiaa-aaaaa-b4aqa-eaqca-aaesq-a","standard":"EXT","collection":"Internet Astronauts"}]},{"name":"Wrapped IC Drip","canisterId":"3db6u-aiaaa-aaaah-qbjbq-cai","standard":"EXT","description":"IC Drip are randomly generated NFTs with meta-commerce shopping carts for outfits and personas stored on chain on the Internet Computer.","icon":"https://d3ttm-qaaaa-aaaai-qam4a-cai.raw.ic0.app/?tokenId=1","tokens":[{"id":"t4xsk-6qkor-uwiaa-aaaaa-b4aki-maqca-aaamg-q","index":"781","canister":"3db6u-aiaaa-aaaah-qbjbq-cai","metadata":[0],"url":"https://d3ttm-qaaaa-aaaai-qam4a-cai.raw.ic0.app?tokenId=781","standard":"EXT","collection":"Wrapped IC Drip"},{"id":"e556h-uakor-uwiaa-aaaaa-b4aki-maqca-aaauh-q","index":"1295","canister":"3db6u-aiaaa-aaaah-qbjbq-cai","metadata":[0],"url":"https://d3ttm-qaaaa-aaaai-qam4a-cai.raw.ic0.app?tokenId=1295","standard":"EXT","collection":"Wrapped IC Drip"},{"id":"u3fs5-fikor-uwiaa-aaaaa-b4aki-maqca-aabxu-q","index":"3561","canister":"3db6u-aiaaa-aaaah-qbjbq-cai","metadata":[0],"url":"https://d3ttm-qaaaa-aaaai-qam4a-cai.raw.ic0.app?tokenId=3561","standard":"EXT","collection":"Wrapped IC Drip"},{"id":"df4et-3ykor-uwiaa-aaaaa-b4aki-maqca-aacab-q","index":"4099","canister":"3db6u-aiaaa-aaaah-qbjbq-cai","metadata":[0],"url":"https://d3ttm-qaaaa-aaaai-qam4a-cai.raw.ic0.app?tokenId=4099","standard":"EXT","collection":"Wrapped IC Drip"},{"id":"74ohq-kqkor-uwiaa-aaaaa-b4aki-maqca-aacrk-q","index":"5205","canister":"3db6u-aiaaa-aaaah-qbjbq-cai","metadata":[0],"url":"https://d3ttm-qaaaa-aaaai-qam4a-cai.raw.ic0.app?tokenId=5205","standard":"EXT","collection":"Wrapped IC Drip"},{"id":"xjapp-wqkor-uwiaa-aaaaa-b4aki-maqca-aaao7-q","index":"959","canister":"3db6u-aiaaa-aaaah-qbjbq-cai","metadata":[0],"url":"https://d3ttm-qaaaa-aaaai-qam4a-cai.raw.ic0.app?tokenId=959","standard":"EXT","collection":"Wrapped IC Drip"},{"id":"pm5tb-jikor-uwiaa-aaaaa-b4aki-maqca-aac76-a","index":"6140","canister":"3db6u-aiaaa-aaaah-qbjbq-cai","metadata":[0],"url":"https://d3ttm-qaaaa-aaaai-qam4a-cai.raw.ic0.app?tokenId=6140","standard":"EXT","collection":"Wrapped IC Drip"},{"id":"apocz-3qkor-uwiaa-aaaaa-b4aki-maqca-aadwv-a","index":"7594","canister":"3db6u-aiaaa-aaaah-qbjbq-cai","metadata":[0],"url":"https://d3ttm-qaaaa-aaaai-qam4a-cai.raw.ic0.app?tokenId=7594","standard":"EXT","collection":"Wrapped IC Drip"},{"id":"4xhru-gykor-uwiaa-aaaaa-b4aki-maqca-aadbv-a","index":"6250","canister":"3db6u-aiaaa-aaaah-qbjbq-cai","metadata":[0],"url":"https://d3ttm-qaaaa-aaaai-qam4a-cai.raw.ic0.app?tokenId=6250","standard":"EXT","collection":"Wrapped IC Drip"},{"id":"52g4y-2ykor-uwiaa-aaaaa-b4aki-maqca-aadmp-q","index":"6943","canister":"3db6u-aiaaa-aaaah-qbjbq-cai","metadata":[0],"url":"https://d3ttm-qaaaa-aaaai-qam4a-cai.raw.ic0.app?tokenId=6943","standard":"EXT","collection":"Wrapped IC Drip"},{"id":"d3zdl-wykor-uwiaa-aaaaa-b4aki-maqca-aadya-a","index":"7680","canister":"3db6u-aiaaa-aaaah-qbjbq-cai","metadata":[0],"url":"https://d3ttm-qaaaa-aaaai-qam4a-cai.raw.ic0.app?tokenId=7680","standard":"EXT","collection":"Wrapped IC Drip"},{"id":"av3s5-yikor-uwiaa-aaaaa-b4aki-maqca-aabwf-q","index":"3467","canister":"3db6u-aiaaa-aaaah-qbjbq-cai","metadata":[0],"url":"https://d3ttm-qaaaa-aaaai-qam4a-cai.raw.ic0.app?tokenId=3467","standard":"EXT","collection":"Wrapped IC Drip"},{"id":"nvpet-lakor-uwiaa-aaaaa-b4aki-maqca-aadme-a","index":"6920","canister":"3db6u-aiaaa-aaaah-qbjbq-cai","metadata":[0],"url":"https://d3ttm-qaaaa-aaaai-qam4a-cai.raw.ic0.app?tokenId=6920","standard":"EXT","collection":"Wrapped IC Drip"},{"id":"rkmnl-vykor-uwiaa-aaaaa-b4aki-maqca-aac25-q","index":"5819","canister":"3db6u-aiaaa-aaaah-qbjbq-cai","metadata":[0],"url":"https://d3ttm-qaaaa-aaaai-qam4a-cai.raw.ic0.app?tokenId=5819","standard":"EXT","collection":"Wrapped IC Drip"},{"id":"o7tzx-pikor-uwiaa-aaaaa-b4aki-maqca-aaa3c-q","index":"1733","canister":"3db6u-aiaaa-aaaah-qbjbq-cai","metadata":[0],"url":"https://d3ttm-qaaaa-aaaai-qam4a-cai.raw.ic0.app?tokenId=1733","standard":"EXT","collection":"Wrapped IC Drip"},{"id":"yi7of-qakor-uwiaa-aaaaa-b4aki-maqca-aabjj-q","index":"2643","canister":"3db6u-aiaaa-aaaah-qbjbq-cai","metadata":[0],"url":"https://d3ttm-qaaaa-aaaai-qam4a-cai.raw.ic0.app?tokenId=2643","standard":"EXT","collection":"Wrapped IC Drip"},{"id":"o6msv-qikor-uwiaa-aaaaa-b4aki-maqca-aabn4-a","index":"2936","canister":"3db6u-aiaaa-aaaah-qbjbq-cai","metadata":[0],"url":"https://d3ttm-qaaaa-aaaai-qam4a-cai.raw.ic0.app?tokenId=2936","standard":"EXT","collection":"Wrapped IC Drip"},{"id":"krdsb-oqkor-uwiaa-aaaaa-b4aki-maqca-aab6l-a","index":"3990","canister":"3db6u-aiaaa-aaaah-qbjbq-cai","metadata":[0],"url":"https://d3ttm-qaaaa-aaaai-qam4a-cai.raw.ic0.app?tokenId=3990","standard":"EXT","collection":"Wrapped IC Drip"},{"id":"bhktj-bikor-uwiaa-aaaaa-b4aki-maqca-aaceh-q","index":"4367","canister":"3db6u-aiaaa-aaaah-qbjbq-cai","metadata":[0],"url":"https://d3ttm-qaaaa-aaaai-qam4a-cai.raw.ic0.app?tokenId=4367","standard":"EXT","collection":"Wrapped IC Drip"},{"id":"kceap-4ykor-uwiaa-aaaaa-b4aki-maqca-aacnp-q","index":"4959","canister":"3db6u-aiaaa-aaaah-qbjbq-cai","metadata":[0],"url":"https://d3ttm-qaaaa-aaaai-qam4a-cai.raw.ic0.app?tokenId=4959","standard":"EXT","collection":"Wrapped IC Drip"},{"id":"yyp4x-2akor-uwiaa-aaaaa-b4aki-maqca-aacs3-a","index":"5302","canister":"3db6u-aiaaa-aaaah-qbjbq-cai","metadata":[0],"url":"https://d3ttm-qaaaa-aaaai-qam4a-cai.raw.ic0.app?tokenId=5302","standard":"EXT","collection":"Wrapped IC Drip"},{"id":"ajyfv-wakor-uwiaa-aaaaa-b4aki-maqca-aadr6-q","index":"7293","canister":"3db6u-aiaaa-aaaah-qbjbq-cai","metadata":[0],"url":"https://d3ttm-qaaaa-aaaai-qam4a-cai.raw.ic0.app?tokenId=7293","standard":"EXT","collection":"Wrapped IC Drip"},{"id":"mp22w-2qkor-uwiaa-aaaaa-b4aki-maqca-aad2h-q","index":"7823","canister":"3db6u-aiaaa-aaaah-qbjbq-cai","metadata":[0],"url":"https://d3ttm-qaaaa-aaaai-qam4a-cai.raw.ic0.app?tokenId=7823","standard":"EXT","collection":"Wrapped IC Drip"},{"id":"5daxm-sikor-uwiaa-aaaaa-b4aki-maqca-aaau4-q","index":"1337","canister":"3db6u-aiaaa-aaaah-qbjbq-cai","metadata":[0],"url":"https://d3ttm-qaaaa-aaaai-qam4a-cai.raw.ic0.app?tokenId=1337","standard":"EXT","collection":"Wrapped IC Drip"},{"id":"2oxvn-aikor-uwiaa-aaaaa-b4aki-maqca-aaaum-q","index":"1305","canister":"3db6u-aiaaa-aaaah-qbjbq-cai","metadata":[0],"url":"https://d3ttm-qaaaa-aaaai-qam4a-cai.raw.ic0.app?tokenId=1305","standard":"EXT","collection":"Wrapped IC Drip"},{"id":"hn6tf-eqkor-uwiaa-aaaaa-b4aki-maqca-aacsw-a","index":"5292","canister":"3db6u-aiaaa-aaaah-qbjbq-cai","metadata":[0],"url":"https://d3ttm-qaaaa-aaaai-qam4a-cai.raw.ic0.app?tokenId=5292","standard":"EXT","collection":"Wrapped IC Drip"},{"id":"rbrji-bakor-uwiaa-aaaaa-b4aki-maqca-aadxy-a","index":"7664","canister":"3db6u-aiaaa-aaaah-qbjbq-cai","metadata":[0],"url":"https://d3ttm-qaaaa-aaaai-qam4a-cai.raw.ic0.app?tokenId=7664","standard":"EXT","collection":"Wrapped IC Drip"},{"id":"nbl2r-4ykor-uwiaa-aaaaa-b4aki-maqca-aac7s-a","index":"6116","canister":"3db6u-aiaaa-aaaah-qbjbq-cai","metadata":[0],"url":"https://d3ttm-qaaaa-aaaai-qam4a-cai.raw.ic0.app?tokenId=6116","standard":"EXT","collection":"Wrapped IC Drip"},{"id":"3dsdn-pikor-uwiaa-aaaaa-b4aki-maqca-aabjd-q","index":"2631","canister":"3db6u-aiaaa-aaaah-qbjbq-cai","metadata":[0],"url":"https://d3ttm-qaaaa-aaaai-qam4a-cai.raw.ic0.app?tokenId=2631","standard":"EXT","collection":"Wrapped IC Drip"},{"id":"h652h-fykor-uwiaa-aaaaa-b4aki-maqca-aaarh-a","index":"1102","canister":"3db6u-aiaaa-aaaah-qbjbq-cai","metadata":[0],"url":"https://d3ttm-qaaaa-aaaai-qam4a-cai.raw.ic0.app?tokenId=1102","standard":"EXT","collection":"Wrapped IC Drip"},{"id":"fpce5-jakor-uwiaa-aaaaa-b4aki-maqca-aabhx-q","index":"2543","canister":"3db6u-aiaaa-aaaah-qbjbq-cai","metadata":[0],"url":"https://d3ttm-qaaaa-aaaai-qam4a-cai.raw.ic0.app?tokenId=2543","standard":"EXT","collection":"Wrapped IC Drip"},{"id":"hgo2t-fikor-uwiaa-aaaaa-b4aki-maqca-aabon-a","index":"2970","canister":"3db6u-aiaaa-aaaah-qbjbq-cai","metadata":[0],"url":"https://d3ttm-qaaaa-aaaai-qam4a-cai.raw.ic0.app?tokenId=2970","standard":"EXT","collection":"Wrapped IC Drip"},{"id":"hmmvs-oqkor-uwiaa-aaaaa-b4aki-maqca-aabvw-a","index":"3436","canister":"3db6u-aiaaa-aaaah-qbjbq-cai","metadata":[0],"url":"https://d3ttm-qaaaa-aaaai-qam4a-cai.raw.ic0.app?tokenId=3436","standard":"EXT","collection":"Wrapped IC Drip"},{"id":"yvkew-hikor-uwiaa-aaaaa-b4aki-maqca-aabzh-a","index":"3662","canister":"3db6u-aiaaa-aaaah-qbjbq-cai","metadata":[0],"url":"https://d3ttm-qaaaa-aaaai-qam4a-cai.raw.ic0.app?tokenId=3662","standard":"EXT","collection":"Wrapped IC Drip"},{"id":"xt77j-cikor-uwiaa-aaaaa-b4aki-maqca-aab7i-q","index":"4049","canister":"3db6u-aiaaa-aaaah-qbjbq-cai","metadata":[0],"url":"https://d3ttm-qaaaa-aaaai-qam4a-cai.raw.ic0.app?tokenId=4049","standard":"EXT","collection":"Wrapped IC Drip"},{"id":"7nffm-mqkor-uwiaa-aaaaa-b4aki-maqca-aabmt-a","index":"2854","canister":"3db6u-aiaaa-aaaah-qbjbq-cai","metadata":[0],"url":"https://d3ttm-qaaaa-aaaai-qam4a-cai.raw.ic0.app?tokenId=2854","standard":"EXT","collection":"Wrapped IC Drip"}]},{"name":"ETH Flower","canisterId":"dhiaa-ryaaa-aaaae-qabva-cai","standard":"EXT","description":"ETH Flower, the second of Ludo’s Flower Trilogy, and the continuation of his techno-flower chimera.","icon":"https://storageapi2.fleek.co/fleek-team-bucket/logos/950x950.png","tokens":[{"id":"2p6ah-3qkor-uwiaa-aaaaa-beaan-iaqca-aaaef-q","index":"267","canister":"dhiaa-ryaaa-aaaae-qabva-cai","url":"https://dhiaa-ryaaa-aaaae-qabva-cai.raw.ic0.app/?type=thumbnail&tokenid=2p6ah-3qkor-uwiaa-aaaaa-beaan-iaqca-aaaef-q","standard":"EXT","collection":"ETH Flower"},{"id":"5feve-iakor-uwiaa-aaaaa-beaan-iaqca-aaafv-a","index":"362","canister":"dhiaa-ryaaa-aaaae-qabva-cai","url":"https://dhiaa-ryaaa-aaaae-qabva-cai.raw.ic0.app/?type=thumbnail&tokenid=5feve-iakor-uwiaa-aaaaa-beaan-iaqca-aaafv-a","standard":"EXT","collection":"ETH Flower"}]},{"name":"BTC Flower","canisterId":"pk6rk-6aaaa-aaaae-qaazq-cai","standard":"EXT","description":"2009 unique NFTs by Paris-based street artist Ludo on the Internet Computer.","icon":"https://storageapi2.fleek.co/fleek-team-bucket/logos/btcflower.png","tokens":[{"id":"dyd6t-yakor-uwiaa-aaaaa-beaag-maqca-aaaxm-a","index":"1496","canister":"pk6rk-6aaaa-aaaae-qaazq-cai","url":"https://pk6rk-6aaaa-aaaae-qaazq-cai.raw.ic0.app/?type=thumbnail&tokenid=dyd6t-yakor-uwiaa-aaaaa-beaag-maqca-aaaxm-a","standard":"EXT","collection":"BTC Flower"},{"id":"kfarf-yykor-uwiaa-aaaaa-beaag-maqca-aaa3a-q","index":"1729","canister":"pk6rk-6aaaa-aaaae-qaazq-cai","url":"https://pk6rk-6aaaa-aaaae-qaazq-cai.raw.ic0.app/?type=thumbnail&tokenid=kfarf-yykor-uwiaa-aaaaa-beaag-maqca-aaa3a-q","standard":"EXT","collection":"BTC Flower"}]},{"name":"Starverse","canisterId":"nbg4r-saaaa-aaaah-qap7a-cai","standard":"EXT","description":"Starverse is an NFT collection of rare and unique Stars, a collaboration between DSCVR and ToniqLabs. The Starverse symbolizes the unlimited potential of the Internet Computer with it’s infinite size and unstoppable nature.","icon":"https://nbg4r-saaaa-aaaah-qap7a-cai.raw.ic0.app/?tokenid=wdyem-pikor-uwiaa-aaaaa-b4ad7-yaqca-aacsh-a","tokens":[{"id":"7453k-mykor-uwiaa-aaaaa-b4ad7-yaqca-aabbr-a","index":"2146","canister":"nbg4r-saaaa-aaaah-qap7a-cai","metadata":[1,10,4,0,4,5,3,5],"url":"https://nbg4r-saaaa-aaaah-qap7a-cai.raw.ic0.app/?type=thumbnail&tokenid=7453k-mykor-uwiaa-aaaaa-b4ad7-yaqca-aabbr-a","standard":"EXT","collection":"Starverse"}]},{"name":"Motoko Day Drop","canisterId":"oeee4-qaaaa-aaaak-qaaeq-cai","standard":"EXT","description":"Motoko-themed NFT Collection on the Internet Computer.","icon":"https://oeee4-qaaaa-aaaak-qaaeq-cai.raw.ic0.app/?cc=0&type=thumbnail&tokenid=w5txv-gakor-uwiaa-aaaaa-cuaab-eaqca-aadhc-a","tokens":[{"id":"asgar-oykor-uwiaa-aaaaa-cuaab-eaqca-aaa3e-q","index":"1737","canister":"oeee4-qaaaa-aaaak-qaaeq-cai","url":"https://oeee4-qaaaa-aaaak-qaaeq-cai.raw.ic0.app/?type=thumbnail&tokenid=asgar-oykor-uwiaa-aaaaa-cuaab-eaqca-aaa3e-q","standard":"EXT","collection":"Motoko Day Drop"}]}]`));
            }, 1);
        });
    }
    
    async getDigestedNfts(principalId) {
        return this.getAllCollections(principalId)
            .then((collections) => {
                const digestedNfts = [];
                collections.map((collection) => {
                    collection.tokens.map((token, idx) => {
                        if (idx >= 2) {
                            return;
                        }

                        digestedNfts.push({
                            id: token.id,
                            url: token.url,
                        });
                    });
                });
                return digestedNfts.slice(0, 10);
            });
    }
}

const nftService = new NftService();

export default nftService;