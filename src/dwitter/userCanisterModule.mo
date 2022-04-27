import Types "./types";
import Map "mo:base/HashMap";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import UserModule "./user";
import Iter "mo:base/Iter";
import Array "mo:base/Array";
import Cycles "mo:base/ExperimentalCycles";

module {
    type User = Types.User;
    type UserId = Types.UserId;
    type UserCanister = UserModule.UserCanister;

    /* Serialization info */
    public type UsersCanistersInfo = {
        userCanistersEntries : [(UserId, Text)]; // store Principal to create UserCanister
        byUsernameEntries : [(Text, UserId)];
    };

    /* Canister managment types and methods */
    type CanisterSettings = {
        controller : ?Principal;
        compute_allocation : ?Nat;
        memory_allocation : ?Nat;
        freezing_threshold : ?Nat;
    };
    let IC = actor ("aaaaa-aa") : actor {
        update_settings : {canister_id  : Principal; settings : CanisterSettings} -> async ();
    };

    /* Service */
    public class UserCanisterService(dwitterOwner : Principal) {
        let userCanisters = Map.HashMap<UserId, Text>(1, isEq, Principal.hash);
        let byUsername = Map.HashMap<Text, UserId>(1, Text.equal, Text.hash);

        public func create(user : User) : async UserCanister {
            // sponsor the transactions: +10% from needed
            Cycles.add(210000000000); // the sum is x2.1 from the needed to create a canister
            // TODO: to add cycles to canister when needed

            // create user canister
            let userCanister = await UserModule.UserCanister();

            // transfer rights to the Dwitter owner
            await changeCanisterController(Principal.fromActor(userCanister));

            // write the user data to canister
            await userCanister.updateUser(user);

            // add the canister in maps (indexes in nutshell)
            let canisterPrincipal = Principal.toText(Principal.fromActor(userCanister));
            userCanisters.put(user.id, canisterPrincipal);
            byUsername.put(user.username, user.id);

            return userCanister;
        };

        public func getByUserId(userId : UserId) : ?UserCanister {
            let principal = userCanisters.get(userId);
            switch(principal) {
                case (null) { return null; };
                case (?principal) {
                    let userCanister : UserCanister = actor(principal);
                    return ?userCanister;
                } 
            }
        };

        public func getByUsername(username : Text) : ?UserCanister {
            let userId = byUsername.get(username);
            switch (userId) {
                case (null) {
                    return null;
                };
                case (?userId) {
                    return getByUserId(userId);
                };
            };
        };

        func changeCanisterController(canisterId : Principal) : async() {
            let settings : CanisterSettings = {
                controller = ?dwitterOwner;
                compute_allocation = null;
                memory_allocation = null;
                freezing_threshold = null;
            };

            await IC.update_settings(
                {
                    canister_id = canisterId;
                    settings = settings;
                }
            );
        };

        public func getAllUsersIds() : [Text] {
            return Iter.toArray(userCanisters.vals());
        };

        public func serialize() : UsersCanistersInfo {
            let data : UsersCanistersInfo = {
                userCanistersEntries = Iter.toArray(userCanisters.entries());
                byUsernameEntries = Iter.toArray(byUsername.entries());
            };
            return data;
        };

        public func deserialize(info : UsersCanistersInfo)  {
            for (entry in info.userCanistersEntries.vals()) {
                let userId = entry.0;
                let canisterPrincipal = entry.1;

                userCanisters.put(userId, canisterPrincipal);
            };

            for (entry in info.byUsernameEntries.vals()) {
                let username = entry.0;
                let userId = entry.1;

                byUsername.put(username, userId);
            };
        };
    };

    func isEq(x: UserId, y: UserId): Bool { 
        x == y 
    };
}