const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  
  const nftAddress = "0x77778EBa8Ed0f023B1f62C7dFBf0D5DE210B0dd3";  // Replace with the deployed contract address
  const NFTContract = await ethers.getContractAt("MorphNFT", nftAddress);

  const tokenURI = "https://your-nft-metadata-uri.com/metadata.json";  // Replace with your metadata URI
  
  const tx = await NFTContract.createNFT(tokenURI);
  await tx.wait();

  console.log("NFT minted with URI:", tokenURI);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});