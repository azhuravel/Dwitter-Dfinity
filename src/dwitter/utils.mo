import Hash "mo:base/Hash";
import Array "mo:base/Array";
import Principal "mo:base/Principal";
import Char "mo:base/Char";
import Blob "mo:base/Blob";
import Nat8 "mo:base/Nat8";
import SHA224 "./SHA224";
import CRC32 "./CRC32";
import HashMap "mo:base/HashMap";
import Nat "mo:base/Nat";
import Option "mo:base/Option";
import Nat32 "mo:base/Nat32";
import Nat64 "mo:base/Nat64";
import Iter "mo:base/Iter";
import Text "mo:base/Text";

module {
    /// Account Identitier type.   
    public type AccountIdentifier = Blob;

    private let symbols = [
        '0', '1', '2', '3', '4', '5', '6', '7',
        '8', '9', 'a', 'b', 'c', 'd', 'e', 'f',
    ];
    private let base : Nat8 = 0x10;

    /// Convert bytes array to hex string.       
    /// E.g `[255,255]` to "ffff"
    public func encode(array : [Nat8]) : Text {
        Array.foldLeft<Nat8, Text>(array, "", func (accum, u8) {
            accum # nat8ToText(u8);
        });
    };

    /// Convert a byte to hex string.
    /// E.g `255` to "ff"
    func nat8ToText(u8: Nat8) : Text {
        let c1 = symbols[Nat8.toNat((u8/base))];
        let c2 = symbols[Nat8.toNat((u8%base))];
        return Char.toText(c1) # Char.toText(c2);
    };

    public func principalToArray(p : Principal) : [Nat8] {
        let digest = SHA224.Digest();
        digest.write([10, 97, 99, 99, 111, 117, 110, 116, 45, 105, 100]:[Nat8]); // b"\x0Aaccount-id"
        let blob = Principal.toBlob(p);
        digest.write(Blob.toArray(blob));
        digest.write(Array.freeze<Nat8>(Array.init<Nat8>(32, 0 : Nat8))); // sub account
        let hash_bytes = digest.sum();
        return hash_bytes;
    };

    /// Return the account identifier of the Principal.
    public func principalToAccount(p : Principal) : AccountIdentifier {
        let array = principalToArray(p);
        return Blob.fromArray(array);
    };

     /// Return the Text of the account identifier.
    public func accountToText(p : AccountIdentifier) : Text {
        let arr = Blob.toArray(p);
        let crc = CRC32.crc32(arr);
        let aid_bytes = Array.append<Nat8>(crc, arr);

        return encode(aid_bytes);
    };

    public func hashNat64(n : Nat64) : Nat32 {
        let _n : Nat = Nat64.toNat(n);
        return Hash.hash(_n);
    };
}