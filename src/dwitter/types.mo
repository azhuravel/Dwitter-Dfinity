import Principal "mo:base/Principal";

module {
  public type UserId = Principal;

  public type Post = {
    text : Text;
  };
};