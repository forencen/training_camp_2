const {
    loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const {expect} = require("chai");
const hre = require("hardhat");
const {ethers} = require("hardhat");

describe("MyToken721", function () {
    async function deployOneYearLockFixture() {
        const MyToken721 = await hre.ethers.getContractFactory("MyToken721");
        const _my_token721 = await MyToken721.deploy();

        await _my_token721.deployed();

        const [owner, otherAccount] = await ethers.getSigners();

        return { _my_token721, owner, otherAccount};
    }

    it("name", async function () {
        const {_my_token721} = await loadFixture(deployOneYearLockFixture);
        // test token20 name function
        expect(await _my_token721.name()).to.equal('Forencen');
    });

    it("mint_balanceOf", async function () {
        const {_my_token721, owner} = await loadFixture(deployOneYearLockFixture)
        expect(await _my_token721.mint(owner.address)).not.to.be.reverted;
        expect(await _my_token721.balanceOf(owner.address)).to.equal(ethers.BigNumber.from('1'));
    });

});
