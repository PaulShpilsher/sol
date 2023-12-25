// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";
import "./ILogger.sol";

contract Honeypot is ILogger {
    function log(
        address,
        uint,
        ActionCode _actionCode
    ) public pure {
      if(_actionCode == ActionCode.Withdrawn) {
        revert("Honeypot: You fell into the honeypot!");
      }
    }
}
