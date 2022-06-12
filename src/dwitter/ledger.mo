import Nat64 "mo:base/Nat64";
import Nat8 "mo:base/Nat8";

module {
    public let CANISTER_ID : Text = "ryjl3-tyaaa-aaaaa-aaaba-cai";

    // Amount of ICP tokens, measured in 10^-8 of a token.
    public type ICP = {
        e8s : Nat64;
    };

    // Number of nanoseconds from the UNIX epoch (00:00:00 UTC, Jan 1, 1970).
    public type Timestamp = {
        timestamp_nanos: Nat64;
    };

    // AccountIdentifier is a 32-byte array.
    // The first 4 bytes is big-endian encoding of a CRC32 checksum of the last 28 bytes.
    public type AccountIdentifier = [Nat8];

    // Subaccount is an arbitrary 32-byte byte array.
    // Ledger uses subaccounts to compute the source address, which enables one
    // principal to control multiple ledger accounts.
    public type SubAccount = [Nat8];

    // Sequence number of a block produced by the ledger.
    public type BlockIndex = Nat64;

    // An arbitrary number associated with a transaction.
    // The caller can set it in a `transfer` call as a correlation identifier.
    public type Memo = Nat64;

    public type GetBlocksArgs = {
        // The index of the first block to fetch.
        start : BlockIndex;
        // Max number of blocks to fetch.
        length : Nat64;
    };

    public type Operation = {
        #Mint : {
            to : AccountIdentifier;
            amount : ICP;
        };
        #Burn : {
            from : AccountIdentifier;
            amount : ICP;
        };
        #Transfer : {
            from : AccountIdentifier;
            to : AccountIdentifier;
            amount : ICP;
            fee : ICP;
        };
    };

    public type Transaction = {
        memo : Memo;
        operation : ?Operation;
        created_at_time : Timestamp;
    };

    public type Block = {
        transaction : Transaction;
        timestamp : Timestamp;
    };

    public type QueryBlocksResponse = {
        blocks : [Block];
        first_block_index : BlockIndex;
    };

    // Arguments for the `account_balance` call.
    public type AccountBalanceArgs = {
        account : AccountIdentifier;
    };

    public type AccountBalanceDfxArgs = {
        account : Text;
    };

    public type SendArgs = {
        memo : Memo;
        amount : ICP;
        // The amount that the caller pays for the transaction.
        // Must be 10000 e8s.
        fee : ICP;
        // The subaccount from which the caller wants to transfer funds.
        // If null, the ledger uses the default (all zeros) subaccount to compute the source address.
        // See comments for the `SubAccount` type.
        from_subaccount : ?SubAccount;
        // The destination account.
        // If the transfer is successful, the balance of this account increases by `amount`.
        to : Text;
        // The point in time when the caller created this request.
        // If null, the ledger uses current IC time as the timestamp.
        created_at_time : ?Timestamp;
    };

    public type Interface = actor {
        account_balance_dfx : AccountBalanceDfxArgs -> async ICP;
        send_dfx            : SendArgs -> async BlockIndex;
        query_blocks        : GetBlocksArgs -> async QueryBlocksResponse;
    };
};