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

contract CarboMerchant is ERC721URIStorage, ERC721Enumerable, Ownable, ReentrancyGuard {

    // Burn Storage
    address public _burnAddress = 0x8d891cFFaEc8Dd6E571B717872db8095541110b2;

    // Merchant Information
    address public _merchantAddress;
    string public _merchantName;

    mapping (address => string) _parties;

    struct Product {
        uint256 id;
        string name;
    }
    mapping (uint256 => Product) products;
    uint256 productCount = 0;

    struct Transaction {
        uint256 id;
    }
    uint256 transactionCount = 0;

    // Supply Chain Keys
    constructor(string memory merchantName) ERC721("CarboToken", "CARBO") {
        require(bytes(merchantName).length != 0, "Merchant name cannot be blank!");
        _merchantName = merchantName;
        _merchantAddress = msg.sender;
    }

    function addProducts(string memory productName) public onlyOwner{
        products[productCount] = Product(productCount, productName);
        productCount++;
    }

    function addParty(address _address, string memory _type) public onlyOwner {
        _parties[_address] = _type;
    }


    function createTransaction(address _nextParty, string memory tokenUri) public returns (uint256 tokenID) {
        require(keccak256(bytes(_parties[msg.sender])) == keccak256(bytes("Production")), "Only production can create transaction");
        mint(_nextParty);
        transactionCount++;
        _setTokenURI(transactionCount, tokenUri);
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
        // _safeMint's second argument now takes in a quantity, not a tokenId.
        _safeMint(_to, 1);
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