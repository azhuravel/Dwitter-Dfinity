import Types "./types";
import Storage "./storage";
import PostModule "./postService";
import UserModule "./userService";
import Principal "mo:base/Principal";

/*
 * The Dwitter actor serves as the only API for frontend
 */
actor {
    /*
     * Storages and services
     */

    let postsStorage: Storage.Posts = Storage.Posts();
    let usersStorage: Storage.Users = Storage.Users();

    let postService: PostModule.PostService = PostModule.PostService(postsStorage, usersStorage);
    let userService: UserModule.UserService = UserModule.UserService(usersStorage);

    /*
     * Data types
     */

    type UserId = Types.UserId;
    type User = Types.User;
    type CreateUserRequest = Types.CreateUserRequest;
    type UpdateUserRequest = Types.UpdateUserRequest;

    type Post = Types.Post;
    type PostInfo = Types.PostInfo;
    type CreatePostRequest = Types.CreatePostRequest;

    /*
     * User methods
     */

    public shared(msg) func getCurrentUser(): async ?User {
        userService.get(msg.caller)
    };

    public shared(msg) func getUserByUsername(username : Text): async ?User  {
        usersStorage.getByUsername(username)
    };

    public shared(msg) func createUser(request : CreateUserRequest): async ?User {
        ?userService.create(msg.caller, request)
    };

    public shared(msg) func updateUser(request : UpdateUserRequest): async ?User {
        userService.update(msg.caller, request)
    };

    /*
     * Posts methods
     */

    public shared(msg) func createPost(request : CreatePostRequest): async() {
        postService.createPost(msg.caller, request)
    };

    public shared(msg) func getMyPosts(): async ?[PostInfo] {
        postService.getByUserId(msg.caller)
    };

    public func getUserPosts(username : Text): async ?[PostInfo] {
        postService.getByUsername(username)
    };

    /*
     * Canister upgrade logic
     */

    stable var posts : [Post] = [];
    stable var users : [User] = []; 

    system func preupgrade() {
        posts := postService.toArray();
        users := userService.toArray();
    };

    system func postupgrade() {
        postService.fromArray(posts);
        userService.fromArray(users);
    };
};