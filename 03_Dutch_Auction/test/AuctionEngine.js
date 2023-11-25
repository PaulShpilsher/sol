const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AuctionEngine", () => {

  let ownerAccount, sellerAccount, buyerAccount;
  let engine;

  beforeEach(async () => {
    [ownerAccount, sellerAccount, buyerAccount] = await ethers.getSigners(); // get a couple of accounts
    const smartContract = await ethers.getContractFactory("AuctionEngine", ownerAccount); // create contract
    engine = await smartContract.deploy();  // deploying contract to BC    
    await engine.waitForDeployment();  // wait unitl contract deployed 
  });

  
  it("sets owner", async () => {    
    const engineOwnerAddress = await engine.owner();
    expect(engineOwnerAddress).to.eq(ownerAccount.address);
  });

});
