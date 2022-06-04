import Hash "mo:base/Hash";
import Array "mo:base/Array";
import Principal "mo:base/Principal";
import Char "mo:base/Char";
import Blob "mo:base/Blob";
import Nat8 "mo:base/Nat8";
import SHA224 "./SHA224";
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

    /// Return the account identifier of the Principal.
    public func principalToAccount(p : Principal) : AccountIdentifier {
        let digest = SHA224.Digest();
        digest.write([10, 97, 99, 99, 111, 117, 110, 116, 45, 105, 100]:[Nat8]); // b"\x0Aaccount-id"
        let blob = Principal.toBlob(p);
        digest.write(Blob.toArray(blob));
        digest.write(Array.freeze<Nat8>(Array.init<Nat8>(32, 0 : Nat8))); // sub account
        let hash_bytes = digest.sum();
        let accountIdentifier = Blob.fromArray(hash_bytes);

        return accountIdentifier;
    };

    public func hashNat64(n : Nat64) : Nat32 {
        let _n : Nat = Nat64.toNat(n);
        return Hash.hash(_n);
    };
}