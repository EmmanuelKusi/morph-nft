

# Tutorial: How to Create and Deploy Your Own NFT Collection on Morph L2 (Ethers.js v6 and Hardhat)

**Overview:**  
In this tutorial, we'll go step-by-step to create and deploy your own NFT collection on **Morph L2**, using the latest versions of **Ethers.js v6** and **Hardhat**. Deploying NFTs on Layer 2 reduces gas fees and improves transaction speeds, making it ideal for NFT projects.

### Prerequisites:
- Basic understanding of blockchain, NFTs, and Solidity.
- Development environment set up with **Node.js**, **Hardhat**, and **Ethers.js v6**.
- A wallet (e.g., MetaMask) connected to the Morph L2 network.
- Access to Morph L2 testnet or mainnet.

---

### Step 1: Set Up Your Development Environment

1. **Install Node.js** if you haven't already [Download Node.js](https://nodejs.org/).
2. **Create a new Hardhat project** and install the necessary dependencies.

```bash
mkdir morph-nft
cd morph-nft
npm init -y
npm install --save-dev hardhat 
```

3. **Initialize Hardhat**:

```bash
npx hardhat
```

Follow the prompts to create a "basic sample project". This will set up the structure of your Hardhat project.

---

### Step 2: Install OpenZeppelin Contracts

We will use OpenZeppelin contracts to implement the **ERC721** NFT standard.

```bash
npm install @openzeppelin/contracts
```

---

### Step 3: Write the NFT Smart Contract

Create a new file named `MorphNFT.sol` inside the `contracts` folder and write your NFT smart contract.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

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
- **ERC721**: Standard contract for NFTs.
- **ERC721URIStorage**: Adds support for storing token URIs (metadata and images).
- **Ownable**: Ensures only the contract owner can mint new NFTs.

---

### Step 4: Deploy the NFT Smart Contract to Morph L2

1. **Configure Hardhat for the Morph L2 network**:
   
Modify the `hardhat.config.js` file to include your network details:

```javascript
require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

module.exports = {
  solidity: "0.8.20",
  networks: {
    morphL2: {
      url: "https://testnet.morphL2.network", // Replace with the actual Morph L2 RPC URL
      accounts: [process.env.PRIVATE_KEY]  // Store your private key in .env file for security
    }
  }
};
```

2. **Create a deployment script**:
   
Create a file named `deploy.js` in the `scripts` folder.

```javascript
const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Get the contract factory
  const NFTContract = await ethers.getContractFactory("MorphNFT");

  // Deploy the contract
  const nft = await NFTContract.deploy();

  // Log the contract address
  console.log("NFT Contract deployed to:", nft.target);  // Use .target to get the deployed address in Ethers.js v6
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

3. **Deploy the contract** to Morph L2 by running the script:

```bash
npx hardhat run scripts/deploy.js --network morphL2
```

Once deployed, you'll see the contract address printed in your console.

---

### Step 5: Mint Your First NFT

Now that the contract is deployed, we can mint our first NFT. Create a new file named `mint.js` in the `scripts` folder.

```javascript
const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  
  const nftAddress = "YOUR_DEPLOYED_NFT_ADDRESS";  // Replace with the deployed contract address
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
```

Run the minting script:

```bash
npx hardhat run scripts/mint.js --network morphL2
```

---

### Step 6: Create Metadata for Your NFTs

NFT metadata is stored off-chain, typically using **IPFS**. Here's an example of a metadata file:

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

Use services like [Pinata](https://pinata.cloud/) or [Infura](https://infura.io/) to upload your metadata to IPFS, and use the resulting URL as the `tokenURI` when minting NFTs.

---

### Step 7: Build a Simple Frontend to Display Your NFTs

You can create a basic frontend to allow users to interact with your NFTs. Below is a simple example using **React** and **Ethers.js v6**.

1. **Set up a React app**:

```bash
npx create-react-app morph-nft-frontend
cd morph-nft-frontend
npm install ethers
```

2. **Modify `App.js`**:

```javascript
import React, { useState } from 'react';
import { ethers } from 'ethers';
import NFTContractABI from './NFTContractABI.json';  // Make sure to export the ABI from Hardhat

const contractAddress = "YOUR_DEPLOYED_NFT_ADDRESS";  // Replace with your contract's address

function App() {
  const [nftURI, setNFTURI] = useState("");

  const getNFTData = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    
    const contract = new ethers.Contract(contractAddress, NFTContractABI, signer);

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

3. **Run the frontend**:

```bash
npm start
```

This simple frontend allows users to fetch and display the metadata of the first NFT minted from your contract.

---

### Conclusion

You've successfully created and deployed your own NFT collection on Morph L2 using the latest **Ethers.js v6** and **Hardhat**! You've learned how to:
- Set up a smart contract using OpenZeppelin's ERC-721 standard.
- Deploy it to a Layer 2 network.
- Mint an NFT and build a frontend that interacts with your contract.

Feel free to extend this tutorial by adding features like batch minting, integrating royalty standards, or building out a full NFT marketplace!

You can find example code for this tutorial here:  [Github Replo](https://github.com/EmmanuelKusi/morph-nft/)

