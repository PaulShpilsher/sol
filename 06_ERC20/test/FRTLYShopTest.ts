import { expect } from "chai";
import { ethers } from "hardhat";
import { FRTLYShop } from "../typechain-types";
import tokenJson from "../artifacts/contracts/FRTLYToken.sol/FRTLYToken.json";
import { Contract } from "ethers";

const log = (...args: any[]) => console.log(...args);

describe("FRTLYShop", () => {
  let owner: any;
  let buyer: any;
  let shop: FRTLYShop;
  let shopAddress: string;
  let erc20: any;

  beforeEach(async () => {
    [owner, buyer] = await ethers.getSigners();

    const shopFactory = await ethers.getContractFactory("FRTLYShop", owner);
    shop = await shopFactory.deploy();
    await shop.waitForDeployment();

    // log(shop);
    shopAddress = await shop.getAddress();
    erc20 = new ethers.Contract(await shop.token(), tokenJson.abi, owner);
  });

  it("should have owner and token", async () => {
    expect(await shop.owner()).to.equal(owner.address);
    expect(await shop.token()).to.be.properAddress;
  });

  it("allows to buy", async () => {
    const tokenAmount = 3;
    const txData = {
      value: tokenAmount,
      to: shopAddress,
    };

    const tx = await buyer.sendTransaction(txData);
    await tx.wait();

    //  check that the buyer got tokens
    const buyerTokens = await erc20.balanceOf(buyer.address);
    expect(buyerTokens).to.eq(tokenAmount);

    // check that shop token amount decreased
    await expect(() => tx).to.changeEtherBalance(shop, tokenAmount);

    // check that we got Bought event
    await expect(tx)
      .to.emit(shop, "Bought")
      .withArgs(tokenAmount, buyer.address);
  });

  it("allows to sell", async () => {
    const buyTokens = 3;
    const txData = {
      value: buyTokens,
      to: shopAddress,
    };

    const tx = await buyer.sendTransaction(txData);
    await tx.wait();

    const sellTokens = 2;

    // get approval
    const approvalTx = await erc20
      .connect(buyer)
      .approve(shopAddress, sellTokens);
    await approvalTx.wait();

    const sellTx = await shop.connect(buyer).sell(sellTokens);
    await sellTx.wait();

    const remainingTokens = buyTokens - sellTokens;
    expect(await erc20.balanceOf(buyer.address)).to.eq(remainingTokens);

    await expect(() => sellTx).to.changeEtherBalance(shop, -sellTokens);

    await expect(sellTx).to.emit(shop, "Sold").withArgs(sellTokens, shopAddress);
  });
});
