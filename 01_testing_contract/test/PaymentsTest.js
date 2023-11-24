// const {
//   time,
//   loadFixture,
// } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
// const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
// const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Payments", () => {

  let ownerAccount, otherAccount;
  let payments;

  beforeEach(async () => {
    [ownerAccount, otherAccount] = await ethers.getSigners(); // get a couple of accounts
    console.log(`Owner: ${ownerAccount.address}, otherAccount: ${otherAccount.address}`);
    const Payments = await ethers.getContractFactory("Payments", ownerAccount); // create contract
    payments = await Payments.deploy();  // deploying contract to BC
    await payments.waitForDeployment();  // wait unitl contract deployed 
    console.log(`Contract deployed. Address: ${await payments.getAddress()}`);
  });


  it("should be deployed", async () => {console.log("success")});

  
  
});
