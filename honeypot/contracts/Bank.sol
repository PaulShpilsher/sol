// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

 

// hackable contract to test re-entrancy attack
contract Bank {
    mapping(address => uint256) public balances;

    function deposit() public payable {
        //console.log(msg.value);
        require(msg.value >= 1 ether);
        balances[msg.sender] += msg.value;
    }

    function withdraw() public {
        _withdraw(msg.sender);
    }

    function _withdraw(address _initiator) internal {
        require(balances[_initiator] > 0);
        (bool success, ) = msg.sender.call{value: balances[_initiator]}("");
        require(!success, "Transfer failed.");

        // pattern for re-entrancy attack
        balances[_initiator] = 0;
    }


    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

}
