import hte, { network, ethers } from "hardhat";
import type { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/src/signers";

async function main() {
  if (network.name === "hardhat") {
    console.warn(`
    You are trying to deploy contrct to hardhat network,
    which automatically gets created and destroyed each time.
    Use hardhat option '--network localhost
    `);
  }

  const [deployer] = (await ethers.getSigners()) as any[];

  console.log("Deploying with ", deployer.address);
  const auctionEngineFactory = await ethers.getContractFactory(
    "AuctionEngine",
    deployer
  );

  const engine = await auctionEngineFactory.deploy(); // deploying contract to BC
  await engine.waitForDeployment(); // wait unitl contract deployed

  console.log("Deployed at ", (await engine.getAddress());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
