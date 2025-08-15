// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IEscrow {
    enum Status { None, Open, Funded, Accepted, Resolved, Disputed, Released, Refunded, Cancelled }

    event CaseOpened(bytes32 indexed caseId, address indexed client, address indexed lawyer, address token, uint256 amount, uint256 deadline);
    event CaseFunded(bytes32 indexed caseId, address indexed client, address token, uint256 amount);
    event CaseAccepted(bytes32 indexed caseId, address indexed lawyer);
    event CaseResolved(bytes32 indexed caseId, address indexed client);
    event DisputeRaised(bytes32 indexed caseId, address indexed by);
    event DisputeResolved(bytes32 indexed caseId, uint256 toLawyer, uint256 toClient);
    event ReleasedToLawyer(bytes32 indexed caseId, uint256 amount);
    event RefundedToClient(bytes32 indexed caseId, uint256 amount);
    event Withdrawal(address indexed user, address indexed token, uint256 amount);
}
