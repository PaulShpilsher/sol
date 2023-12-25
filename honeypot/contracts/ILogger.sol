// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

interface ILogger {
    enum ActionCode {
        Deposited,
        Withdrawn
    }
    event Log(address caller, uint amount, ActionCode actionCode);

    function log(address _caller, uint _amount, ActionCode _actionCode) external;
}
