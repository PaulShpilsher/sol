// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";
import "./ILogger.sol";

contract Logger is ILogger {
    function log(
        address _caller,
        uint _amount,
        uint _actionCode
    ) external override {
        emit Log(_caller, _amount, _actionCode);
    }
}
