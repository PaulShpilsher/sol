// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./Ownable.sol";

abstract contract Balances is Ownable {
  
  function getBalance() public view onlyOwner returns(uint) {
    return address(this).balance;
  }

  function withdraw(address payable _to) public override virtual  onlyOwner {
    _to.transfer(getBalance());
  }

}


contract MyContract is Ownable, Balances  {
  constructor() Ownable(msg.sender) {
  }


  function withdraw(address payable _to) public override(Ownable, Balances) onlyOwner {
    require(_to != address(0), "invalid address");
    // Balances.withdraw(_to);
    super.withdraw(_to);
  }
}