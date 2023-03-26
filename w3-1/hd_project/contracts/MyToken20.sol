// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
//import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MyToken20 is ERC20 {

    using Counters for Counters.Counter;
    mapping(address => Counters.Counter) private  _nonce;

    constructor() ERC20("Forencen", "CRH"){
        _mint(msg.sender, 1000000000000000000000000);
    }
}
