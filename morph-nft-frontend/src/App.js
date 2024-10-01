import React, { useState } from 'react';
import { ethers } from 'ethers';
import NFTContractABI from './NFTContractABI.json';  // Make sure to export the ABI from Hardhat

const contractAddress = "0x77778EBa8Ed0f023B1f62C7dFBf0D5DE210B0dd3";  // Replace with your contract's address

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