require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
/** @type import('hardhat/config').HardhatUserConfig */

const INFURA_API_KEY = process.env.INFURA_API_KEY;
const GOERLI_PRIVATE_KEY = process.env.GOERLI_PRIVATE_KEY;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
module.exports = {
    solidity: "0.8.18",
    networks: {
        goerli: {
            url: `https://goerli.infura.io/v3/${INFURA_API_KEY}`,
            accounts: [GOERLI_PRIVATE_KEY]
        }
    },
    etherscan: {
        apiKey: {
            goerli: ETHERSCAN_API_KEY
        }
    }

};
