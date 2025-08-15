// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IReadyDocs {
    enum DocType { Other, Pleading, Judgment, Contract, Evidence }
    struct Version {
        string cid;        // IPFS CID (or any URI)
        uint256 timestamp; // block timestamp
        bool revoked;      // soft revocation
        address author;    // who added this version
    }

    event DocCreated(bytes32 indexed docId, DocType docType, string caseId, address indexed author);
    event VersionAdded(bytes32 indexed docId, uint256 versionIndex, string cid, address indexed author);
    event VersionRevoked(bytes32 indexed docId, uint256 versionIndex, address indexed by);

    function docTypeOf(bytes32 docId) external view returns (DocType);
    function versionCount(bytes32 docId) external view returns (uint256);
    function getVersion(bytes32 docId, uint256 index) external view returns (Version memory);
}
