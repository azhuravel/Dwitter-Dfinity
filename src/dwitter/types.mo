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
  };

  public type CreatePostRequest = {
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
  };

  public type CreateUserRequest = {
    username : Text;
    displayname : Text;
  };

  public type UpdateUserRequest = {
    displayname : Text;
    nftAvatar : ?NftId;
  };
};