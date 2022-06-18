import ICType "ic/IC";
import Principal "mo:base/Principal";
import Blob "mo:base/Blob";

module CanisterManager {
    type CanisterSettings = ICType.canister_settings;

    let IC : ICType.Self = actor "aaaaa-aa";

    public func upgrade(principal : Principal, wasm : Blob) : async() {
        let args = { 
            arg = Blob.fromArray([]);
            wasm_module = wasm; 
            mode = #upgrade; 
            canister_id = principal;
        };

        await IC.install_code(args);
    };

    public func updateControllers(canister : actor {}, controllers : [Principal]) : async () {
        let canisterId : Principal = Principal.fromActor(canister);

        let settings : CanisterSettings = {
            controllers = ?controllers;
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
}