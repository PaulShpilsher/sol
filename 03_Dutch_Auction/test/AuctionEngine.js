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

//   const  sendMoney = async (sender) => {
//     const amount = 100;
//     const txData = {
//       to: smartContractAddress,
//       value: amount
//     };

//     const tx = await sender.sendTransaction(txData);
//     await tx.wait();
//     return [tx, amount];
//   }


//   it("should be allow to send money", async () => {
//     const [tx, amount] = await sendMoney(otherAccount);
//     // console.log(tx);

//     await expect(() => tx).to.changeEtherBalance(smartContract, amount);

//     const {timestamp} = await ethers.provider.getBlock(tx.blockNumber);
//     await expect(tx).to.emit(smartContract, "Paid").withArgs(otherAccount.address, amount, timestamp);
//   });

//   it("should allow owner to withdraw money", async () => {
//     const [, amount] = await sendMoney(otherAccount);

//     const tx = await smartContract.withdraw(ownerAccount.address);

//     await expect(() => tx).to.changeEtherBalances([ownerAccount, smartContract], [amount, -amount]);
//   });

//   it("should now allow not an owner to withdraw money", async () => {
//     await sendMoney(otherAccount);

//     // connect specifies initiator transaction account 
//     await expect(
//        smartContract.connect(otherAccount).withdraw(otherAccount.address)
//     ).to.be.revertedWith("Only owner allowed");
//   });


// });
