import Types "./types";
import UserCanisterModule "./userCanisterModule";
import UserModule "./user";

import Time "mo:base/Time";
import Array "mo:base/Array";
import Principal "mo:base/Principal";

module {
    type UserId = Types.UserId;
    type User = Types.User;
    type UserInfo = Types.UserInfo;
    type CreateUserRequest = Types.CreateUserRequest;
    type UpdateUserRequest = Types.UpdateUserRequest;
    type UserCanisterService = UserCanisterModule.UserCanisterService;
    type UserCanister = UserModule.UserCanister;

    public class UserService(userCanisterService : UserCanisterService) {
        public func get(caller : Principal, userId : UserId) : async ?UserInfo {
            let userCanister = userCanisterService.getByUserId(userId);
            switch (userCanister) {
                case (null) { return null };
                case (?userCanister) { 
                    //ignore await userCanisterService.upgradeAndTopUp(userCanister);
                    return await userCanister.getUserInfo(caller);
                };
            }
        };

        public func getByUsername(caller : Principal, username : Text) : async ?UserInfo {
            let userCanister = userCanisterService.getByUsername(username);
            switch (userCanister) {
                case (null) { return null };
                case (?userCanister) { 
                    //ignore await userCanisterService.upgradeAndTopUp(userCanister);
                    return await userCanister.getUserInfo(caller);
                };
            }
        };

        public func getCanisterPrincipalByUsername(username : Text) : ?Text {
            return userCanisterService.getCanisterPrincipalByUsername(username);
        };

        public func topUp(username : Text) : async () {
            let userCanister = userCanisterService.getByUsername(username);
            switch (userCanister) {
                case (null) { };
                case (?userCanister) { 
                    await userCanisterService.upgradeAndTopUp(userCanister);
                };
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

        public func createCanister(userId : UserId, request : CreateUserRequest) : async Text {
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

            return Principal.toText( Principal.fromActor(userCanister) );
        };

        public func update(userId : UserId, request : UpdateUserRequest) : async ?User {
            let userCanister = userCanisterService.getByUserId(userId);
            switch(userCanister) {
                case(null) { 
                    return null; // TODO: it should throw an exception
                };
                case(?userCanister) { 
                    let user = await userCanister.getUser();
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
            }
        };

        public func getAllUsersPrincipals() : [Text] {
            return userCanisterService.getAllUsersIds();
        }
    }
}