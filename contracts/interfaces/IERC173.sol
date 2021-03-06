// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IERC173 /* is ERC165 */ {
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    function owner() view external returns(address); 
    function transferOwnership(address _newOwner) external;	
}