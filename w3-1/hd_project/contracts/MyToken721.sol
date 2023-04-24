// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MyToken721 is ERC721 {

    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;

    constructor() ERC721("Forencen", "CRH") {
    }


    function mint(address _owner) public returns (uint256)
    {
        uint256 newItemId = _tokenIds.current();
        _mint(_owner, newItemId);
        _tokenIds.increment();
        return newItemId;
    }


}
