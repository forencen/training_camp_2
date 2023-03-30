const {
    loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const {expect} = require("chai");
const hre = require("hardhat");
const {ethers} = require("hardhat");

describe("MyToken20", function () {
    async function deployOneYearLockFixture() {
        const MyToken20 = await hre.ethers.getContractFactory("MyToken20");
        const _my_token20 = await MyToken20.deploy();

        await _my_token20.deployed();

        const [owner, otherAccount] = await ethers.getSigners();

        return {_my_token20, owner, otherAccount};
    }
    it("name", async function () {
        const {_my_token20} = await loadFixture(deployOneYearLockFixture);
        // test token20 name function
        expect(await _my_token20.name()).to.equal('Forencen');
    });

    it("BalanceOf", async function () {
        const {_my_token20, owner} = await loadFixture(deployOneYearLockFixture)
        expect(await _my_token20.balanceOf(owner.address)).to.equal(ethers.BigNumber.from('1000000000000000000000000'));
    });

    it("Transfer", async function () {
        const {_my_token20, otherAccount} = await loadFixture(deployOneYearLockFixture);
        await _my_token20.transfer(otherAccount.address, 100000000);
        expect(await _my_token20.connect(otherAccount).balanceOf(otherAccount.address)).to.equal(100000000);
    });
});
