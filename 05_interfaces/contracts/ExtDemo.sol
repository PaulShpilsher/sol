// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./Ext.sol";

contract ExtDemo {

    using StrExt for string;

    function areStringsEqual(string memory _x, string memory _y) public pure returns(bool) {
        return _x.eq(_y);
    }
}