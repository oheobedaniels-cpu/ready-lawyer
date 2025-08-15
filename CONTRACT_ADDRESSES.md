# Contract Address Registry

## Deployed Contract Addresses

### Main Contract
- **Contract**: `0x7113C79e62FC58886325314dF173d6A55fC85902`
- **Network**: Avalanche C-Chain
- **Status**: Deployed
- **Notes**: Primary contract address provided by user

### Contract Deployment Status

| Contract Name | Status | Address | Network | Notes |
|---------------|--------|---------|---------|-------|
| ReadyRoles | 🔄 Ready to Deploy | - | Avalanche C-Chain | Practitioner verification system |
| ReadyDocs | 🔄 Ready to Deploy | - | Avalanche C-Chain | Document management system |
| ReadyEscrow | 🔄 Ready to Deploy | - | Avalanche C-Chain | Escrow service |
| ReadyFund | 🔄 Ready to Deploy | - | Avalanche C-Chain | Crowdfunding platform |
| ReadyListings | 🔄 Ready to Deploy | - | Avalanche C-Chain | Lawyer marketplace |

## Deployment Information

### Network Details
- **Network**: Avalanche C-Chain
- **Chain ID**: 43114 (Mainnet) / 43113 (Testnet)
- **Currency**: AVAX
- **Gas Token**: AVAX

### Deployment Scripts Available
- `scripts/deploy_with_ethers.ts` - Ethers.js deployment
- `scripts/deploy_with_web3.ts` - Web3.js deployment
- `scripts/ethers-lib.ts` - Ethers.js utilities
- `scripts/web3-lib.ts` - Web3.js utilities

### Constructor Parameters Required

#### ReadyRoles
```solidity
constructor(address admin)
```

#### ReadyDocs
```solidity
constructor(address admin, address registryAddress)
```

#### ReadyEscrow
```solidity
constructor(address admin, address registryAddress)
```

#### ReadyFund
```solidity
constructor(address admin, address registryAddress)
```

#### ReadyListings
```solidity
constructor(address admin, address registryAddress)
```

## Contract Dependencies

### Deployment Order
1. **ReadyRoles** - Deploy first (no dependencies)
2. **ReadyDocs** - Depends on ReadyRoles address
3. **ReadyEscrow** - Depends on ReadyRoles address
4. **ReadyFund** - Depends on ReadyRoles address
5. **ReadyListings** - Depends on ReadyRoles address

### Registry Address
All contracts except ReadyRoles require the ReadyRoles contract address as the `registryAddress` parameter.

## Verification Status

| Contract | Explorer Verification | Status |
|----------|----------------------|--------|
| Main Contract | 🔄 Pending | Address: `0x7113C79e62FC58886325314dF173d6A55fC85902` |
| ReadyRoles | ❌ Not Deployed | - |
| ReadyDocs | ❌ Not Deployed | - |
| ReadyEscrow | ❌ Not Deployed | - |
| ReadyFund | ❌ Not Deployed | - |
| ReadyListings | ❌ Not Deployed | - |

## Next Deployment Steps

1. **Deploy ReadyRoles** with admin address
2. **Deploy other contracts** using ReadyRoles address as registry
3. **Verify contracts** on Avalanche Explorer
4. **Update this registry** with new addresses
5. **Test contract interactions** on testnet first

## Notes
- All contracts are compiled and ready for deployment
- Artifacts available in `artifacts/` directory
- Use provided deployment scripts for consistent deployment
- Consider testing on Fuji testnet before mainnet deployment
