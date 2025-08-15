# Developer Quick Reference Guide

## Contract Addresses
- **Main Contract**: `0x7113C79e62FC58886325314dF173d6A55fC85902`
- **ReadyRoles**: Not deployed yet
- **ReadyDocs**: Not deployed yet  
- **ReadyEscrow**: Not deployed yet
- **ReadyFund**: Not deployed yet
- **ReadyListings**: Not deployed yet

## ReadyRoles Contract

### Key Functions
```solidity
// Request lawyer verification
function requestLawyerVerification(string calldata profileURI) external

// Approve lawyer (VERIFIER_ROLE only)
function approveLawyer(address account, string calldata profileURI) external

// Check lawyer status
function isLawyer(address account) external view returns (bool)

// Check judge status  
function isJudge(address account) external view returns (bool)
```

### Events
```solidity
event LawyerVerificationRequested(address indexed account, string profileURI);
event LawyerApproved(address indexed account, string profileURI);
event LawyerRevoked(address indexed account);
event JudgeSet(address indexed account, string profileURI, bool approved);
```

### Usage Example
```javascript
// Check if address is verified lawyer
const isLawyer = await readyRoles.isLawyer(lawyerAddress);

// Request verification
await readyRoles.requestLawyerVerification("ipfs://QmProfileHash");
```

## ReadyDocs Contract

### Key Functions
```solidity
// Create new document
function createDocument(
    bytes32 docId, 
    DocType docType, 
    string calldata caseId, 
    string calldata initialCid
) external

// Add new version
function addVersion(bytes32 docId, string calldata cid) external

// Get document type
function docTypeOf(bytes32 docId) external view returns (DocType)

// Get version count
function versionCount(bytes32 docId) external view returns (uint256)
```

### Document Types
```solidity
enum DocType { 
    Other,      // 0
    Pleading,   // 1  
    Judgment,   // 2
    Contract,   // 3
    Evidence    // 4
}
```

### Events
```solidity
event DocCreated(bytes32 indexed docId, DocType docType, string caseId, address indexed author);
event VersionAdded(bytes32 indexed docId, uint256 versionIndex, string cid, address indexed author);
event VersionRevoked(bytes32 indexed docId, uint256 versionIndex, address indexed by);
```

### Usage Example
```javascript
// Create judgment document
const docId = ethers.utils.id("CASE_001_JUDGMENT");
await readyDocs.createDocument(
    docId,
    2, // Judgment
    "CASE_001",
    "ipfs://QmJudgmentHash"
);

// Add new version
await readyDocs.addVersion(docId, "ipfs://QmUpdatedJudgmentHash");
```

## ReadyEscrow Contract

### Key Functions
```solidity
// Open new case
function openCase(
    bytes32 caseId,
    address lawyer,
    address token,
    uint256 amount,
    uint256 deadline
) external

// Fund case with AVAX
function fundCaseNative(bytes32 caseId) external payable

// Fund case with ERC20
function fundCaseERC20(bytes32 caseId) external

// Accept case (lawyer only)
function acceptCase(bytes32 caseId) external

// Mark case resolved
function markResolved(bytes32 caseId) external
```

### Case Status
```solidity
enum Status { 
    None,       // 0
    Open,       // 1
    Funded,     // 2
    Accepted,   // 3
    Resolved,   // 4
    Disputed,   // 5
    Released,   // 6
    Refunded,   // 7
    Cancelled   // 8
}
```

### Events
```solidity
event CaseOpened(bytes32 indexed caseId, address indexed client, address indexed lawyer, address token, uint256 amount, uint256 deadline);
event CaseFunded(bytes32 indexed caseId, address indexed client, address token, uint256 amount);
event CaseAccepted(bytes32 indexed caseId, address indexed lawyer);
event CaseResolved(bytes32 indexed caseId, address indexed client);
```

### Usage Example
```javascript
// Open case
const caseId = ethers.utils.id("CASE_001");
await readyEscrow.openCase(
    caseId,
    lawyerAddress,
    ethers.constants.AddressZero, // AVAX
    ethers.utils.parseEther("1.0"),
    Math.floor(Date.now() / 1000) + 86400 // 24 hours
);

// Fund case
await readyEscrow.fundCaseNative(caseId, { 
    value: ethers.utils.parseEther("1.0") 
});
```

## ReadyFund Contract

