# Tutorial: How to Create and Deploy Your Own NFT Collection on Morph L2

**Overview:**  
In this tutorial, we will go through the steps required to create and deploy your own NFT collection on **Morph L2**, a Layer 2 scaling solution. Deploying NFTs on a Layer 2 network like Morph L2 offers significant benefits such as lower gas fees and faster transactions.

**Prerequisites:**
- Basic understanding of blockchain and NFTs.
- Familiarity with Solidity and smart contract development.
- An installed development environment (Node.js, Hardhat, or Truffle).
- A wallet (e.g., MetaMask) that supports Layer 2 networks.
- Access to a Morph L2 testnet or mainnet.

### Step 1: Set Up Your Development Environment

Before we begin, ensure that you have the required dependencies installed. We'll use **Hardhat** for smart contract development and deployment.

1. Install Node.js if you haven't already.
2. Set up a new Hardhat project by running the following commands:

```bash
mkdir morph-nft
cd morph-nft
npm init -y
npm install --save-dev hardhat @nomiclabs/hardhat-ethers ethers
```

3. Initialize the Hardhat project:

```bash
npx hardhat
```

Select "Create a basic sample project," and then follow the instructions. Once this is done, you will have the basic structure of a Hardhat project.

### Step 2: Install OpenZeppelin Contracts

OpenZeppelin provides secure and reusable Solidity code for building NFT contracts. We'll install the required package to handle the ERC-721 standard (the standard for NFTs).

```bash
npm install @openzeppelin/contracts
```

### Step 3: Write the NFT Smart Contract

Now that your environment is set up, it's time to create your NFT smart contract. We'll use the **ERC721** standard provided by OpenZeppelin.

1. Create a new file named `MorphNFT.sol` inside the `contracts` folder.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MorphNFT is ERC721URIStorage, Ownable {
    uint256 public tokenCounter;

    constructor() ERC721("MorphNFT", "MNFT") {
        tokenCounter = 0;
    }

    function createNFT(string memory tokenURI) public onlyOwner returns (uint256) {
        uint256 newItemId = tokenCounter;
        _safeMint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
        tokenCounter += 1;
        return newItemId;
    }
}
```

**Explanation:**
- **ERC721**: This is the standard contract for creating NFTs.
- **ERC721URIStorage**: This extension allows us to set a metadata URI for each NFT, linking to its image and data.
- **Ownable**: This makes the contract ownable, allowing the owner (you) to mint new NFTs.

### Step 4: Deploy the NFT Smart Contract to Morph L2

We will now deploy the smart contract on Morph L2.

1. Set up your **Hardhat configuration** to connect to the Morph L2 network. Open the `hardhat.config.js` file and modify it as follows:

```javascript
require("@nomiclabs/hardhat-ethers");

module.exports = {
  solidity: "0.8.0",
  networks: {
    morphL2: {
      url: "https://testnet.morphL2.network", // Replace with the actual Morph L2 RPC URL
      accounts: ["YOUR_PRIVATE_KEY"] // Replace with your wallet private key
    }
  }
};
```

2. Write a deployment script. Create a file named `deploy.js` inside the `scripts` folder:

```javascript
async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const NFTContract = await ethers.getContractFactory("MorphNFT");
  const nft = await NFTContract.deploy();
  
  console.log("NFT Contract deployed to:", nft.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

3. Deploy the contract to the Morph L2 network:

```bash
npx hardhat run scripts/deploy.js --network morphL2
```

Once deployed, the console will output the address where your NFT contract is deployed.

### Step 5: Mint Your First NFT

Now that the contract is deployed, let's mint our first NFT.

1. Create a new script named `mint.js` in the `scripts` folder:

```javascript
async function main() {
  const [deployer] = await ethers.getSigners();
  const nftAddress = "YOUR_DEPLOYED_NFT_ADDRESS";  // Replace with your contract's deployed address
  const NFTContract = await ethers.getContractFactory("MorphNFT");
  const nft = NFTContract.attach(nftAddress);

  const tokenURI = "https://your-nft-metadata-uri.com/metadata.json"; // Replace with the actual URI
  let tx = await nft.createNFT(tokenURI);
  await tx.wait();

  console.log("NFT minted with URI:", tokenURI);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

2. Mint the NFT by running:

```bash
npx hardhat run scripts/mint.js --network morphL2
```

Once the minting is complete, you'll see the transaction details in your terminal.

### Step 6: Create Metadata for Your NFTs

NFT metadata provides the information about your NFT, such as its name, description, and image. The metadata is stored off-chain, typically using **IPFS** or other decentralized storage solutions. Here's an example of a metadata file:

```json
{
  "name": "Morph NFT #1",
  "description": "This is the first NFT in the Morph L2 collection.",
  "image": "https://ipfs.io/ipfs/Qm.../nft1.png",
  "attributes": [
    {
      "trait_type": "Background",
      "value": "Blue"
    },
    {
      "trait_type": "Eyes",
      "value": "Green"
    }
  ]
}
```

Upload this JSON file to IPFS (using a service like [Pinata](https://pinata.cloud/) or [Infura](https://infura.io/)) and use the resulting IPFS URL as the `tokenURI` when minting your NFTs.

### Step 7: Build a Simple Frontend to Display Your NFTs

To allow users to interact with your NFT collection, you can create a basic frontend using **React** and **Ethers.js**. Below is a simple example.

1. Install dependencies:

```bash
npx create-react-app morph-nft-frontend
cd morph-nft-frontend
npm install ethers
```

2. Modify the `App.js` file:

```javascript
import React, { useState } from 'react';
import { ethers } from 'ethers';
import NFTContractABI from './NFTContractABI.json';

const contractAddress = "YOUR_DEPLOYED_NFT_ADDRESS"; // Replace with your contract address

function App() {
  const [nftURI, setNFTURI] = useState("");

  const getNFTData = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(contractAddress, NFTContractABI, provider);

    const tokenURI = await contract.tokenURI(0);  // Fetch the URI of token 0
    setNFTURI(tokenURI);
  };

  return (
    <div>
      <h1>My Morph L2 NFT Collection</h1>
      <button onClick={getNFTData}>Fetch NFT Data</button>
      {nftURI && <p>NFT URI: {nftURI}</p>}
    </div>
  );
}

export default App;
```

3. Add your NFT contract’s ABI (`NFTContractABI.json`) to the project.

4. Run the frontend:

```bash
npm start
```

Now you have a basic dApp that fetches and displays NFT data from your contract.

### Conclusion

Congratulations! You've successfully created and deployed your own NFT collection on Morph L2. You've also learned how to mint NFTs and build a frontend that interacts with your NFT contract. This setup can be expanded into a full-fledged NFT marketplace, a gallery, or any other NFT-based application.

Feel free to experiment by adding more features like batch minting, royalty support, or integrating with marketplaces!