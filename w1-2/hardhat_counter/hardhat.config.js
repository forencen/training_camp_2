require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
const ALCHEMY_API_KEY = "KEY";
const GOERLI_PRIVATE_KEY = "YOUR GOERLI PRIVATE KEY";
module.exports = {
  solidity: "0.8.18",
  networks:{
    goerli: {
      url: `https://eth-goerli.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
      accounts: [GOERLI_PRIVATE_KEY],
    },
  }
};
