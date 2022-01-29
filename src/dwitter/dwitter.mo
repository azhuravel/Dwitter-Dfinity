import Types "./types";
import Storage "./storage";
import PostModule "./postService";
import UserModule "./userService";
import Principal "mo:base/Principal";

actor {
    let postsStorage: Storage.Posts = Storage.Posts();
    let usersStorage: Storage.Users = Storage.Users();

    let postService: PostModule.PostService = PostModule.PostService(postsStorage, usersStorage);
    let userService: UserModule.UserService = UserModule.UserService(usersStorage);

    type UserId = Types.UserId;
    type User = Types.User;
    type CreateUserRequest = Types.CreateUserRequest;
    type UpdateUserRequest = Types.UpdateUserRequest;

    type Post = Types.Post;
    type PostInfo = Types.PostInfo;
    type CreatePostRequest = Types.CreatePostRequest;

    public shared(msg) func savePost(request : CreatePostRequest): async() {
        postService.savePost(msg.caller, request)
    };

    public shared(msg) func getMyPosts(): async ?[PostInfo] {
        postService.getByUserId(msg.caller)
    };

    public func getUserPosts(username : Text): async ?[PostInfo] {
        postService.getByUsername(username)
    };

    public shared(msg) func getCurrentUser(): async ?User {
        userService.get(msg.caller)
    };

    public shared(msg) func getByUsername(username : Text): async ?User  {
        usersStorage.getByUsername(username)
    };

    public shared(msg) func createUser(request : CreateUserRequest): async ?User {
        ?userService.save(msg.caller, request)
    };

    public shared(msg) func updateUser(request : UpdateUserRequest): async ?User {
        userService.update(msg.caller, request)
    };
};