import { expect } from "chai";
import { ethers } from "hardhat";
import { FRTLYShop } from "../typechain-types";

const log = (...args: any[]) => console.log(...args);

describe("FRTLYShop", () => {
  let owner: any;
  let buyer: any;
  let shop: FRTLYShop;
  let shopAddress: string;

  beforeEach(async () => {
    [owner, buyer] = await ethers.getSigners();

    const shopFactory = await ethers.getContractFactory("FRTLYShop", owner);
    shop = await shopFactory.deploy();
    await shop.waitForDeployment();

    // log(shop);    
    shopAddress = await shop.getAddress();
  });

  it("should have owner and token", async () => {
    expect(await shop.owner()).to.equal(owner.address);
    expect(await shop.token()).to.be.properAddress;
  });
});
