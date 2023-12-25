// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

interface ILogger {
    event Log(address caller, uint amount, uint actionCode);

    function log(address _caller, uint _amount, uint _actionCode) external;
}

contract Logger is ILogger {
    function log(
        address _caller,
        uint _amount,
        uint _actionCode
    ) external override {
        emit Log(_caller, _amount, _actionCode);
    }
}
