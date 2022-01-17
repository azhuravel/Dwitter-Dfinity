import Types "./types";
import Storage "./storage";
import Principal "mo:base/Principal";

actor {
    var postsStorage: Storage.Posts = Storage.Posts();
    var usersStorage: Storage.Users = Storage.Users();

    type Post = Types.Post;
    type UserId = Types.UserId;
    type User = Types.User;
    type ApiUser = Types.ApiUser;

    public shared(msg) func savePost(post : Post): async() {
        postsStorage.savePost(msg.caller, post)
    };

    public shared(msg) func getPosts(): async ?[Post] {
        postsStorage.getPosts(msg.caller)
    };

    public shared(msg) func getUserPosts(username : Text): async ?[Post] {
        let user = usersStorage.getByUsername(username);
        // TODO: (minor) move ugly switch to storage level somehow..
        switch(user) {
            case (null) {
                return null;
            };
            case (?user) {
                return postsStorage.getPosts(user.id);
            }
        }
    };

    public func getUsers(): async [UserId] {
        postsStorage.getUsers()
    };

    public shared(msg) func getCurrentUser(): async ?User {
        usersStorage.get(msg.caller)
    };

    public shared(msg) func saveUser(apiUser : ApiUser): async() {
        // TODO: add validation
        let user : User = object {
            public let id = msg.caller; 
            public let username = apiUser.username;
            public let displayname = apiUser.displayname;
        };
        usersStorage.saveUser(msg.caller, user)
    };

    public shared(msg) func getByUsername(username : Text): async ?User  {
        usersStorage.getByUsername(username);
    };
};