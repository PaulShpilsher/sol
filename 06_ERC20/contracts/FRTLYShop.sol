// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./FRTLYToken.sol";

contract FRTLYShop {

    IERC20 public token;
    address payable public owner;

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
        require(_amount > 0 && token.balanceOf(msg.sender) >= _amount, "incorrect amount!");

        uint allowance = token.allowance(msg.sender, address(this));
        require(allowance >= _amount, "check allowance!");

        token.transferFrom(msg.sender, address(this), _amount);
        payable(msg.sender).transfer(_amount); // 1 token = 1 wei. general case (_amount * conversionRate)
        emit Sold(_amount, msg.sender);
    }

    function tokenBalance() public view returns(uint) {
        return token.balanceOf(address(this));
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
