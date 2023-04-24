// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";


contract MyToken20 is ERC20Permit {
    constructor() ERC20("CRH", "crh") ERC20Permit("CRH") {
        _mint(msg.sender, 1000000 * 10 ** 18);
    }
}
