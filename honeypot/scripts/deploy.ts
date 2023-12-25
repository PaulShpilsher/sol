import { ethers } from "hardhat";

async function main() {
  const bank = await ethers.deployContract("Bank");
  await bank.waitForDeployment();

  console.log(`Bank contract deployed @ ${await bank.getAddress()}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
