// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Market is Ownable {
    using SafeERC20 for IERC20;

    address token20;
    address token721;
    uint256 fee;
    bool locked;

    event GoodsList(uint256 indexed token_id, address sellers, uint256 price);
    event GoodeSold(uint256 indexed token_id, address purchaser, uint256 price);

    struct Goods {
        uint256 token_id;
        uint256 price;
        address owner;
        bool selling;
    }

    mapping(uint256 => Goods) private listMapping;
    mapping(address => uint256) public Bank;

    constructor(address _token20, address _token721){
        token20 = _token20;
        token721 = _token721;
    }

    modifier lock() {
        require(!locked, 'Market: LOCKED');
        locked = true;
        _;
        locked = false;
    }

    function list(uint256 _tokenId, uint256 _price) public {
        require(msg.sender == IERC721(token721).ownerOf(_tokenId), "NFT need ownerOf sender");
        IERC721(token721).safeTransferFrom(msg.sender, address(this), _tokenId);
        listMapping[_tokenId] = Goods(_tokenId, _price, msg.sender, true);
        emit GoodsList(_tokenId, msg.sender, _price);
    }

    function buyNft(uint256 _tokenId, uint256 _price) public {
        Goods memory gItem = listMapping[_tokenId];
        require(gItem.selling, "NFT is not exist");
        require(_price >= gItem.price, "price not enough");
        IERC20(token20).safeTransferFrom(msg.sender, address(this), _price);
        delete listMapping[_tokenId];
        Bank[gItem.owner] += _price;
        IERC721(token721).safeTransferFrom(address(this), msg.sender, _tokenId);
        emit GoodeSold(_tokenId, msg.sender, _price);
    }

    function showGoods(uint256 _tokenId) public view returns (uint256, uint256, address, bool) {
        Goods memory gItem = listMapping[_tokenId];
        return (gItem.token_id, gItem.price, gItem.owner, gItem.selling);
    }

    // 实现 onERC721Received ，721对合约转移nft需要目标实现此方法
    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external returns (bytes4) {
        return this.onERC721Received.selector;
    }

    function Withdraw() lock external {
        require(Bank[msg.sender] > 0, "user balance not enough");
        // 收取手续费
        if (fee > 0) {
            IERC20(token20).safeTransfer(msg.sender, Bank[msg.sender] * fee / 100);
        } else {
            IERC20(token20).safeTransfer(msg.sender, Bank[msg.sender]);
        }
        Bank[msg.sender] = 0;
    }

    function sefFee(uint256 _fee) onlyOwner external {
        fee = _fee;
    }
}
