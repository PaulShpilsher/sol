// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

library StrExt {
    function eq(string memory _x, string memory _y) internal pure returns(bool) {
        return keccak256(abi.encode(_x)) == keccak256(abi.encode(_y));
    }
}

library ArrayExt {
    function contains(uint[] memory _arr, uint _val) internal pure returns(bool) {
        for(uint i = 0; i < _arr.length; i++) {
            if(_arr[i] == _val) {
                return true;
            }
        }
        return false;
    }
}