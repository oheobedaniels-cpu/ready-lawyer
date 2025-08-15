// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IReadyFund {
    enum Status { None, Active, Succeeded, Failed, Cancelled, PayoutReady, Refunding }

    event CampaignCreated(
        bytes32 indexed id,
        address indexed creator,
        address indexed beneficiary,
        address token,
        uint256 goal,
        uint256 deadline,
        bool beneficiaryIsLawyer
    );
    event Contributed(bytes32 indexed id, address indexed contributor, uint256 amount);
    event Cancelled(bytes32 indexed id);
    event Finalized(bytes32 indexed id, bool succeeded);
    event RefundClaimed(bytes32 indexed id, address indexed contributor, uint256 amount);
    event PayoutQueued(bytes32 indexed id, address indexed beneficiary, uint256 amount);
    event Withdrawal(address indexed user, address indexed token, uint256 amount);

    function getStatus(bytes32 id) external view returns (Status);
    function raised(bytes32 id) external view returns (uint256);
    function goal(bytes32 id) external view returns (uint256);
    function tokenOf(bytes32 id) external view returns (address);
    function beneficiaryOf(bytes32 id) external view returns (address);
    function contributionOf(bytes32 id, address user) external view returns (uint256);
}
