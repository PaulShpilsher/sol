// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

library StrExt {
    function eq(string memory _x, string memory _y) public pure returns(bool) {
        return keccak256(abi.encode(_x)) == keccak256(abi.encode(_y));
    }
}