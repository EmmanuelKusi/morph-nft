async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);
  
    const NFTContract = await ethers.getContractFactory("MorphNFT");
    const nft = await NFTContract.deploy();
    
      console.log("NFT Contract deployed to:", nft.target);
  }
  
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
  