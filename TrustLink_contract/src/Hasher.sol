// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./IHasher.sol";

contract Hasher is IHasher {
    struct UserData {
        bytes32 storedHash;
        uint64 storedTimestamp;
    }

    mapping(address => UserData[]) public userRecords; // Store multiple hashes per user
    address[] private users; // Track unique users

    function hashDocument() external view override returns (bytes32, uint64) {
        require(userRecords[msg.sender].length > 0, "No hash stored.");
        uint256 lastIndex = userRecords[msg.sender].length - 1;
        return (userRecords[msg.sender][lastIndex].storedHash, userRecords[msg.sender][lastIndex].storedTimestamp);
    }

    function verifyDocument(bytes32 expected_hash, uint64 expected_timestamp) external view override returns (bool) {
        uint256 length = userRecords[msg.sender].length;
        for (uint256 i = 0; i < length; i++) {
            if (userRecords[msg.sender][i].storedHash == expected_hash && userRecords[msg.sender][i].storedTimestamp == expected_timestamp) {
                return true;
            }
        }
        return false;
    }

    function storeHash(bytes32 hash, uint64 timestamp) external {
        if (userRecords[msg.sender].length == 0) {
            users.push(msg.sender); // Track new users only once
        }

        userRecords[msg.sender].push(UserData(hash, timestamp)); // Store multiple hashes per user
    }

    function getAllStoredHashesAndTimestamps() external view override returns (address[] memory, bytes32[] memory, uint64[] memory) {
        uint256 totalRecords;
        for (uint256 i = 0; i < users.length; i++) {
            totalRecords += userRecords[users[i]].length;
        }

        address[] memory userAddresses = new address[](totalRecords);
        bytes32[] memory hashes = new bytes32[](totalRecords);
        uint64[] memory timestamps = new uint64[](totalRecords);

        uint256 index = 0;
        for (uint256 i = 0; i < users.length; i++) {
            for (uint256 j = 0; j < userRecords[users[i]].length; j++) {
                userAddresses[index] = users[i];
                hashes[index] = userRecords[users[i]][j].storedHash;
                timestamps[index] = userRecords[users[i]][j].storedTimestamp;
                index++;
            }
        }

        return (userAddresses, hashes, timestamps);
    }
}
