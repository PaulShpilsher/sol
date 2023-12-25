// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

import "./ILogger.sol";

// hackable contract to test re-entrancy attack
contract Bank {
    mapping(address => uint256) public balances;
    ILogger public logger;
    bool resuming;

    constructor(ILogger _logger) {
        logger = _logger;
    }

    function deposit() public payable {
        //console.log(msg.value);
        require(msg.value >= 1 ether);
        balances[msg.sender] += msg.value;

        logger.log(msg.sender, msg.value, 0); // deposited
    }

    function withdraw() public {
        if (resuming == true) {
            _withdraw(msg.sender, 2);
        } else {
            resuming = true;
            _withdraw(msg.sender, 1);
        }
    }

    function _withdraw(address _initiator, uint _statusCode) internal {
        require(balances[_initiator] > 0);
        (bool success, ) = msg.sender.call{value: balances[_initiator]}("");
        require(!success, "Transfer failed.");

        // pattern for re-entrancy attack
        balances[_initiator] = 0;
        resuming = false;
        logger.log(msg.sender, msg.value, _statusCode); // withdrawn
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
