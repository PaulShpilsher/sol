// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Merkle tree
contract Tree {

    //        HROOT
    //   H12      H34
    // H1   H2  H3  H4                          
                                // 
                                //
                                // 
    bytes32[] public hashes;    // [H1, H2, H3, H4, H12, H34, HROOT]

    // TX1  TX2 TX3 TX4
    string[4] transactions = [
        "TX1: Alice -> Bob",
        "TX2: Bob -> John",
        "TX3: Bob -> Jane",
        "TX4: Jane -> Alice"
    ];

    constructor() {
        // build buttom level of hashes
        for(uint i = 0; i < transactions.length; ++i) {
            hashes.push(makeHash(transactions[i]));
        }

        // build upper level hashes based on
        uint count = transactions.length;
        uint offset = 0;

        while(count > 0) {
            // build next level
            for(uint i = 0; i < count-1; i += 2) {
                hashes.push(
                    keccak256(
                        abi.encodePacked(
                            hashes[offset + i],
                            hashes[offset + i + 1 ]
                        )
                    )
                );
            }

            offset += count;
            count /= 2;
        } 
    }
/*
    test
    [6] HROOT   0x608a7753220828d1dbe9902a7d0ddcd137e963ed4cdf4ce3a2cdc348d5d098e3
    [4] H12     0xdb04e007dc11a4505545cd440c3542fc9106573ab5161b4e9970d63cf6a75a92
    [3] H4      0x12127a56b2972b38db4a1885f691e065b738a0e9c7ae386db0d03fa0b9adca09

    T3 index = 2

["0x12127a56b2972b38db4a1885f691e065b738a0e9c7ae386db0d03fa0b9adca09", "0xdb04e007dc11a4505545cd440c3542fc9106573ab5161b4e9970d63cf6a75a92"]
*/
    function verify(string memory _transaction, uint _index, bytes32 _root, bytes32[] memory _proof) public pure returns(bool) {
        //        HROOT
        //   H12      H34
        // H1   H2  H3  H4 
        // TX1  TX2 TX3 TX4
        
        // for example to verify TX3 we calcilate hash and to construct HROOT _proof = [H4, H12]
        bytes32 hash = makeHash(_transaction);
        for( uint i = 0; i < _proof.length; ++i) {
            bytes32 element = _proof[i];
            if(_index % 2 == 0) {
                hash = keccak256(abi.encodePacked(hash, element));
            } else {
                hash = keccak256(abi.encodePacked(element, hash));
            }
            _index /= 2;
        }

        return _root == hash;
     }


    function makeHash(string memory _input) public pure returns(bytes32) {
        return keccak256(encode(_input));
    }


    // encoding string to bytes 
    function encode(string memory _input) private pure returns(bytes memory) {
        return abi.encodePacked(_input);
    }

}