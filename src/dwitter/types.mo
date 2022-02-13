import Principal "mo:base/Principal";

module {
  public type UserId = Principal;

  public type Post = {
    id : Nat;
    userId : UserId;
    text : Text;
    createdTime : Int; // import Time "mo:base/Time"; -> doesn't work for unknown reason
  };

  public type PostInfo = {
    id : Nat;
    createdTime : Int;
    text : Text;
    username : Text;
    displayname: Text;
  };

  public type CreatePostRequest = {
    text : Text;
  };

  public type User = {
    id : UserId;
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
  };
};