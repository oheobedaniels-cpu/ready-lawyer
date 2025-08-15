// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts@4.9.6/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts@4.9.6/security/Pausable.sol";
import "@openzeppelin/contracts@4.9.6/access/AccessControl.sol";
import "@openzeppelin/contracts@4.9.6/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts@4.9.6/token/ERC20/utils/SafeERC20.sol";

import "./../interfaces/ILegalPractitionerRegistry.sol";
import "./../interfaces/IReadyFund.sol";

contract ReadyFund is IReadyFund, AccessControl, Pausable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");

    ILegalPractitionerRegistry public immutable registry;

    struct Campaign {
        address creator;
        address beneficiary;
        address token;          // address(0) = AVAX
        uint256 goal;
        uint256 deadline;       // unix timestamp
        uint256 raised;
        Status status;
        bool beneficiaryIsLawyer;
    }

    mapping(bytes32 => Campaign) private _c;
    mapping(bytes32 => mapping(address => uint256)) private _contrib;
    // token => user => balance (pull payments)
    mapping(address => mapping(address => uint256)) public pending;

    modifier onlyAdmin() {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Not admin");
        _;
    }

    constructor(address admin, address registryAddress) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(OPERATOR_ROLE, admin);
        registry = ILegalPractitionerRegistry(registryAddress);
    }

    // ========== Admin ==========
    function pause() external onlyAdmin { _pause(); }
    function unpause() external onlyAdmin { _unpause(); }
    function setOperator(address account, bool ok) external onlyAdmin {
        if (ok) _grantRole(OPERATOR_ROLE, account);
        else _revokeRole(OPERATOR_ROLE, account);
    }

    // ========== Create ==========
    function createCampaign(
        bytes32 id,
        address beneficiary,
        bool beneficiaryIsLawyer,
        address token,      // address(0) for AVAX
        uint256 goalAmount,
        uint256 deadline
    ) external whenNotPaused {
        require(_c[id].status == Status.None, "id exists");
        require(goalAmount > 0, "goal=0");
        require(deadline > block.timestamp, "deadline in past");

        if (beneficiaryIsLawyer) {
            require(registry.isLawyer(beneficiary), "beneficiary not lawyer");
        }

        _c[id] = Campaign({
            creator: msg.sender,
            beneficiary: beneficiary,
            token: token,
            goal: goalAmount,
            deadline: deadline,
            raised: 0,
            status: Status.Active,
            beneficiaryIsLawyer: beneficiaryIsLawyer
        });

        emit CampaignCreated(id, msg.sender, beneficiary, token, goalAmount, deadline, beneficiaryIsLawyer);
    }

    // ========== Contribute ==========
    function contributeNative(bytes32 id) external payable whenNotPaused nonReentrant {
        Campaign storage cp = _c[id];
        require(cp.status == Status.Active, "not active");
        require(cp.token == address(0), "token != AVAX");
        require(block.timestamp < cp.deadline, "deadline passed");
        require(msg.value > 0, "zero");

        cp.raised += msg.value;
        _contrib[id][msg.sender] += msg.value;
        emit Contributed(id, msg.sender, msg.value);
    }

    function contributeERC20(bytes32 id, uint256 amount) external whenNotPaused nonReentrant {
        Campaign storage cp = _c[id];
        require(cp.status == Status.Active, "not active");
        require(cp.token != address(0), "token == AVAX");
        require(block.timestamp < cp.deadline, "deadline passed");
        require(amount > 0, "zero");

        IERC20(cp.token).safeTransferFrom(msg.sender, address(this), amount);
        cp.raised += amount;
        _contrib[id][msg.sender] += amount;
        emit Contributed(id, msg.sender, amount);
    }

    // ========== Cancel / Finalize ==========
    function cancel(bytes32 id) external whenNotPaused {
        Campaign storage cp = _c[id];
        require(cp.status == Status.Active, "not active");
        require(cp.creator == msg.sender, "only creator");
        require(cp.raised == 0, "already funded");
        cp.status = Status.Cancelled;
        emit Cancelled(id);
    }

    // Anyone can finalize after deadline OR early-success if goal reached
    function finalize(bytes32 id) external whenNotPaused nonReentrant {
        Campaign storage cp = _c[id];
        require(cp.status == Status.Active, "not active");

        bool deadlinePassed = block.timestamp >= cp.deadline;
        bool goalReached = cp.raised >= cp.goal;

        require(deadlinePassed || goalReached, "too early");

        if (goalReached) {
            cp.status = Status.PayoutReady;
            pending[cp.token][cp.beneficiary] += cp.raised;
            emit PayoutQueued(id, cp.beneficiary, cp.raised);
            emit Finalized(id, true);
        } else {
            cp.status = Status.Refunding;
            emit Finalized(id, false);
            // contributors pull their refunds individually; no bulk loop here
        }
    }

    // ========== Refunds ==========
    function claimRefund(bytes32 id) external whenNotPaused nonReentrant {
        Campaign storage cp = _c[id];
        require(cp.status == Status.Refunding || cp.status == Status.Cancelled || cp.status == Status.Failed, "refunds closed");
        uint256 amt = _contrib[id][msg.sender];
        require(amt > 0, "nothing");
        _contrib[id][msg.sender] = 0;

        pending[cp.token][msg.sender] += amt;
        emit RefundClaimed(id, msg.sender, amt);
    }

    // ========== Views ==========
    function getStatus(bytes32 id) external view override returns (Status) { return _c[id].status; }
    function raised(bytes32 id) external view override returns (uint256) { return _c[id].raised; }
    function goal(bytes32 id) external view override returns (uint256) { return _c[id].goal; }
    function tokenOf(bytes32 id) external view override returns (address) { return _c[id].token; }
    function beneficiaryOf(bytes32 id) external view override returns (address) { return _c[id].beneficiary; }
    function contributionOf(bytes32 id, address u) external view override returns (uint256) { return _contrib[id][u]; }

    // ========== Withdraw pattern ==========
    function withdraw(address token) external nonReentrant {
        uint256 bal = pending[token][msg.sender];
        require(bal > 0, "nothing");
        pending[token][msg.sender] = 0;

        if (token == address(0)) {
            (bool ok, ) = payable(msg.sender).call{value: bal}("");
            require(ok, "AVAX send failed");
        } else {
            IERC20(token).safeTransfer(msg.sender, bal);
        }
        emit Withdrawal(msg.sender, token, bal);
    }

    // Safety: block accidental sends
    receive() external payable { revert("Direct AVAX not accepted"); }
}