### Key Functions
```solidity
// Create campaign
function createCampaign(
    bytes32 id,
    address beneficiary,
    bool beneficiaryIsLawyer,
    address token,
    uint256 goalAmount,
    uint256 deadline
) external

// Contribute AVAX
function contributeNative(bytes32 id) external payable

// Contribute ERC20
function contributeERC20(bytes32 id, uint256 amount) external

// Finalize campaign
function finalize(bytes32 id) external

// Claim refund
function claimRefund(bytes32 id) external
```

### Campaign Status
```solidity
enum Status { 
    None,         // 0
    Active,       // 1
    Succeeded,    // 2
    Failed,       // 3
    Cancelled,    // 4
    PayoutReady,  // 5
    Refunding     // 6
}
```

### Events
```solidity
event CampaignCreated(bytes32 indexed id, address indexed creator, address indexed beneficiary, address token, uint256 goal, uint256 deadline, bool beneficiaryIsLawyer);
event Contributed(bytes32 indexed id, address indexed contributor, uint256 amount);
event Finalized(bytes32 indexed id, bool succeeded);
event PayoutQueued(bytes32 indexed id, address indexed beneficiary, uint256 amount);
```

### Usage Example
```javascript
// Create campaign
const campaignId = ethers.utils.id("CAMPAIGN_001");
await readyFund.createCampaign(
    campaignId,
    lawyerAddress,
    true, // beneficiary is lawyer
    ethers.constants.AddressZero, // AVAX
    ethers.utils.parseEther("10.0"),
    Math.floor(Date.now() / 1000) + 604800 // 7 days
);

// Contribute
await readyFund.contributeNative(campaignId, { 
    value: ethers.utils.parseEther("2.0") 
});
```

## ReadyListings Contract

### Key Functions
```solidity
// Create/update lawyer listing
function upsertLawyerListing(
    string calldata profileURI,
    uint256 hourlyRate,
    string[] calldata tags
) external

// Remove lawyer listing
function removeLawyerListing() external

// Create case signal
function createCaseSignal(
    bytes32 signalId,
    string calldata caseURI,
    uint256 budgetMin,
    uint256 budgetMax,
    string[] calldata tags
) external

// Check if lawyer has listing
function hasLawyerListing(address lawyer) external view returns (bool)
```

### Events
```solidity
event LawyerListingUpserted(address indexed lawyer, string profileURI, uint256 hourlyRate, string[] tags);
event LawyerListingRemoved(address indexed lawyer);
event CaseSignalCreated(bytes32 indexed signalId, address indexed client, string caseURI, uint256 budgetMin, uint256 budgetMax, string[] tags);
event CaseSignalClosed(bytes32 indexed signalId);
```

### Usage Example
```javascript
// Create lawyer listing
await readyListings.upsertLawyerListing(
    "ipfs://QmLawyerProfile",
    ethers.utils.parseEther("0.001"), // 0.001 AVAX per hour
    ["Criminal", "Family Law", "Contract"]
);

// Create case signal
const signalId = ethers.utils.id("SIGNAL_001");
await readyListings.createCaseSignal(
    signalId,
    "ipfs://QmCaseDetails",
    ethers.utils.parseEther("1.0"),
    ethers.utils.parseEther("5.0"),
    ["Criminal", "Urgent"]
);
```

## Common Patterns

### Role Checking
```javascript
// Check if user has admin role
const hasAdminRole = await contract.hasRole(
    await contract.DEFAULT_ADMIN_ROLE(),
    userAddress
);

// Check if user has operator role
const hasOperatorRole = await contract.hasRole(
    await contract.OPERATOR_ROLE(),
    userAddress
);
```

### Event Filtering
```javascript
// Filter events by case ID
const filter = contract.filters.CaseOpened(caseId);
const events = await contract.queryFilter(filter);

// Filter events by user address
const userFilter = contract.filters.CaseOpened(null, userAddress);
const userEvents = await contract.queryFilter(userFilter);
```

### Error Handling
```javascript
try {
    await contract.someFunction();
} catch (error) {
    if (error.message.includes("Not admin")) {
        console.log("User doesn't have admin role");
    } else if (error.message.includes("whenNotPaused")) {
        console.log("Contract is paused");
    }
}
```

## Gas Optimization Tips

1. **Use View Functions**: Query data without gas costs
2. **Batch Operations**: Group multiple operations
3. **Event Indexing**: Use events for historical data
4. **Storage Packing**: Optimize storage slot usage
5. **Avoid Loops**: Use mappings instead of arrays where possible

## Testing Checklist

- [ ] Role-based access control
- [ ] Pausable functionality
- [ ] Reentrancy protection
- [ ] Input validation
- [ ] Event emissions
- [ ] Error handling
- [ ] Gas optimization
- [ ] Edge cases
- [ ] Integration testing
