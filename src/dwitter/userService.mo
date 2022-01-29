import Array "mo:base/Array";
import Types "./types";
import Storage "./storage";

module {
    type UserId = Types.UserId;
    type User = Types.User;
    type CreateUserRequest = Types.CreateUserRequest;
    type UpdateUserRequest = Types.UpdateUserRequest;

    public class UserService(usersStorage: Storage.Users) {
        public func get(userId : UserId) : ?User {
            usersStorage.get(userId)
        };

        public func getByUsername(userId : UserId) : ?User {
            usersStorage.get(userId)
        };

        public func save(userId : UserId, request : CreateUserRequest) : User {
            assert get(userId) == null;

            // TODO: add validation of request fields

            let user : User = {
                id = userId; 
                username = request.username;
                displayname = request.displayname;
            };

            usersStorage.save(userId, user)
        };

        public func update(userId : UserId, request : UpdateUserRequest) : ?User {
            let user = usersStorage.get(userId);
            switch(user) {
                case(null) { null };
                case(?user) { 
                    let updatedUser : User = {
                        id = user.id;
                        username = user.username;
                        displayname = request.displayname;
                    };
                    ?usersStorage.save(user.id, updatedUser); // TODO: optimize
                };
            }
        };
    }
}