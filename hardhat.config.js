require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();


module.exports = {
  solidity: "0.8.20",
  networks: {
    morphL2: {
      url: "https://rpc-quicknode-holesky.morphl2.io", // Replace with the actual Morph L2 RPC URL
      accounts: [process.env.PRIVATE_KEY] // Use environment variables for your private key
    }
  }
};
