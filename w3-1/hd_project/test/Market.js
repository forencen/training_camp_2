const {
    loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const {expect} = require("chai");
const hre = require("hardhat");
const {ethers} = require("hardhat");

async function getPermitSignature(signer, token, spender, value, deadline) {
    const [nonce, name, version, chainId] = await Promise.all([
        token.nonces(signer.address),
        token.name(),
        "1",
        signer.getChainId(),
    ])

    return ethers.utils.splitSignature(
        await signer._signTypedData(
            {
                name,
                version,
                chainId,
                verifyingContract: token.address,
            },
            {
                Permit: [
                    {
                        name: "owner",
                        type: "address",
                    },
                    {
                        name: "spender",
                        type: "address",
                    },
                    {
                        name: "value",
                        type: "uint256",
                    },
                    {
                        name: "nonce",
                        type: "uint256",
                    },
                    {
                        name: "deadline",
                        type: "uint256",
                    },
                ],
            },
            {
                owner: signer.address,
                spender,
                value,
                nonce,
                deadline,
            }
        )
    )
}

describe("Market", function () {
    let my_token721;
    let my_token20;
    let market;

    beforeEach(async () => {
        const MyToken20 = await hre.ethers.getContractFactory("MyToken20");
        my_token20 = await MyToken20.deploy();
        await my_token20.deployed();

        const MyToken721 = await hre.ethers.getContractFactory("MyToken721");
        my_token721 = await MyToken721.deploy();
        await my_token721.deployed();

        const Market = await hre.ethers.getContractFactory("Market");
        market = await Market.deploy(my_token20.address, my_token721.address);
        await market.deployed();
    })

    async function deployOneYearLockFixture() {
        const [owner, otherAccount, addr1] = await ethers.getSigners();
        return {owner, otherAccount, addr1};
    }

    it("list", async function () {
        const {owner} = await loadFixture(deployOneYearLockFixture);
        // mint nft
        expect(await my_token721.mint(owner.address)).not.to.be.reverted;
        // list nft to market, 设置价格为100000000 token20
        expect(await my_token721.approve(market.address, 0)).not.to.be.reverted;
        await market.connect(owner).list(0, 100000000);
        let goods_info = await market.showGoods(0)
        expect(goods_info[2] === owner.address);
        expect(goods_info[0] === 0);
    });

    it("buyNft", async function () {
        const [owner, addr1, addr2] = await ethers.getSigners();
        // 发送代币
        await my_token20.transfer(addr1.address, 110000000);
        // 购买代币
        await my_token20.connect(addr1).approve(market.address, 110000000)
        await expect(market.connect(addr1).buyNft(0, 100000000)).to.be.revertedWith("NFT is not exist");

        await my_token721.mint(owner.address);
        // list nft to market, 设置价格为100000000 token20
        await my_token721.approve(market.address, 0);
        await market.connect(owner).list(0, 100000000);

        expect(await market.connect(addr1).buyNft(0, 100000000)).not.to.be.reverted;
        expect(await my_token20.balanceOf(addr1.address)).to.equal(10000000);
        // 检查nft是否转移
        expect(await my_token721.ownerOf(0)).to.equal(addr1.address);
        // 检查市场owner的余额
        expect(await market.Bank(owner.address)).to.equal(100000000);
    });

    it("permit", async function(){
        const [owner, addr1, addr2] = await ethers.getSigners();
        await my_token721.mint(addr1.address);
        await my_token721.connect(addr1).approve(market.address, 0);
        await market.connect(addr1).list(0, 9999999);
        let goods_info = await market.showGoods(0)
        expect(goods_info[3], "safeTransferFrom failed");
        const deadline = Date.now() +100
        const { v, r, s } = await getPermitSignature(
            owner,
            my_token20,
            market.address,
            9999999,
            deadline
        )
        await market.buyNftWithPermit(0, 9999999, deadline, v, r, s)
        await market.connect(addr1).Withdraw()
        expect(await my_token20.balanceOf(addr1.address)).to.equal(9999999)

    });

});
