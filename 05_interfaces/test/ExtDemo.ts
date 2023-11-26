import { expect } from "chai";
import { ethers } from "hardhat";
import { ExtDemo } from "../typechain-types";

const log = (...args: any[]) => console.log(...args);

const delay = async (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const getBlockTimestamp = async (blockNumber: number): Promise<number> => {
  const block = await ethers.provider.getBlock(blockNumber);
  return block!.timestamp;
};

describe("WithLogger", () => {
  let owner: any;
  let contract: ExtDemo;
  

  beforeEach(async () => {
    [owner] = await ethers.getSigners();
    const factory = await ethers.getContractFactory("ExtDemo", owner);
    contract = await factory.deploy();
    await contract.waitForDeployment();
  });

  it("strings are equal", async () => {
    const result = await contract.areStringsEqual("cat", "cat");
    expect(result).to.eq(true);
  });

  it("strings are not equal", async () => {
    const result = await contract.areStringsEqual("cat", "dog");
    expect(result).to.eq(false);
  });

  it("in array", async () => {
    const result = await contract.inArray([1,2,3], 2);
    expect(result).to.eq(true);
  });

  it("not in array", async () => {
    const result = await contract.inArray([1,2,3], 4);
    expect(result).to.eq(false);
  });


});
