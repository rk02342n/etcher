// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract PostRegistry {
    struct Post {
        address author;
        bytes32 contentHash; // keccak256 hash of the post content (or IPFS CID)
        string contentCID;   // IPFS CID for retrieval
        uint256 timestamp;
    }

    uint256 public postCount;
    mapping(uint256 => Post) public posts;

    event PostPublished(
        uint256 indexed postId,
        address indexed author,
        bytes32 contentHash,
        string contentCID,
        uint256 timestamp
    );

    function publishPost(bytes32 _contentHash, string calldata _contentCID) external {
        posts[postCount] = Post({
            author: msg.sender,
            contentHash: _contentHash,
            contentCID: _contentCID,
            timestamp: block.timestamp
        });

        emit PostPublished(postCount, msg.sender, _contentHash, _contentCID, block.timestamp);

        postCount++;
    }
}
