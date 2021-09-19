import Types "./types";
import Storage "./storage";

actor {
    var postsStorage: Storage.Posts = Storage.Posts();

    type Post = Types.Post;
    type UserId = Types.UserId;

    public shared(msg) func savePost(post : Post): async() {
        postsStorage.savePost(msg.caller, post)
    };

    public shared(msg) func getPosts(): async ?[Post] {
        postsStorage.getPosts(msg.caller)
    };

    public func getUsers(): async [UserId] {
        postsStorage.getUsers()
    };
};