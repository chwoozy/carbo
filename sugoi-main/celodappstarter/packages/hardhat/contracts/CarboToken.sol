// SPDX-License-Identifier: MIT

//   ▄████▄   ▄▄▄       ██▀███   ▄▄▄▄    ▒█████  
//  ▒██▀ ▀█  ▒████▄    ▓██ ▒ ██▒▓█████▄ ▒██▒  ██▒
//  ▒▓█    ▄ ▒██  ▀█▄  ▓██ ░▄█ ▒▒██▒ ▄██▒██░  ██▒
//  ▒▓▓▄ ▄██▒░██▄▄▄▄██ ▒██▀▀█▄  ▒██░█▀  ▒██   ██░
//  ▒ ▓███▀ ░ ▓█   ▓██▒░██▓ ▒██▒░▓█  ▀█▓░ ████▓▒░
//  ░ ░▒ ▒  ░ ▒▒   ▓▒█░░ ▒▓ ░▒▓░░▒▓███▀▒░ ▒░▒░▒░ 
//    ░  ▒     ▒   ▒▒ ░  ░▒ ░ ▒░▒░▒   ░   ░ ▒ ▒░ 
//  ░          ░   ▒     ░░   ░  ░    ░ ░ ░ ░ ▒  
//  ░ ░            ░  ░   ░      ░          ░ ░  
//  ░                                 ░          
                                                      
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract CarboToken is ERC721URIStorage, ERC721Enumerable, Ownable {

    // Burn Storage
    address public _burnAddress = 0x8d891cFFaEc8Dd6E571B717872db8095541110b2;

    mapping (address => string) _parties;

    struct Product {
        uint256 id;
        string name;
    }
    mapping (uint256 => Product) products;
    uint256 productCount = 0;
    uint256 transactionCount = 0;

    constructor(string memory merchantName, string memory merchantSymbol) ERC721(merchantName, merchantSymbol) {
        require(bytes(merchantName).length != 0, "Merchant name cannot be blank!");
        require(bytes(merchantSymbol).length != 0, "Merchant symbol cannot be blank!");
    }

    function addProducts(string memory productName) public onlyOwner{
        products[productCount] = Product(productCount, productName);
        productCount++;
    }

    function addParty(address _address, string memory _type) public onlyOwner {
        _parties[_address] = _type;
    }

    function changeBurnAddress(address _newAddress) public onlyOwner {
        _burnAddress = _newAddress;
    }


    function createTransaction(address _nextParty, string memory tokenUri) public returns (uint256 tokenID) {
        require(keccak256(bytes(_parties[msg.sender])) == keccak256(bytes("Production")), "Only production can create transaction");
        mint(_nextParty);
        _setTokenURI(transactionCount, tokenUri);
        transactionCount++;
        return transactionCount;
    }

    function holderSign(address _nextParty, uint256 tokenID) public returns (string memory message) {
        uint256 tokenBalance = balanceOf(msg.sender);
        for (uint256 i = 0; i < tokenBalance; i++) {
            if (tokenOfOwnerByIndex(msg.sender, i) == tokenID) {
                safeTransferFrom(msg.sender, _nextParty, tokenID);
                return "Successfully transferred!";
            }
        }
        return "Token not found!";
    }

    function holderBurn(uint256 tokenID) public returns (string memory message) {
        uint256 tokenBalance = balanceOf(msg.sender);
        for (uint256 i = 0; i < tokenBalance; i++) {
            if (tokenOfOwnerByIndex(msg.sender, i) == tokenID) {
                safeTransferFrom(msg.sender, _burnAddress, tokenID);
                return "Successfully burned!";
            }
        }
        return "Token not found!";
    }

    function mint(address _to) public {
        _safeMint(_to, transactionCount);
    }
    
    // Overrides conflicting functions
    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

}