// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./IERC20.sol";
import "./FRTLYToken.sol";

contract Shop {

    IERC20 public token;
    address payable owner;

    event Bought(uint _amount, address indexed _buyer);
    event Sold(uint _amount, address indexed _seller);

    constructor() {
        token = FRTLYToken(address(this));
        owner = payable(msg.sender);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "not an owner!");
        _;
    }

    function sell(uint _amount) external {

    }

    function tokenBalance() public view returns(uint) {
        return 0;
    }


    // someone wants to buy tokens
    receive() external payable {
        uint tokensToBuy = msg.value;   // assume 1 token = 1 wei
        require(tokensToBuy > 0, "not enough  funds");

        uint currentBalance = tokenBalance();
        require(currentBalance >= tokensToBuy, "not enough tokens!");

        token.transfer(msg.sender, tokensToBuy);
        emit Bought(tokensToBuy, msg.sender);
    }
 
}
