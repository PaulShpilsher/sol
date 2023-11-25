const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Payments", () => {

  let ownerAccount, otherAccount;
  let smartContract;
  let smartContractAddress;

  beforeEach(async () => {
    [ownerAccount, otherAccount] = await ethers.getSigners(); // get a couple of accounts
    const SmartContract = await ethers.getContractFactory("Demo1", ownerAccount); // create contract
    smartContract = await SmartContract.deploy();  // deploying contract to BC    
    await smartContract.waitForDeployment();  // wait unitl contract deployed 
    smartContractAddress = await smartContract.getAddress();;
  });


  const  sendMoney = async (sender) => {
    const amount = 100;
    const txData = {
      to: smartContractAddress,
      value: amount
    };

    const tx = await sender.sendTransaction(txData);
    await tx.wait();
    return [tx, amount];
  }


  it("should be allow to send money", async () => {
    const [tx, amount] = await sendMoney(otherAccount);
    // console.log(tx);

    await expect(() => tx).to.changeEtherBalance(smartContract, amount);

    const {timestamp} = await ethers.provider.getBlock(tx.blockNumber);
    await expect(tx).to.emit(smartContract, "Paid").withArgs(otherAccount.address, amount, timestamp);
  });

  it("should allow owner to withdraw money", async () => {
    const [, amount] = await sendMoney(otherAccount);

    const tx = await smartContract.withdraw(ownerAccount.address);

    await expect(() => tx).to.changeEtherBalances([ownerAccount, smartContract], [amount, -amount]);
  });

  it("should now allow not an owner to withdraw money", async () => {
    await sendMoney(otherAccount);

    // connect specifies initiator transaction account 
    await expect(
       smartContract.connect(otherAccount).withdraw(otherAccount.address)
    ).to.be.revertedWith("Only owner allowed");
  });


});
