// SPDX-License-Identifier: GPL-3.0

// 部署交易 https://goerli.etherscan.io/tx/0x5891c036e60e6c3db1bf698c44d725c6778c1fc8e465096e040a7bb48593b3f2
// 合约地址 0x82c613835e7a0e0edf615f2c1fa5b03261e50826
pragma solidity >=0.8.2 <0.9.0;

contract Counter {
    uint public counter;

    constructor (){
        counter = 0;
    }
    
    function count() public {
        counter = counter + 1;
    }

    function add(uint x) public{
         counter = counter + x;
    }

}