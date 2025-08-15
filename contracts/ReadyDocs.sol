// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts@4.9.6/access/AccessControl.sol";
import "@openzeppelin/contracts@4.9.6/security/Pausable.sol";

import "./../interfaces/ILegalPractitionerRegistry.sol";
import "./../interfaces/IReadyDocs.sol";

contract ReadyDocs is IReadyDocs, AccessControl, Pausable {
    ILegalPractitionerRegistry public immutable registry;

    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");

    struct DocMeta {
        DocType docType;
        string caseId;     // optional human-readable/case number
        bool exists;
    }

    mapping(bytes32 => DocMeta) private _docs;
    mapping(bytes32 => Version[]) private _versions;

    modifier onlyAdmin() {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Not admin");
        _;
    }

    constructor(address admin, address registryAddress) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(OPERATOR_ROLE, admin);
        registry = ILegalPractitionerRegistry(registryAddress);
    }

    // ===== Admin =====
    function pause() external onlyAdmin { _pause(); }
    function unpause() external onlyAdmin { _unpause(); }
    function setOperator(address account, bool ok) external onlyAdmin {
        if (ok) _grantRole(OPERATOR_ROLE, account);
        else _revokeRole(OPERATOR_ROLE, account);
    }

    // ===== Create / Add versions =====
    function createDocument(bytes32 docId, DocType docType, string calldata caseId, string calldata initialCid)
        external
        whenNotPaused
    {
        require(!_docs[docId].exists, "doc exists");

        // Gate initial author by type
        if (docType == DocType.Judgment) {
            require(registry.isJudge(msg.sender), "judge only");
        } else if (docType == DocType.Pleading) {
            require(registry.isLawyer(msg.sender), "lawyer only");
        }
        _docs[docId] = DocMeta({ docType: docType, caseId: caseId, exists: true });

        _versions[docId].push(Version({
            cid: initialCid,
            timestamp: block.timestamp,
            revoked: false,
            author: msg.sender
        }));

        emit DocCreated(docId, docType, caseId, msg.sender);
        emit VersionAdded(docId, 0, initialCid, msg.sender);
    }

    function addVersion(bytes32 docId, string calldata cid) external whenNotPaused {
        DocMeta memory dm = _docs[docId];
        require(dm.exists, "no doc");

        // Gate author by docType for each version
        if (dm.docType == DocType.Judgment) {
            require(registry.isJudge(msg.sender), "judge only");
        } else if (dm.docType == DocType.Pleading) {
            require(registry.isLawyer(msg.sender), "lawyer only");
        }

        _versions[docId].push(Version({
            cid: cid,
            timestamp: block.timestamp,
            revoked: false,
            author: msg.sender
        }));

        emit VersionAdded(docId, _versions[docId].length - 1, cid, msg.sender);
    }

    // Author or admin may revoke a specific version (soft)
    function revokeVersion(bytes32 docId, uint256 index) external whenNotPaused {
        require(index < _versions[docId].length, "bad index");
        Version storage v = _versions[docId][index];
        require(!v.revoked, "already revoked");
        require(v.author == msg.sender || hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "not author/admin");

        v.revoked = true;
        emit VersionRevoked(docId, index, msg.sender);
    }

    // ===== Views =====
    function docTypeOf(bytes32 docId) external view override returns (DocType) { return _docs[docId].docType; }
    function versionCount(bytes32 docId) external view override returns (uint256) { return _versions[docId].length; }
    function getVersion(bytes32 docId, uint256 index) external view override returns (Version memory) {
        return _versions[docId][index];
    }
}
