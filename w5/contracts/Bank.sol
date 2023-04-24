// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/extensions/draft-IERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract Bank {
    mapping(address => uint) public deposited;
    address owner;
    address immutable token;
    constructor(address _token){
        owner = msg.sender;
        token = _token;

    }

    function deposit(uint256 amount) public {
        SafeERC20.safeTransferFrom(IERC20(token), msg.sender, address(this), amount);
        deposited[msg.sender] += amount;
    }

    function withdraw(uint256 amount) public {
        require(deposited[msg.sender] >= amount, "Insufficient balance");
        deposited[msg.sender] -= amount;
        SafeERC20.safeTransfer(IERC20(token), msg.sender, amount);
    }

    function permit(address owner, address spender, uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s) public {
        IERC20Permit(token).permit(owner, spender, value, deadline, v, r, s);
        deposited[msg.sender] += value;
    }

    function run() external {
        if (IERC20(token).balanceOf(address(this)) > 100 * 1e18) {
            SafeERC20.safeTransfer(IERC20(token), owner, 100 * 1e18);
        }
    }

}
