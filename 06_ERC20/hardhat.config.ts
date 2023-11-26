import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "solidity-coverage";
// This adds support for typescript paths mappings
import "tsconfig-paths/register";

const config: HardhatUserConfig = {
  solidity: "0.8.19",
};

export default config;
