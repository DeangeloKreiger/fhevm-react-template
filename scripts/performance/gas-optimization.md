# Gas Optimization Guide

## Overview
This guide provides gas optimization strategies for FHEVM smart contracts and frontend applications.

## Smart Contract Gas Optimization

### 1. Storage Optimization
```solidity
// ❌ Bad - Multiple SSTORE operations
function updateUser(address user, uint256 value1, uint256 value2) external {
    users[user].value1 = value1;
    users[user].value2 = value2;
}

// ✅ Good - Single SSTORE operation
function updateUser(address user, uint256 value1, uint256 value2) external {
    User storage userData = users[user];
    userData.value1 = value1;
    userData.value2 = value2;
}
```

### 2. Use Events Instead of Storage
```solidity
// ❌ Bad - Store in state
mapping(uint256 => string) public logs;

// ✅ Good - Emit events
event Log(uint256 indexed id, string message);
```

### 3. Batch Operations
```solidity
// ❌ Bad - Multiple transactions
function transferMultiple(address[] calldata recipients, uint256 amount) external {
    for (uint i = 0; i < recipients.length; i++) {
        transfer(recipients[i], amount);
    }
}

// ✅ Good - Single transaction with batch
function batchTransfer(address[] calldata recipients, uint256[] calldata amounts) external {
    require(recipients.length == amounts.length, "Length mismatch");
    for (uint i = 0; i < recipients.length; i++) {
        _transfer(msg.sender, recipients[i], amounts[i]);
    }
}
```

### 4. Use Custom Errors
```solidity
// ❌ Bad - String error messages
require(balance >= amount, "Insufficient balance");

// ✅ Good - Custom errors
error InsufficientBalance(uint256 available, uint256 required);

if (balance < amount) {
    revert InsufficientBalance(balance, amount);
}
```

### 5. Optimize Loops
```solidity
// ❌ Bad - Read length every iteration
for (uint i = 0; i < array.length; i++) {
    // ...
}

// ✅ Good - Cache length
uint256 len = array.length;
for (uint i = 0; i < len; i++) {
    // ...
}
```

## Frontend Gas Optimization

### 1. Transaction Batching
```typescript
// ❌ Bad - Multiple transactions
for (const item of items) {
  await contract.processItem(item);
}

// ✅ Good - Batch transaction
await contract.processItems(items);
```

### 2. Estimate Gas Before Sending
```typescript
// ✅ Good - Estimate gas first
const gasEstimate = await contract.estimateGas.transfer(to, amount);
const gasLimit = gasEstimate.mul(120).div(100); // 20% buffer

await contract.transfer(to, amount, { gasLimit });
```

### 3. Use Multicall
```typescript
import { Contract } from 'ethers';

// ✅ Good - Use Multicall for multiple reads
const multicall = new Contract(MULTICALL_ADDRESS, MULTICALL_ABI, provider);
const calls = [
  { target: contract.address, callData: contract.interface.encodeFunctionData('balanceOf', [user1]) },
  { target: contract.address, callData: contract.interface.encodeFunctionData('balanceOf', [user2]) },
];

const results = await multicall.aggregate(calls);
```

### 4. Optimize FHE Operations
```typescript
// ❌ Bad - Encrypt each value separately
const enc1 = await encryptInput(client, value1);
const enc2 = await encryptInput(client, value2);
const enc3 = await encryptInput(client, value3);

// ✅ Good - Batch encryption
const encrypted = await Promise.all([
  encryptInput(client, value1),
  encryptInput(client, value2),
  encryptInput(client, value3),
]);
```

## Gas Monitoring

### 1. Use Gas Reporter
```bash
# Enable gas reporting
REPORT_GAS=true pnpm hardhat test
```

### 2. Set Gas Price Alerts
```typescript
// Monitor gas prices
const gasPrice = await provider.getGasPrice();
const gasPriceGwei = ethers.utils.formatUnits(gasPrice, 'gwei');

if (parseFloat(gasPriceGwei) > MAX_GAS_PRICE_GWEI) {
  console.warn('Gas price too high:', gasPriceGwei);
  // Wait or notify user
}
```

### 3. Track Transaction Costs
```typescript
const tx = await contract.transfer(to, amount);
const receipt = await tx.wait();

console.log('Gas used:', receipt.gasUsed.toString());
console.log('Effective gas price:', receipt.effectiveGasPrice.toString());
console.log('Total cost:', receipt.gasUsed.mul(receipt.effectiveGasPrice).toString());
```

## Compiler Optimization

### Hardhat Configuration
```typescript
// hardhat.config.ts
export default {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200, // Lower for deployment, higher for runtime
      },
      viaIR: true, // Enable IR-based optimization
    },
  },
};
```

## Best Practices

1. **Measure First**: Always measure gas usage before optimizing
2. **Profile**: Use gas reporters to identify expensive operations
3. **Test**: Ensure optimizations don't break functionality
4. **Document**: Comment why optimizations were made
5. **Monitor**: Track gas usage in production

## Tools

- **hardhat-gas-reporter**: Gas usage reporting
- **eth-gas-reporter**: Detailed gas analysis
- **Tenderly**: Transaction simulation and debugging
- **Blocknative**: Gas price prediction

## Resources

- [Solidity Gas Optimization Tips](https://github.com/iskdrews/awesome-solidity-gas-optimization)
- [EVM Codes](https://www.evm.codes/)
- [Gas Optimization Checklist](https://www.alchemy.com/overviews/solidity-gas-optimization)
