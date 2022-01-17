import Principal "mo:base/Principal";

module {
  public type UserId = Principal;

  public type Post = {
    text : Text;
  };

  public type User = {
    id : UserId;
    username : Text;
    displayname : Text;
  };

  public type ApiUser = {
    username : Text;
    displayname : Text;
  };
};