const {
    loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const {expect} = require("chai");
const hre = require("hardhat");

describe("Score", function () {
    async function deployOneYearLockFixture() {
        const Teacher = await hre.ethers.getContractFactory("Teacher");
        const _teacher = await Teacher.deploy();

        await _teacher.deployed();

        const Score = await hre.ethers.getContractFactory("Score");
        const _score = await Score.deploy(_teacher.address)
        await _score.deployed();
        const [owner, otherAccount] = await ethers.getSigners();

        return {_score, _teacher, owner, otherAccount};
    }

    describe("Deployment", function () {
        it("Admin", async function () {
            const {otherAccount, _score} = await loadFixture(deployOneYearLockFixture);
            await expect(_score.connect(otherAccount).SetAdmin(otherAccount.address)).to.be.revertedWith("only admin can do this!")
            const {owner} = await loadFixture(deployOneYearLockFixture);
            await expect(_score.connect(owner).SetAdmin(otherAccount.address)).not.to.be.reverted

        });

        it("ChangeTeacher", async function () {
            const {otherAccount, _score, owner} = await loadFixture(deployOneYearLockFixture);
            await expect(_score.connect(otherAccount).ChangeTeacher(owner.address)).to.be.revertedWith("only admin can do this!")
            await expect(_score.connect(owner).SetAdmin(otherAccount.address)).not.to.be.reverted
        });

        it("SetScore", async function () {
            const {owner, _score} = await loadFixture(deployOneYearLockFixture);
            await expect(_score.SetScore(owner.address, 99)).to.be.revertedWith("only teacher can do this!")
        });

    });

    describe("Teacher", function () {
        describe("setScore", function () {
            it("setScoreErr1", async function () {
                const { _teacher, _score, owner } = await loadFixture(deployOneYearLockFixture);
                await expect(_teacher.SetStudentScore(_score.address, [owner.address], [199])).to.be.revertedWith("error score")
            });

            it("setScore", async function () {
                const { _teacher, _score, owner, otherAccount } = await loadFixture(deployOneYearLockFixture);
                await _teacher.SetStudentScore(_score.address, [owner.address,otherAccount.address], [99,100]);
                expect(await _score.GetScore(owner.address)).to.equal(99);
                expect(await _score.GetScore(otherAccount.address)).to.equal(100);

            });
        });
    });
});
