// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts@4.9.6/access/AccessControl.sol";
import "@openzeppelin/contracts@4.9.6/security/Pausable.sol";

import "./../interfaces/ILegalPractitionerRegistry.sol";
import "./../interfaces/IReadyListings.sol";

contract ReadyListings is IReadyListings, AccessControl, Pausable {
    ILegalPractitionerRegistry public immutable registry;

    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");

    // Minimal on-chain storage; details live off-chain via events.
    mapping(address => bool) private _lawyerHasListing;
    mapping(bytes32 => address) private _signalClient;

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

    // ===== Lawyer Listings =====
    function upsertLawyerListing(
        string calldata profileURI,
        uint256 hourlyRate,
        string[] calldata tags
    ) external whenNotPaused {
        require(registry.isLawyer(msg.sender), "lawyer only");
        require(bytes(profileURI).length > 0, "empty uri");
        _lawyerHasListing[msg.sender] = true;

        emit LawyerListingUpserted(msg.sender, profileURI, hourlyRate, tags);
    }

    function removeLawyerListing() external whenNotPaused {
        require(registry.isLawyer(msg.sender), "lawyer only");
        require(_lawyerHasListing[msg.sender], "no listing");
        _lawyerHasListing[msg.sender] = false;

        emit LawyerListingRemoved(msg.sender);
    }

    // ===== Client Case Signals =====
    function createCaseSignal(
        bytes32 signalId,
        string calldata caseURI,
        uint256 budgetMin,
        uint256 budgetMax,
        string[] calldata tags
    ) external whenNotPaused {
        require(_signalClient[signalId] == address(0), "id exists");
        require(bytes(caseURI).length > 0, "empty uri");
        require(budgetMax == 0 || budgetMax >= budgetMin, "bad range");

        _signalClient[signalId] = msg.sender;
        emit CaseSignalCreated(signalId, msg.sender, caseURI, budgetMin, budgetMax, tags);
    }

    function closeCaseSignal(bytes32 signalId) external whenNotPaused {
        require(_signalClient[signalId] == msg.sender || hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "not owner/admin");
        delete _signalClient[signalId];
        emit CaseSignalClosed(signalId);
    }

    // ===== Views =====
    function hasLawyerListing(address lawyer) external view override returns (bool) { return _lawyerHasListing[lawyer]; }
    function caseSignalClient(bytes32 signalId) external view override returns (address) { return _signalClient[signalId]; }
}
