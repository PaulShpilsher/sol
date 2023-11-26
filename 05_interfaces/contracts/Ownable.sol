// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;


contract Ownable {

  address public owner;

  constructor(address _owner) {
    owner = _owner == address(0) ? msg.sender : _owner;
  }

  modifier onlyOwner() {
    require(msg.sender == owner, "not an owner!");
    _;
  }

  function withdraw(address payable _to) public virtual onlyOwner {
    payable(owner).transfer(address(this).balance);
    _to;
  }
}
