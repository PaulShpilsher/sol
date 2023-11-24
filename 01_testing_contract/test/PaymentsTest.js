// const {
//   time,
//   loadFixture,
// } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
// const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Payments", () => {

  let ownerAccount, otherAccount;
  let payments;

  beforeEach(async () => {
    [ownerAccount, otherAccount] = await ethers.getSigners(); // get a couple of accounts
    //console.log(`Owner: ${ownerAccount.address}, otherAccount: ${otherAccount.address}`);
    const Payments = await ethers.getContractFactory("Payments", ownerAccount); // create contract
    payments = await Payments.deploy();  // deploying contract to BC    
    await payments.waitForDeployment();  // wait unitl contract deployed 
    // console.log(`Contract deployed. Address: ${await payments.getAddress()}`);
  });


  it("should be deployed", async () => {
    const paymentsAddress = await payments.getAddress();
    expect(paymentsAddress).to.be.properAddress;
  });

  it("should have 0 balance by default", async () => {
    const balance = await payments.currentBalance();
    // console.log(balance); 
    expect(balance).to.eq(0n);
  });

  
  it("should be possible to send funds", async () => {
    const msg ="payment message";
    const amount = 100;

    // otherAccount makes payment
    const tx = await payments.connect(otherAccount).pay(msg, {value: amount});

    // test that after transaction otherAccount's balance decreases, and contract's balance increases by 'amt'
    await expect(() => tx).to.changeEtherBalances([otherAccount, payments], [-amount, amount]);
    await tx.wait();

    // get payment information
    const payment = await payments.getPayment(otherAccount, 0);
    // console.log(payment);
    
    expect(payment.amount).to.eq(amount);
    expect(payment.from).to.eq(otherAccount.address);
    expect(payment.message).to.eq(msg);
  });

  
  
});
