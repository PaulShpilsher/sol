// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;


/**
 * Dutch Auction Engine    
 */
contract AuctionEngine {


    // Default auction duration
    uint constant DEFAUL_DURATION = 2 days;

    // Owner's fee
    uint constant OWNER_FEE = 10; // 10%

    // Acution engine owner  
    address public owner; 

    struct Auction {
        address payable seller;     // who is selling item
        uint startingPrice;         // item's initial listing price
        uint finalPrice;            // "sold" item's price
        uint startAt;               // auction starting timestamp
        uint endsAt;                // when auctions ends timestamp: startAt + duration
        uint discountRate;          // price reduction amount per second.  e.g. 2 = 2 wei per second
        string item;                // item to sell
        bool stopped;               // whether action ended or not flag         
    }

    // auctions
    Auction[] public auctions;

    event AuctionCreated(uint index, string itemName, uint startingPrice, uint duration);
    event AuctionEnded(uint index, uint finalPrice, address buyer);

    constructor() {
        owner = msg.sender;         //  engine owner - who deploys this smart contract
    }

    // creates auction 
    function createAuction(string calldata _item, uint _startingPrice, uint _discountRate, uint _duration) external {
        
        uint duration = _duration == 0 ? DEFAUL_DURATION : _duration;
        require(_startingPrice >= duration * _discountRate, "incorrect starting price");

        Auction memory auction = Auction({
            seller: payable(msg.sender),
            startingPrice: _startingPrice,
            finalPrice: _startingPrice,
            startAt: block.timestamp,
            endsAt: block.timestamp + duration,
            discountRate:_discountRate,
            item: _item,
            stopped: false
        });

        auctions.push(auction);
        emit AuctionCreated(auctions.length-1, _item, _startingPrice, duration);
    }


    // gets current item's (auction) price
    function getCurrentPrice(uint _index) public view returns(uint) {
        require(_index < auctions.length, "bad index");

        Auction memory auction = auctions[_index];
        require(!auction.stopped, "stopped!");
        require(block.timestamp < auction.endsAt, "ended!");

        uint elapsed = block.timestamp - auction.startAt;
        uint discount = elapsed * auction.discountRate;
        return auction.startingPrice - discount;
    }


    // buy item
    function buy(uint _index) external payable {
        uint price = getCurrentPrice(_index);
        require(msg.value >= price, "not enough funds!");

        Auction storage auction = auctions[_index];
        auction.stopped = true;
        auction.finalPrice = price;
        
        // refund if the buyer sent more money than the current item price
        uint refund = msg.value - price;    
        if(refund > 0) {
            payable(msg.sender).transfer(refund);
        }
        
        // send to seller final price less fee
        auction.seller.transfer(price - ((price * OWNER_FEE) / 100));

        emit AuctionEnded(_index, price, msg.sender);
    }


}