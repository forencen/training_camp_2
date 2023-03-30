// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
    // 构建合约MyToken20 并部署
    const MyToken20 = await hre.ethers.getContractFactory("MyToken20");
    const _myToken20 = await MyToken20.deploy();
    // 构建合约MyToken721 并部署
    const MyToken721 = await hre.ethers.getContractFactory("MyToken721");
    const _myToken721 = await MyToken721.deploy();

    //构建Market合约
    const Market = await hre.ethers.getContractFactory("Market");
    const _market = await Market.deploy(_myToken20.address, _myToken721.address);

    console.log(
        `MyToken20 address: ${_myToken20.address} .
         MyToken721 address: ${_myToken721.address} .
         Market address: ${_market.address} .`
    );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
