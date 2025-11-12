// SPDX-License-Identifier: MIT-OR-APACHE-2.0
pragma solidity ^0.8.23;

interface IHasher  {
    function hashDocument() external view returns (bytes32, uint64);
    function verifyDocument(bytes32 expected_hash, uint64 expected_timestamp) external view returns (bool);
    function getAllStoredHashesAndTimestamps() external view returns (address[] memory, bytes32[] memory, uint64[] memory);
}
