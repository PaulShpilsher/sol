// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./ILogger.sol";

contract WithLogger {
    ILogger logger;

    constructor(address _logger) {
       logger = ILogger(_logger);
    }

    receive() external payable {
        logger.log(msg.sender, msg.value);
    }

    function getPayment(address _from, uint _paymentNumber) external view returns(uint) {
        return logger.getEntry(_from, _paymentNumber);
    }    
}