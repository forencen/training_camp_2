const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");


// describe("Counter", function() {

//   it("deploy", async function() {
//     const [owner, addr1] = await ethers.getSigners();
//     const Counter = await ethers.getContractFactory("Counter");
//     const counter = await Counter.deploy(0);
//     await counter.deployed();
//     // case 0 验证部署成功
//     expect(await counter.counter()).equal(0);
    
//   });
//   it("ower address count", async function () {
    
//     const [owner, addr1] = await ethers.getSigners();
//     const Counter = await ethers.getContractFactory("Counter");
//     const counter = await Counter.deploy(0);
//     await counter.deployed();

//     // case 1 部署地址成功
//     await counter.connect(owner).count();
//     expect(await counter.counter()).equal(1);
 
//   });

//   it("other address count", async function () {
    
//     const [owner, addr1] = await ethers.getSigners();
//     const Counter = await ethers.getContractFactory("Counter");
//     const counter = await Counter.deploy(0);
//     await counter.deployed();
//     // case 2 其他地址不成功
//     await expect(counter.connect(addr1).count()).to.be.revertedWith("need ower address");

//   });
// });

describe("Counter", function() {

  async function deployCounterInfo() {
    const [owner, addr1] = await ethers.getSigners();
    const Counter = await ethers.getContractFactory("Counter");
    const counter = await Counter.deploy(0);
    counterInstance = await counter.deployed();
    return { owner, addr1, counterInstance };
  }
  it("deploy", async function() {
    const {counterInstance} = await loadFixture(deployCounterInfo)
    // case 0 验证部署成功
    expect(await counterInstance.counter()).equal(0);
    
  });
  it("ower address count", async function () {

    const {owner, counterInstance} = await loadFixture(deployCounterInfo)
    // case 1 部署地址成功
    await counterInstance.connect(owner).count();
    expect(await counterInstance.counter()).equal(1);
 
  });

  it("other address count", async function () {
    
    const {addr1, counterInstance} = await loadFixture(deployCounterInfo)
    // case 2 其他地址不成功
    await expect(counterInstance.connect(addr1).count()).to.be.revertedWith("need ower address");

  });
});