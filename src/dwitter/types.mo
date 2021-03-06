import Nat64 "mo:base/Nat64";
import Principal "mo:base/Principal";

module {
  public type UserId = Principal;

  public type NftId = {
    standard: Text;
    canisterId: Text;
    index: Text;
  };

  public type Post = {
    id : Nat;
    userId : UserId;
    userCanister : ?Text;
    createdTime : Int; // import Time "mo:base/Time"; -> doesn't work for unknown reason
    kind : Text;
    nft : ?NftId;
    text : Text;
  };

  public type PostInfo = {
    id : Nat;
    kind : Text;
    createdTime : Int;
    text : Text;
    nft : ?NftId;
    username : Text;
    displayname: Text;
    nftAvatar : ?NftId;
  };

  public type CreatePostRequest = {
    kind : Text;
    text : Text;
    nft : ?NftId;
  };

  public type CreatePostAndSpendTokenRequest = {
    targetUserPrincipal : Text;
    kind : Text;
    text : Text;
    nft : ?NftId;
  };

  public type User = {
    id : UserId;
    nftAvatar : ?NftId;
    createdTime : Int;
    username : Text;
    displayname : Text;
    bio : ?Text;
  };

  public type UserInfo = {
    canisterPrincipal : Text; // plug transfer TO (for celebrity)
    accountIdentifier : Text;
    nftAvatar : ?NftId;
    createdTime : Int;
    username : Text;
    displayname : Text;
    bio : ?Text;
    token : UserTokenInfo;
    balance : Nat64;
  };

  public type UserTokenInfo = {
    // info for all users
    buyPrice : Nat64; // price to buy next token
    sellPrice : Nat64; // last bought price, 0 if no transactions
    cap : Nat64; // last bought price, 0 if no transactions
    totalCount : Nat64; // count of tokens in circulation
    totalLocked : Nat64; // value locked (sum price of totalCount tokens)

    // info specific for the caller user
    ownedCount : Nat64; // count of owned tokens
  };

  public type TokenResponse = {
    #ok : {
      price : Nat64
    };

    #err : { 
      text : Text 
    };
  };

  public type CreateUserRequest = {
    username : Text;
    displayname : Text;
  };

  public type UpdateUserRequest = {
    displayname : Text;
    nftAvatar : ?NftId;
    bio : ?Text;
  };

  public type CanisterInfo = {
    version : Nat;
    cyclesBalance : Nat;
  };
};