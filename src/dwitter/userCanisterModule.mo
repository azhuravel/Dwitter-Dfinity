import Types "./types";
import Map "mo:base/HashMap";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import UserModule "./user";
import Iter "mo:base/Iter";
import Array "mo:base/Array";
import Cycles "mo:base/ExperimentalCycles";

import canisterManager "./canisterManager";

module {
    type User = Types.User;
    type UserId = Types.UserId;
    type UserCanister = UserModule.UserCanister;

    /* Serialization info */
    public type UsersCanistersInfo = {
        userCanistersEntries : [(UserId, Text)]; // store Principal to create UserCanister
        byUsernameEntries : [(Text, UserId)];
    };

    public type UpgradeWASM = {
        version : Nat;
        wasm : Blob;
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

    // for creation
    let CANISTER_CREATED_CYCLES = 100_000_000_000;
    let USER_CANISTER_START_BALANCE = 100_000_000_000;

    // for top up
    let MIN_CYCLES_FOR_TOPUP = 100_000_000_000; // must be less than TARGET_CANISTER_BALANCE
    let TARGET_CANISTER_BALANCE = 200_000_000_000;

    /* Service */
    public class UserCanisterService(dwitterOwner : Principal) {
        let userCanisters = Map.HashMap<UserId, Text>(1, isEq, Principal.hash);
        let byUsername = Map.HashMap<Text, UserId>(1, Text.equal, Text.hash);

        var upgradeWASM : ?UpgradeWASM = null;
        
        var dwitterCanister : ?Principal = null; 
        var controllers : [Principal] = [dwitterOwner]; // should be dwitterCanister and dwitterOwner, initially only dwitterOwner due to restrictions of Motoko 

        public func create(user : User) : async UserCanister {
            // Cost of computation table:
            // https://smartcontracts.org/docs/developers-guide/computation-and-storage-costs.html
            Cycles.add(CANISTER_CREATED_CYCLES + USER_CANISTER_START_BALANCE);

            // actor class docs: https://smartcontracts.org/docs/language-guide/actor-classes.html#actor_classes
            // create user canister
            let userCanister = await UserModule.UserCanister();

            // Create and only than set the object
            // https://forum.dfinity.org/t/motoko-encode-an-object-into-candid-to-pass-arguments-into-install-code/12330
            await userCanister.setUser(user);

            // transfer controller to the Dwitter owner
            //await transferOwnership(Principal.fromActor(userCanister), dwitterOwner);
            
            await canisterManager.updateControllers(userCanister, controllers);

            // add the canister in maps (indexes in nutshell)
            let canisterPrincipal = Principal.toText(Principal.fromActor(userCanister));
            userCanisters.put(user.id, canisterPrincipal);
            byUsername.put(user.username, user.id);

            return userCanister;
        };

        public func getByPrincipal(principal : Text) : UserCanister {
            let userCanister : UserCanister = actor(principal);
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

        public func getCanisterPrincipalByUsername(username : Text) : ?Text {
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

       public func upgradeAndTopUp(canister : UserCanister) : async () {
            let canisterInfo = await canister.getCanisterInfo();
            if (canisterInfo.cyclesBalance < MIN_CYCLES_FOR_TOPUP) {
                Cycles.add(TARGET_CANISTER_BALANCE - canisterInfo.cyclesBalance);
                ignore await canister.wallet_receive();
            };

            ignore canister.updateBalance();

            switch (upgradeWASM) {
                case (null) {
                    // nothing
                };
                case (?upgradeWASM) {
                    let currentVersion = canisterInfo.version;
                    if (upgradeWASM.version > currentVersion) {
                        let principal = Principal.fromActor(canister);
                        await canisterManager.upgrade(principal, upgradeWASM.wasm);
                    };
                };
            };
        };

        public func setUpgradeWASM(_upgradeWASM : UpgradeWASM) {
            upgradeWASM := ?_upgradeWASM;
        };
        
        public func setDwitterCanister(_dwitterCanister : Principal) {
            switch (dwitterCanister) {
                case (null) {
                    dwitterCanister := ?_dwitterCanister;
                    controllers := [_dwitterCanister, dwitterOwner];
                };

                case (?dwitterCanister) {
                    // nothing
                };
            };
        };

        func transferOwnership(canisterId : Principal, newOwner : Principal) : async() {
            let settings : CanisterSettings = {
                controller = ?newOwner;
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