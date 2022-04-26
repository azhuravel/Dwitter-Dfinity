import Types "./types";
import UserCanisterModule "./userCanisterModule";
import UserModule "./user";

import Time "mo:base/Time";
import Array "mo:base/Array";

module {
    type UserId = Types.UserId;
    type User = Types.User;
    type CreateUserRequest = Types.CreateUserRequest;
    type UpdateUserRequest = Types.UpdateUserRequest;
    type UserCanisterService = UserCanisterModule.UserCanisterService;
    type UserCanister = UserModule.UserCanister;

    public class UserService(userCanisterService : UserCanisterService) {
        public func get(userId : UserId) : async ?User {
            let userCanister = userCanisterService.getByUserId(userId);
            switch (userCanister) {
                case (null) { return null };
                case (?userCanister) { return await userCanister.getUser() };
            }
        };

        public func getByUsername(username : Text) : async ?User {
            let userCanister = userCanisterService.getByUsername(username);
            switch (userCanister) {
                case (null) { return null };
                case (?userCanister) { return await userCanister.getUser() };
            }
        };

        public func create(userId : UserId, request : CreateUserRequest) : async User {
            // assert await get(userId) == null;

            // TODO: add validation of request fields

            let now = Time.now();
            let user : User = {
                id = userId;
                createdTime = now;
                username = request.username;
                displayname = request.displayname;
                nftAvatar = null;
                bio = null;
            };

            let userCanister = await userCanisterService.create(user);

            return user;
        };

        public func update(userId : UserId, request : UpdateUserRequest) : async ?User {
            let userCanister = userCanisterService.getByUserId(userId);
            switch(userCanister) {
                case(null) { 
                    return null; // TODO: it should throw an exception
                };
                case(?userCanister) { 
                    let user = await userCanister.getUser();
                    switch (user) {
                        case(null) {  }; // nothing, throw an exception
                        case (?user) { 
                            let updatedUser : User = {
                                id = user.id;
                                createdTime = user.createdTime;
                                username = user.username;
                                displayname = request.displayname;
                                nftAvatar = request.nftAvatar;
                                bio = request.bio;
                            };
                            await userCanister.updateUser(updatedUser);
                            return ?updatedUser;
                        };
                    };
                    return user;
                };
            }
        };

        public func getAllUsersPrincipals() : [UserId] {
            return userCanisterService.getAllUsersIds();
        }
    }
}