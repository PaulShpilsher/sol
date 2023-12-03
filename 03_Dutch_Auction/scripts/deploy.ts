import hte, { network, ethers, artifacts } from "hardhat";
// import type { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/src/signers";
import fs from "fs";
import fsp from "fs/promises";
import path from "path";
import { BaseContract } from "ethers";

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

  console.log("Deployed at ", await engine.getAddress());

  await saveFrontendFiles({
    DutchAuctionEngine: engine,
  });
}

async function saveFrontendFiles(
  contracts: Record<string, BaseContract>
): Promise<void> {
  const contractsDir = path.join(__dirname, "..", "front/contracts");

  let exists;
  try {
    await fsp.access(contractsDir);
    exists = true;
  } catch (e) {
    exists = false;
  }

  if (!exists) {
    await fsp.mkdir(contractsDir);
  }

  const deploymentPromises = Object.entries(contracts).map(
    async ([name, contract]) => {
      if (contract) {
        const contractAddress = await contract.getAddress();
        const data = {
          [name]: contractAddress,
        };
        const contractFile = path.join(
          contractsDir,
          `${name}-contract-address.json`
        );
        console.log("Writing: ", contractFile);
        await fsp.writeFile(contractFile, JSON.stringify(data, undefined, 2));
      }

      const contractArtifact = await artifacts.readArtifact(name);
      const contractArtifactFile = path.join(contractsDir, `${name}.json`);
      console.log("Writing: ", contractArtifactFile);
      await fsp.writeFile(
        contractArtifactFile,
        JSON.stringify(contractArtifact, undefined, 2)
      );
    }
  );

  await Promise.all(deploymentPromises);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
