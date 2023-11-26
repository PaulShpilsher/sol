// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./Ext.sol";

contract ExtDemo {

    using StrExt for string;
    using ArrayExt for uint[];

    function areStringsEqual(string memory _x, string memory _y) public pure returns(bool) {
        return _x.eq(_y);
    }

    function inArray(uint[] memory _arr, uint _value) public pure returns(bool) {
        return _arr.contains(_value);
    }
}