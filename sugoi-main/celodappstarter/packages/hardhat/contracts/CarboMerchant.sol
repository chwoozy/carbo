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

contract CarboMerchant is Ownable, ReentrancyGuard {

    // Merchant Information
    address public _merchantAddress;
    string public _merchantName;

    struct Product {
        int256 id;
        string name;
    }
    mapping (uint256 => Product) products;
    uint256 productCount = 0;

    // Supply Chain Keys
    // "Transport"
    // "Manufacture"
    // "Retail"
    // carbon profile includes quantity

    constructor(string memory merchantName) {
        require(bytes(merchantName).length != 0, "Merchant name cannot be blank!");
        _merchantName = merchantName;
        _merchantAddress = msg.sender;
    }

    function addProducts(string memory productName) {
        products[productCount] = Product(productName);
        productCount++;
    }

    function awardTransport() {

    }

    function awardManufacture() {

    }

    function awardRetail() {

    }
    

}