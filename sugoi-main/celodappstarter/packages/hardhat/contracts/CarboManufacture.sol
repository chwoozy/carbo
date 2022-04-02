// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "erc721a/contracts/ERC721A.sol";


contract CarboManufacture is ERC721A, Ownable, ReentrancyGuard {
    constructor() ERC721A("CarboManufacture", "MANUFACTURE") {}

    function mint(address _to) external {
        // _safeMint's second argument now takes in a quantity, not a tokenId.
        _safeMint(_to, 1);
    }
}