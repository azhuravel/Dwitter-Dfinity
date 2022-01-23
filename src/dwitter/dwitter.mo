import Types "./types";
import Storage "./storage";
import PostService "./postService";
import Principal "mo:base/Principal";

actor {
    var postsStorage: Storage.Posts = Storage.Posts();
    var usersStorage: Storage.Users = Storage.Users();
    var postService: PostService.PostService = PostService.PostService(postsStorage, usersStorage);
    // TODO: impl UserService and UserInfo entity
    //var userService: UserService = UserService(postsStorage, usersStorage);

    type UserId = Types.UserId;
    type User = Types.User;
    type ApiUser = Types.ApiUser;

    type Post = Types.Post;
    type PostInfo = Types.PostInfo;
    type CreatePostRequest = Types.CreatePostRequest;

    public shared(msg) func savePost(request : CreatePostRequest): async() {
        postService.savePost(msg.caller, request)
    };

    public shared(msg) func getMyPosts(): async ?[PostInfo] {
        postService.getByUserId(msg.caller);
    };

    public func getUserPosts(username : Text): async ?[PostInfo] {
        postService.getByUsername(username);
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