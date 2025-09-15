const hre = require("hardhat");

async function main() {
  // Deploy test payment token
  const Token = await hre.ethers.getContractFactory("TestToken");
  const token = await Token.deploy("TokenA", "TKA");
  await token.deployed();

  // Deploy governance token referencing the payment token
  const Gov = await hre.ethers.getContractFactory("GovernanceToken");
  const gov = await Gov.deploy(token.address, hre.ethers.utils.parseUnits("1", 18));
  await gov.deployed();

  // Deploy marketplace contract
  const Market = await hre.ethers.getContractFactory("PropertyMarketplace");
  const market = await Market.deploy();
  await market.deployed();

  console.log("TestToken:", token.address);
  console.log("GovernanceToken:", gov.address);
  console.log("PropertyMarketplace:", market.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
