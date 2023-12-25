import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import type {
  ReentrancyAttack,
  Bank,
  Logger,
  ILogger,
  Honeypot,
} from "../typechain-types";

describe("Honey", function () {
  async function reentrancyAttackDeploy() {
    // Contracts are deployed using the first signer/account by default
    const [deployer, attacker] = await ethers.getSigners();

    const loggerFactory = await ethers.getContractFactory("Logger");
    const logger: Logger = await loggerFactory.deploy();
    await logger.waitForDeployment();
    const loggerAddress = await logger.getAddress();
    console.log(`Logger contract deployed @ ${loggerAddress}`);

    const bankFactory = await ethers.getContractFactory("Bank");
    const bank: Bank = await bankFactory.deploy(loggerAddress);
    await bank.waitForDeployment();
    const bankAddress = await bank.getAddress();
    console.log(`Bank contract deployed @ ${bankAddress}`);

    const attackFactory = await ethers.getContractFactory("ReentrancyAttack");
    const attack: ReentrancyAttack = await attackFactory.deploy(bankAddress);
    await attack.waitForDeployment();
    const attackAddress = await bank.getAddress();
    console.log(`ReentrancyAttack contract deployed @ ${attackAddress}`);

    return { bank, attack, deployer, attacker };
  }

  async function honeypotDeploy() {
    // Contracts are deployed using the first signer/account by default
    const [deployer, attacker] = await ethers.getSigners();

    const honeypotFactory = await ethers.getContractFactory("Honeypot");
    const honeypot: Honeypot = await honeypotFactory.deploy();
    await honeypot.waitForDeployment();
    const honeypotAddress = await honeypot.getAddress();
    console.log(`Honeypot contract deployed @ ${honeypotAddress}`);

    const honeypotedBankFactory = await ethers.getContractFactory("Bank");
    const honeypotedBank: Bank = await honeypotedBankFactory.deploy(
      honeypotAddress
    );
    await honeypotedBank.waitForDeployment();
    const honeypotedBankAddress = await honeypotedBank.getAddress();
    console.log(`honeypoted Bank contract deployed @ ${honeypotedBankAddress}`);

    const honeypotedAttackFactory = await ethers.getContractFactory(
      "ReentrancyAttack"
    );
    const attack: ReentrancyAttack = await honeypotedAttackFactory.deploy(
      honeypotedBankAddress
    );
    await attack.waitForDeployment();
    const attackAddress = await honeypotedBank.getAddress();
    console.log(
      `honeypoted ReentrancyAttack contract deployed @ ${attackAddress}`
    );

    return { bank: honeypotedBank, attack, deployer, attacker };
  }

  it("honeypot hacker", async function () {
    const { bank, attack, attacker } = await loadFixture(honeypotDeploy);

    // initial amount
    const initialAmount = "5.0"; // 5 ether

    // deployer deposits to bank
    const depositTx = await bank.deposit({
      value: ethers.parseEther(initialAmount),
    });
    await depositTx.wait();

    const currentBalance = ethers.formatEther(await bank.getBalance());
    expect(currentBalance).to.eq(initialAmount);

    // attacker attacks and oops..  unable to withdraw anything  Honepot is working
    await expect(
      attack.connect(attacker).attack({ value: ethers.parseEther("1.0") })
    ).to.be.revertedWith("Honeypot: You fell into the honeypot!");
  });


  it("regular users", async function () {
    const { bank, deployer} = await loadFixture(honeypotDeploy);

    // initial amount
    const initialAmount = "5.0"; // 5 ether

    // deployer deposits to bank
    const depositTx = await bank.deposit({
      value: ethers.parseEther(initialAmount),
    });
    await depositTx.wait();

    const currentBalance = ethers.formatEther(await bank.getBalance());
    expect(currentBalance).to.eq(initialAmount);

    const txWithdraw = await bank.withdraw();

    await expect(txWithdraw).to.changeEtherBalances([bank, deployer], [ethers.parseEther("-5.0"), ethers.parseEther("5.0")])


  });

  // it("honeypot regular users", async function () {
  //   const { bank, attack, attacker } = await loadFixture(honeypotDeploy);

  //   // initial amount
  //   const initialAmount = "5.0"; // 5 ether

  //   // deployer deposits to bank
  //   const depositTx = await bank.deposit({
  //     value: ethers.parseEther(initialAmount),
  //   });
  //   await depositTx.wait();

  //   const currentBalance = ethers.formatEther(await bank.getBalance());
  //   expect(currentBalance).to.eq(initialAmount);

  //   await expect( bank.withdraw()).to.be.revertedWith("Honeypot: You fell into the honeypot!");
  // });

  // it("reent attack", async function () {
  //   const { bank, attack, attacker } = await loadFixture(
  //     reentrancyAttackDeploy
  //   );

  //   // initial amount
  //   const initialAmount = "5.0"; // 5 ether

  //   // deployer deposits to bank
  //   const depositTx = await bank.deposit({
  //     value: ethers.parseEther(initialAmount),
  //   });
  //   await depositTx.wait();

  //   // attacker attacks
  //   const attackTx = await attack
  //     .connect(attacker)
  //     .attack({ value: ethers.parseEther("1.0") });
  //   await attackTx.wait();

  //   // console.log(attackTx);

  //   // TODO:  out why it is not working
  //   // attack contract now has attacker's 1 ether and 5 ether from bank. i.e. 6 ether
  //   const attackBalance = ethers.formatEther(await attack.getBalance());
  //   // TODO: expect(attackBalance).to.equal("6.0");

  //   // bank now is empty
  //   const bankAfterAttackBalance = ethers.formatEther(await bank.getBalance());
  //   // TODO: expect(bankAfterAttackBalance).to.equal("0.0");
  // });
});
