import Types "./types";
import PostModule "./postService";
import UserModule "./userService";
import UserCanisterModule "./userCanisterModule";

import Principal "mo:base/Principal";

/*
 * The Dwitter actor serves as the only API for frontend
 */
actor {
    /*
     * Services
     */

    let userCanisterService: UserCanisterModule.UserCanisterService  = UserCanisterModule.UserCanisterService();

    let postService: PostModule.PostService = PostModule.PostService(userCanisterService);
    let userService: UserModule.UserService = UserModule.UserService(userCanisterService);

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
        await userService.get(msg.caller)
    };

    public shared(msg) func getUserByUsername(username : Text): async ?User  {
        await userService.getByUsername(username)
    };

    public shared(msg) func createUser(request : CreateUserRequest): async User {
        await userService.create(msg.caller, request)
    };

    public shared(msg) func updateUser(request : UpdateUserRequest): async ?User {
        await userService.update(msg.caller, request)
    };

    // public shared(msg) func getAllUsers(): async [User] {
    //     userService.toArray()
    // };

    /*
     * Posts methods
     */

    public shared(msg) func createPost(request : CreatePostRequest): async ?PostInfo {
        await postService.createPost(msg.caller, request)
    };

    public shared(msg) func getMyPosts(): async ?[PostInfo] {
        await postService.getByUserId(msg.caller)
    };

    public func getUserPosts(username : Text): async ?[PostInfo] {
        await postService.getByUsername(username)
    };
};