const hre = require("hardhat");


async function main() {
  const [deployer] = await ethers.getSigners();
  const initBaseURI = "https://gateway.pinata.cloud/ipfs/QmaytFJQnN5yv1yfDn8y23zt1f1jpLo9WE2QYVeKWNtjdk/";

  console.log("Deploying contracts with the account:", deployer.address);
  // We get the contract to deploy
  const Concave = await hre.ethers.getContractFactory("ConcaveNFT");
  const concave = await Concave.deploy("SnowCave","SNOW",initBaseURI);


  await concave.deployed();

  console.log("SnowCave holiday collection deployed to:", concave.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });