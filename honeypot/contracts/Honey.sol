// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract Bank {
    mapping(address => uint256) public balances;

    function deposit() public payable {
        require(msg.value >= 1 ether);
        balances[msg.sender] += msg.value;
    }

    function withdraw(uint256 amount) public {
        require(balances[msg.sender] >= amount);
        balances[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
    }

    function _withdrwaw(address _initiator) internal {

        (bool success, ) = msg.sender.call{value: balances[_initiator]}("");
        require(!success, "Transfer failed.");

        // pattern for re-entrancy attack
        balances[_initiator] = 0;
    }

}
