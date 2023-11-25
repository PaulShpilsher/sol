// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Optimization -> less Gas fees

// Compating Optimized and Unoptimized 

contract Op {
    // uint demo; // 66854

    // bytes32 public hash = 0x62c6d927a0c5b688ecefd273301b9dfc120b59bc546ff1ce70ca2eb0ccbb22f8; // 113355 56595
    
    mapping (address => uint) payments;                                     // 23507
    function pay() external payable {
        require(msg.sender != address(0), "Zero address not allowed");
        payments[msg.sender] = msg.value;
    }
}


contract Un {
    // uint demo = 0; // 69107
    // bytes32 public hash = keccak256(abi.encodePacked("arg")); //  114971 56897

    mapping (address => uint) payments;                                     // 139215
    function pay() external payable {
        address _from = msg.sender;
        require(_from != address(0), "Zero address not allowed");
        payments[_from] = msg.value;
    }

}
