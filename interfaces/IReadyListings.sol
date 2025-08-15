// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IReadyListings {
    // Events act as the primary off-chain index; on-chain storage kept minimal.
    event LawyerListingUpserted(
        address indexed lawyer,
        string profileURI,
        uint256 hourlyRate,     // in smallest unit of token or "quote currency"
        string[] tags
    );
    event LawyerListingRemoved(address indexed lawyer);

    event CaseSignalCreated(
        bytes32 indexed signalId,
        address indexed client,
        string caseURI,         // points to details (IPFS/HTTPS)
        uint256 budgetMin,
        uint256 budgetMax,
        string[] tags
    );
    event CaseSignalClosed(bytes32 indexed signalId);

    function hasLawyerListing(address lawyer) external view returns (bool);
    function caseSignalClient(bytes32 signalId) external view returns (address);
}
