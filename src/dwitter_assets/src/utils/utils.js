import { Principal } from '@dfinity/principal';
import { getCrc32 } from '@dfinity/principal/lib/esm/utils/getCrc';
import { sha224 } from '@dfinity/principal/lib/esm/utils/sha224';
import { HttpAgent } from "@dfinity/agent";
import fetch from 'cross-fetch';


const principalToAccountIdentifier = (principal, s) => {
    if (typeof principal === 'string' || principal instanceof String) {
        principal = Principal.fromText(principal);
    }
    
    const padding = Buffer("\x0Aaccount-id");
    const array = new Uint8Array([
        ...padding,
        ...principal.toUint8Array(),
        ...getSubAccountArray(s)
    ]);
    const hash = sha224(array);
    const checksum = to32bits(getCrc32(hash));
    const array2 = new Uint8Array([
        ...checksum,
        ...hash
    ]);
    return toHexString(array2);
};

const getSubAccountArray = (s) => {
    if (Array.isArray(s)){
        return s.concat(Array(32-s.length).fill(0));
    } else {
        //32 bit number only
        return Array(28).fill(0).concat(to32bits(s ? s : 0))
    }
};

const to32bits = num => {
    let b = new ArrayBuffer(4);
    new DataView(b).setUint32(0, num);
    return Array.from(new Uint8Array(b));
};

const toHexString = (byteArray) => {
    return Array.from(byteArray, function(byte) {
      return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('')
};

const delay = async (ms) => new Promise(res => setTimeout(res, ms));

// Get common promise and return cancalable promise.
// Manual:
// https://reactjs.org/blog/2015/12/16/ismounted-antipattern.html
const makeCancelable = (promise) => {
    let canceled = false;

    const wrappedPromise = new Promise((resolve, reject) => {
        promise.then(
            val => canceled ? reject({isCanceled: true}) : resolve(val),
            error => canceled ? reject({isCanceled: true}) : reject(error)
        );
    });

    return {
        promise: wrappedPromise,
        cancel: () => canceled = true,
    };
};

const icpAgent = new HttpAgent({ fetch, host: 'https://ic0.app/' });

export {
    principalToAccountIdentifier,
    delay,
    makeCancelable,
    icpAgent,
}

