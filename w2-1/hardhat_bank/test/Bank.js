const {expect} = require("chai");
const {ethers} = require("hardhat");
const {loadFixture} = require("@nomicfoundation/hardhat-network-helpers");
describe("MyBank", function () {

    async function deployCounterInfo() {
        const [owner, addr1] = await ethers.getSigners();
        const bank = await ethers.getContractFactory("MyBank");
        const counter = await bank.deploy();
        let instance = await counter.deployed();
        return {owner, addr1, instance};
    }

    it("receive", async function () {
        const {owner,addr1, instance} = await loadFixture(deployCounterInfo)
        await owner.sendTransaction({
            to: instance.address,
            value:  ethers.utils.parseEther("10")
        })
        expect(await instance.balances(owner.address)).equal( ethers.utils.parseEther("10"));
        await addr1.sendTransaction({
            to: instance.address,
            value:  ethers.utils.parseEther("10")
        })
        expect(await instance.balances(addr1.address)).equal( ethers.utils.parseEther("10"));
    });
    it("Withdraw", async function () {
        const {owner, instance} = await loadFixture(deployCounterInfo)
        await owner.sendTransaction({
            to: instance.address,
            value:  ethers.utils.parseEther("10")
        })
        await instance.Withdraw(ethers.utils.parseEther("9"))
        expect(await instance.balances(owner.address)).equal( ethers.utils.parseEther("1"));

    });
    it("WithdrawError", async function () {
        const {addr1, instance} = await loadFixture(deployCounterInfo)
        await expect(instance.connect(addr1).Withdraw(ethers.utils.parseEther("9"))).to.be.revertedWith("user balance not enough");
        // await expect(counterInstance.connect(addr1).count()).to.be.revertedWith("need ower address");
    });
});
