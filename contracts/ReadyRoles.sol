// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts@4.9.6/access/AccessControl.sol";
import "@openzeppelin/contracts@4.9.6/security/Pausable.sol";
import "./../interfaces/ILegalPractitionerRegistry.sol";

contract ReadyRoles is AccessControl, Pausable, ILegalPractitionerRegistry {
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");

    struct Practitioner {
        Status status;
        string profileURI; // e.g., IPFS CID or HTTPS URL with bar number, docs, etc.
    }

    mapping(address => Practitioner) private _lawyers;
    mapping(address => Practitioner) private _judges;

    event LawyerVerificationRequested(address indexed account, string profileURI);
    event LawyerApproved(address indexed account, string profileURI);
    event LawyerRevoked(address indexed account);
    event JudgeSet(address indexed account, string profileURI, bool approved);

    constructor(address admin) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(VERIFIER_ROLE, admin);
    }

    // --- Admin controls ---
    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) { _pause(); }
    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) { _unpause(); }
    function addVerifier(address account) external onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(VERIFIER_ROLE, account);
    }
    function removeVerifier(address account) external onlyRole(DEFAULT_ADMIN_ROLE) {
        revokeRole(VERIFIER_ROLE, account);
    }

    // --- Lawyers ---
    function requestLawyerVerification(string calldata profileURI) external whenNotPaused {
        Practitioner storage p = _lawyers[msg.sender];
        require(p.status != Status.Approved, "Already approved");
        p.profileURI = profileURI;
        p.status = Status.Pending;
        emit LawyerVerificationRequested(msg.sender, profileURI);
    }

    function approveLawyer(address account, string calldata profileURI) external whenNotPaused onlyRole(VERIFIER_ROLE) {
        _lawyers[account] = Practitioner({ status: Status.Approved, profileURI: profileURI });
        emit LawyerApproved(account, profileURI);
    }

    function revokeLawyer(address account) external whenNotPaused onlyRole(VERIFIER_ROLE) {
        Practitioner storage p = _lawyers[account];
        require(p.status == Status.Approved || p.status == Status.Pending, "Not approved/pending");
        p.status = Status.Revoked;
        emit LawyerRevoked(account);
    }

    // --- Judges ---
    function setJudge(address account, string calldata profileURI, bool approved) external whenNotPaused onlyRole(VERIFIER_ROLE) {
        _judges[account] = Practitioner({
            status: approved ? Status.Approved : Status.Revoked,
            profileURI: profileURI
        });
        emit JudgeSet(account, profileURI, approved);
    }

    // --- Views / interface ---
    function isLawyer(address account) public view override returns (bool) {
        return _lawyers[account].status == Status.Approved;
    }
    function isJudge(address account) public view override returns (bool) {
        return _judges[account].status == Status.Approved;
    }

    function lawyerStatus(address account) external view override returns (Status) {
        return _lawyers[account].status;
    }
    function judgeStatus(address account) external view override returns (Status) {
        return _judges[account].status;
    }
    function lawyerProfileURI(address account) external view override returns (string memory) {
        return _lawyers[account].profileURI;
    }
    function judgeProfileURI(address account) external view override returns (string memory) {
        return _judges[account].profileURI;
    }
}
