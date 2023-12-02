// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./ERC20.sol";

contract FRTLYToken is ERC20 {
    constructor(address _principal) ERC20("FRTLY token", "FRTLY", 1000, _principal) {
    }
}
