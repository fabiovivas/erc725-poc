// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IERC725Y {    
    event DataChanged(bytes32 indexed key, bytes value);
    function getData(bytes32[] memory keys) external view returns (bytes[] memory values);
    function setData(bytes32[] memory keys, bytes[] memory values) external;
}