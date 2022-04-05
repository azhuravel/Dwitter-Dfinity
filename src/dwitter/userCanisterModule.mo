import Types "./types";
import Map "mo:base/HashMap";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import UserModule "./user";
import Iter "mo:base/Iter";

module {
    type User = Types.User;
    type UserId = Types.UserId;
    type UserCanister = UserModule.UserCanister;

    public class UserCanisterService() {
        let userCanisters = Map.HashMap<UserId, UserCanister>(1, isEq, Principal.hash);
        let byUsername = Map.HashMap<Text, UserId>(1, Text.equal, Text.hash);

        public func create(user : User) : async UserCanister {
            let userCanister = await UserModule.UserCanister();
            await userCanister.updateUser(user);
            userCanisters.put(user.id, userCanister);
            byUsername.put(user.username, user.id);
            return userCanister;
        };

        public func getByUserId(userId : UserId) : ?UserCanister {
            return userCanisters.get(userId);
        };

        public func getByUsername(username : Text) : ?UserCanister {
            let userId = byUsername.get(username);
            switch (userId) {
                case (null) {
                    return null;
                };
                case (?userId) {
                    return userCanisters.get(userId);
                };
            };
        };

        // public func toArray() : [UserCanister] {
        //     return Iter.toArray(userCanisters.vals());
        // };

        // public func fromArray(array : [UserCanister])  {
        //     for (userCanister in array.vals()) {
        //         let user = userCanister.getUser();
        //         switch (user) {
        //             case (null) {  }; // nothing, should throw exception
        //             case (?user) {
        //                 userCanisters.put(user.id, userCanister);
        //                 byUsername.put(user.username, user.id);
        //             };
        //         }
        //     };
        // };
    };

    func isEq(x: UserId, y: UserId): Bool { 
        x == y 
    };
}