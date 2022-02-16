// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./interfaces/IERC165.sol";

abstract contract ERC165Storage is IERC165 {
    
    mapping(bytes4 => bool) private _supportedInterfaces;
    
    function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
        return interfaceId == type(IERC165).interfaceId || _supportedInterfaces[interfaceId];
    }
    
    function _registerInterface(bytes4 interfaceId) internal virtual {
        require(interfaceId != 0xffffffff, "ERC165: invalid interface id");
        _supportedInterfaces[interfaceId] = true;
    }
}
