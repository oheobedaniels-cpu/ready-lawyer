// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts@4.9.6/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts@4.9.6/security/Pausable.sol";
import "@openzeppelin/contracts@4.9.6/access/AccessControl.sol";
import "@openzeppelin/contracts@4.9.6/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts@4.9.6/token/ERC20/utils/SafeERC20.sol";

import "./../interfaces/ILegalPractitionerRegistry.sol";
import "./../interfaces/IEscrow.sol";

contract ReadyEscrow is IEscrow, AccessControl, Pausable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    bytes32 public constant ARBITER_ROLE = keccak256("ARBITER_ROLE"); // Admin or trusted dispute resolvers
    ILegalPractitionerRegistry public immutable registry;

    struct CaseData {
        address client;
        address lawyer;     // optional at open; can be set on accept
        address token;      // address(0) = AVAX
        uint256 amount;     // fixed-fee for MVP
        uint256 createdAt;
        uint256 deadline;   // optional business deadline (no auto-enforce)
        Status status;
    }

    mapping(bytes32 => CaseData) public cases;
    mapping(bytes32 => uint256) public escrowed; // amount held per case
    // token => user => balance
    mapping(address => mapping(address => uint256)) public pending;

    modifier onlyAdmin() {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Not admin");
        _;
    }

    constructor(address admin, address registryAddress) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ARBITER_ROLE, admin);
        registry = ILegalPractitionerRegistry(registryAddress);
    }

    // --- Admin controls ---
    function pause() external onlyAdmin { _pause(); }
    function unpause() external onlyAdmin { _unpause(); }
    function setArbiter(address account, bool isArbiter) external onlyAdmin {
        if (isArbiter) _grantRole(ARBITER_ROLE, account);
        else _revokeRole(ARBITER_ROLE, account);
    }

    // --- Open & fund case ---
    function openCase(
        bytes32 caseId,
        address lawyer,       // may be address(0) if not preselected
        address token,        // address(0) for AVAX
        uint256 amount,
        uint256 deadline
    ) external whenNotPaused {
        require(cases[caseId].status == Status.None, "caseId exists");
        require(amount > 0, "amount=0");

        cases[caseId] = CaseData({
            client: msg.sender,
            lawyer: lawyer,
            token: token,
            amount: amount,
            createdAt: block.timestamp,
            deadline: deadline,
            status: Status.Open
        });

        emit CaseOpened(caseId, msg.sender, lawyer, token, amount, deadline);
    }

    // Native AVAX funding
    function fundCaseNative(bytes32 caseId) external payable whenNotPaused nonReentrant {
        CaseData storage cd = cases[caseId];
        require(cd.status == Status.Open, "not open");
        require(cd.token == address(0), "token != AVAX");
        require(cd.client == msg.sender, "only client");
        require(msg.value == cd.amount, "value != amount");

        escrowed[caseId] = msg.value;
        cd.status = Status.Funded;
        emit CaseFunded(caseId, msg.sender, address(0), msg.value);
    }

    // ERC20 funding
    function fundCaseERC20(bytes32 caseId) external whenNotPaused nonReentrant {
        CaseData storage cd = cases[caseId];
        require(cd.status == Status.Open, "not open");
        require(cd.token != address(0), "token == AVAX");
        require(cd.client == msg.sender, "only client");

        IERC20(cd.token).safeTransferFrom(msg.sender, address(this), cd.amount);
        escrowed[caseId] = cd.amount;
        cd.status = Status.Funded;
        emit CaseFunded(caseId, msg.sender, cd.token, cd.amount);
    }

    // --- Accept by lawyer ---
    function acceptCase(bytes32 caseId) external whenNotPaused {
        CaseData storage cd = cases[caseId];
        require(cd.status == Status.Funded, "not funded");
        if (cd.lawyer == address(0)) {
            require(registry.isLawyer(msg.sender), "not verified lawyer");
            cd.lawyer = msg.sender;
        } else {
            require(msg.sender == cd.lawyer, "not assigned lawyer");
        }
        cd.status = Status.Accepted;
        emit CaseAccepted(caseId, cd.lawyer);
    }

    // --- Resolution / disputes ---
    function markResolved(bytes32 caseId) external whenNotPaused {
        CaseData storage cd = cases[caseId];
        require(cd.status == Status.Accepted, "not accepted");
        require(msg.sender == cd.client, "only client");
        cd.status = Status.Resolved;
        emit CaseResolved(caseId, msg.sender);
    }

    function releaseToLawyer(bytes32 caseId) external whenNotPaused nonReentrant {
        CaseData storage cd = cases[caseId];
        require(cd.status == Status.Resolved, "not resolved");
        require(msg.sender == cd.client || hasRole(ARBITER_ROLE, msg.sender), "only client/arbiter");
        uint256 amt = escrowed[caseId];
        require(amt > 0, "nothing escrowed");
        escrowed[caseId] = 0;
        cd.status = Status.Released;

        pending[cd.token][cd.lawyer] += amt;
        emit ReleasedToLawyer(caseId, amt);
    }

    function refundToClient(bytes32 caseId) external whenNotPaused nonReentrant {
        CaseData storage cd = cases[caseId];
        require(cd.status == Status.Funded || cd.status == Status.Accepted, "not refundable");
        require(msg.sender == cd.lawyer || msg.sender == cd.client || hasRole(ARBITER_ROLE, msg.sender), "not authorized");
        uint256 amt = escrowed[caseId];
        require(amt > 0, "nothing escrowed");
        escrowed[caseId] = 0;
        cd.status = Status.Refunded;

        pending[cd.token][cd.client] += amt;
        emit RefundedToClient(caseId, amt);
    }

    function raiseDispute(bytes32 caseId) external whenNotPaused {
        CaseData storage cd = cases[caseId];
        require(cd.status == Status.Accepted || cd.status == Status.Resolved, "not disputable");
        require(msg.sender == cd.client || msg.sender == cd.lawyer, "only parties");
        cd.status = Status.Disputed;
        emit DisputeRaised(caseId, msg.sender);
    }

    // Admin/arbiter split resolution (amounts add up to escrow)
    function resolveDispute(bytes32 caseId, uint256 toLawyer, uint256 toClient)
        external
        whenNotPaused
        nonReentrant
        onlyRole(ARBITER_ROLE)
    {
        CaseData storage cd = cases[caseId];
        require(cd.status == Status.Disputed, "not disputed");
        uint256 amt = escrowed[caseId];
        require(amt > 0, "nothing escrowed");
        require(toLawyer + toClient == amt, "bad split");

        escrowed[caseId] = 0;
        cd.status = Status.Released;

        if (toLawyer > 0) pending[cd.token][cd.lawyer] += toLawyer;
        if (toClient > 0) pending[cd.token][cd.client] += toClient;
        emit DisputeResolved(caseId, toLawyer, toClient);
    }

    // --- Cancellations ---
    function cancelOpenCase(bytes32 caseId) external whenNotPaused {
        CaseData storage cd = cases[caseId];
        require(cd.status == Status.Open, "not open");
        require(cd.client == msg.sender, "only client");
        cd.status = Status.Cancelled;
        // No funds to move since not funded
    }

    // --- Withdraw pattern ---
    function withdraw(address token) external nonReentrant {
        uint256 bal = pending[token][msg.sender];
        require(bal > 0, "nothing to withdraw");
        pending[token][msg.sender] = 0;

        if (token == address(0)) {
            (bool ok, ) = payable(msg.sender).call{value: bal}("");
            require(ok, "AVAX send failed");
        } else {
            IERC20(token).safeTransfer(msg.sender, bal);
        }
        emit Withdrawal(msg.sender, token, bal);
    }

    // Fallback to prevent accidental ETH sends (AVAX wrapped as native)
    receive() external payable {
        revert("Direct AVAX not accepted");
    }
}