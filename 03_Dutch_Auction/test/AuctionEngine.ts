import { expect } from "chai";
import { ethers } from "hardhat";
import { AuctionEngine } from "../typechain-types";

const log = (...args: any[]) => console.log(...args);

const getBlockTimestamp = async (blockNumber: number): Promise<number> => {
  const block = await ethers.provider.getBlock(blockNumber);
  return block!.timestamp;
};

describe("AuctionEngine", () => {
  let ownerAccount: any;
  let sellerAccount: any;
  let buyerAccount: any;
  let engine: AuctionEngine;

  beforeEach(async () => {
    [ownerAccount, sellerAccount, buyerAccount] = await ethers.getSigners(); // get a couple of accounts
    const smartContract = await ethers.getContractFactory(
      "AuctionEngine",
      ownerAccount
    ); // create contract
    engine = await smartContract.deploy(); // deploying contract to BC
    await engine.waitForDeployment(); // wait unitl contract deployed
  });

  it("sets owner", async () => {
    const engineOwnerAddress = await engine.owner();
    expect(engineOwnerAddress).to.eq(ownerAccount.address);
  });

  describe("createAuction", async () => {
    it("creates auction correctly", async () => {
      const item = "an awesome item";
      const startingPrice = ethers.parseEther("0.0001");
      // log("Starting price: ", startingPrice);
      const discountRate = 3;
      const duration = 60;
      const tx = await engine
        .connect(sellerAccount)
        .createAuction(item, startingPrice, discountRate, duration);

      const auction = await engine.auctions(0);
      // log(auction);

      expect(auction.seller).to.eq(sellerAccount.address);

      expect(auction.item).to.eq(item);
      expect(auction.startingPrice).to.eq(startingPrice);
      expect(auction.finalPrice).to.eq(startingPrice);
      expect(auction.discountRate).to.eq(discountRate);
      expect(auction.stopped).to.eq(false);

      const timestamp = await getBlockTimestamp(tx.blockNumber!);
      expect(auction.startAt).to.eq(timestamp);
      expect(auction.endsAt).to.eq(duration + timestamp);
    });
  });
});
