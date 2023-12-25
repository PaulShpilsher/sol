import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import type { ReentrancyAttack, Bank, Logger } from "../typechain-types";

describe("Honey", function () {
  async function deployment() {
    // Contracts are deployed using the first signer/account by default
    const [deployer, attacker] = await ethers.getSigners();

    const loggerFactory = await ethers.getContractFactory("Logger");
    const logger = await loggerFactory.deploy();
    await logger.waitForDeployment();
    const loggerAddress = await logger.getAddress();
    console.log(`Logger contract deployed @ ${loggerAddress}`);

    const bankFactory = await ethers.getContractFactory("Bank");
    const bank = await bankFactory.deploy(loggerAddress);
    await bank.waitForDeployment();
    const bankAddress = await bank.getAddress();
    console.log(`Bank contract deployed @ ${bankAddress}`);

    const attackFactory = await ethers.getContractFactory("ReentrancyAttack");
    const attack = await attackFactory.deploy(bankAddress);
    await attack.waitForDeployment();
    const attackAddress = await bank.getAddress();
    console.log(`ReentrancyAttack contract deployed @ ${attackAddress}`);

    return { bank, attack, deployer, attacker };
  }

  it("attacks", async function () {
    const { bank, attack, attacker } = await loadFixture(deployment);

    // initial amount
    const initialAmount = "5.0"; // 5 ether

    // deployer deposits to bank
    const depositTx = await bank.deposit({
      value: ethers.parseEther(initialAmount),
    });
    await depositTx.wait();

    // attacker attacks
    const attackTx = await attack
      .connect(attacker)
      .attack({ value: ethers.parseEther("1.0") });
    await attackTx.wait();

   // console.log(attackTx);


    // attack contract now has attacker's 1 ether and 5 ether from bank. i.e. 6 ether
    const attackBalance = ethers.formatEther(await attack.getBalance());
    expect(attackBalance).to.equal("6.0"); 


    // bank now is empty
    const bankAfterAttackBalance = ethers.formatEther(await bank.getBalance());  
    expect(bankAfterAttackBalance).to.equal("0.0");
  });
});
