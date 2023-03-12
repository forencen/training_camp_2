## 使用hardhat初始化项目

项目结构如图：

![img.png](imgs%2Fimg.png)


## 在之前的counter合约中加入部署者调用权限

``` solidity
// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

contract Counter {
    uint public counter;
    address public ownerAddress;

    constructor (uint _count){
        counter = _count;
        ownerAddress = msg.sender;
        
    }

    modifier Ower() {
        require(msg.sender == ownerAddress, "need ower address");
        _;
    }


    function count() public Ower {
        counter = counter + 1;
    }

    function add(uint x) public{
         counter = counter + x;
    }

}
```

### 编写测试用例
[Counter.js](hardhat_counter%2Ftest%2FCounter.js)

``` javascript
describe("Counter", function() {

  it("deploy", async function() {
    const [owner, addr1] = await ethers.getSigners();
    const Counter = await ethers.getContractFactory("Counter");
    const counter = await Counter.deploy(0);
    await counter.deployed();
    // case 0 验证部署成功
    expect(await counter.counter()).equal(0);
    
  });
  it("ower address count", async function () {
    
    const [owner, addr1] = await ethers.getSigners();
    const Counter = await ethers.getContractFactory("Counter");
    const counter = await Counter.deploy(0);
    await counter.deployed();

    // case 1 部署地址成功
    await counter.connect(owner).count();
    expect(await counter.counter()).equal(1);
 
  });

  it("other address count", async function () {
    
    const [owner, addr1] = await ethers.getSigners();
    const Counter = await ethers.getContractFactory("Counter");
    const counter = await Counter.deploy(0);
    await counter.deployed();
    // case 2 其他地址不成功
    await expect(counter.connect(addr1).count()).to.be.revertedWith("need ower address");

  });
});
```

每次都会重复部署合约，修改为如下

```javascript

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
```

### 部署合约

部署使用的账户：`0xC3106642437E8657829045BA4299D846E333F84C`
部署生成的合约账户 `0x85574e3413d02Fa3F4818677D2a13285Ef79FEA5`
``` 
(base) ➜  hardhat_counter git:(main) ✗ npx hardhat run --network goerli scripts/deploy.js
counter deployed to: 0x85574e3413d02Fa3F4818677D2a13285Ef79FEA5

```

验证合约 https://goerli.etherscan.io/address/0x85574e3413d02Fa3F4818677D2a13285Ef79FEA5#code
```
(base) ➜  hardhat_counter git:(main) ✗ npx hardhat verify --network goerli  0x85574e3413d02Fa3F4818677D2a13285Ef79FEA5   0
Nothing to compile
Successfully submitted source code for contract
contracts/Counter.sol:Counter at 0x85574e3413d02Fa3F4818677D2a13285Ef79FEA5
for verification on the block explorer. Waiting for verification result...

Successfully verified contract Counter on Etherscan.
https://goerli.etherscan.io/address/0x85574e3413d02Fa3F4818677D2a13285Ef79FEA5#code

```