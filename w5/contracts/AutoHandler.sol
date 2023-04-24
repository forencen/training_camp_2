// SPDX-License-Identifier: UNLICENSED

import "@chainlink/contracts/src/v0.8/AutomationCompatible.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

pragma solidity ^0.8.0;

interface IBank {
    function run() external;
}

contract AutoHandler is AutomationCompatible {
    address public token;
    address public bank;

    constructor(address _token, address _bank){
        token = _token;
        bank = _bank;
    }

    function checkUpkeep(bytes calldata checkData) external returns (bool upkeepNeeded, bytes memory performData){
        if (IERC20(token).balanceOf(address(owner)) > 100 * 1e18) {
            return (true, checkData);
        }
        return (false, checkData);
    }

    function performUpkeep(bytes calldata performData) external {
        if (IERC20(token).balanceOf(address(bank)) > 100 * 1e18) {
            IBank(bank).run();
        }
    }

}
