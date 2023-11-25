// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Demo1 {

    address owner;

    event Paid(address indexed _from, uint amount, uint timestamp);

    constructor() {
        owner = msg.sender;
    }


    receive() external payable {
        pay();
    }

    function pay() public payable {
        emit Paid(msg.sender, msg.value, block.timestamp);
    }
    

    modifier onlyOwner(address _to) {
        require(_to == owner, "Only owner allowed");
        require(_to != address(0), "Zero address not allowed");
        _;
    }

    function withdraw(address payable _to) external onlyOwner(_to) {
        _to.transfer(address(this).balance);
    }

}