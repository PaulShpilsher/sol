import { expect } from "chai";
import { ethers } from "hardhat";
import { WithLogger } from "../typechain-types";

const log = (...args: any[]) => console.log(...args);

const delay = async (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const getBlockTimestamp = async (blockNumber: number): Promise<number> => {
  const block = await ethers.provider.getBlock(blockNumber);
  return block!.timestamp;
};

describe("WithLogger", () => {
  let owner: any;
  let contract: WithLogger;
  let contractAddress: string;

  beforeEach(async () => {
    [owner] = await ethers.getSigners();
    const loggerFactory = await ethers.getContractFactory("Logger", owner);
    const logger = await loggerFactory.deploy();
    await logger.waitForDeployment();

    const loggerAddress = await logger.getAddress();
    const contractFactory = await ethers.getContractFactory("WithLogger", owner);
    contract = await contractFactory.deploy(loggerAddress); // provide dependency loggerAddress
    await contract.waitForDeployment();
    contractAddress = await contract.getAddress();
  });

  it("deployed", async () => {
    const address = await contract.getAddress();
    expect(address).to.not.eq(0);
  });

  // it("can pay and get payment info", async () => {
  //   const amount = 100;
  //   const txData = {
  //     value: amount,
  //     to: contractAddress
  //   };

  //   const tx = await owner.sendTransaction(txData);
  //   await tx.wait();

  // });



});
