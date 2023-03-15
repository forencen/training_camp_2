// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract MyBank {
    mapping(address => uint256) public balances;
    address public owner;

    event UserReceive(address user, uint amount);

    constructor () payable {
        owner = msg.sender;
        balances[owner] = msg.value;
    }
    receive() external payable {
        balances[msg.sender] = balances[msg.sender] + msg.value;
        emit UserReceive(msg.sender, msg.value);
    }

    function Withdraw(uint x) external{
        require(balances[msg.sender] >= x, "user balance not enough");
        balances[msg.sender] = balances[msg.sender] - x;
        (bool flag,) = payable(msg.sender).call{value: x}("");
        require(flag, "user withdraw failed");
    }
}
