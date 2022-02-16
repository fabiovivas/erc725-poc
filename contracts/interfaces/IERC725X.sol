// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IERC725X {
    event ContractCreated(
        uint256 indexed operation,
        address indexed contractAddress,
        uint256 indexed value
    );
    event Executed(
        uint256 indexed operation,
        address indexed to,
        uint256 indexed value,
        bytes data
    );
    function execute(
        uint256 operationType,
        address to,
        uint256 value,
        bytes calldata data
    ) external payable returns (bytes memory);
}