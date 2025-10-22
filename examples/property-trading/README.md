# Private Property Trading - FHEVM Example dApp

A real-world example demonstrating the FHEVM SDK in action. This dApp enables confidential property trading using Fully Homomorphic Encryption (FHE).

## Features

- **Private Listings**: Property prices encrypted on-chain
- **Confidential Negotiations**: Buyers and sellers negotiate privately
- **Secure Ownership**: Ownership records remain confidential
- **Transaction History**: Encrypted transaction logs

## Technology Stack

- **Frontend**: React + TypeScript + Vite
- **Blockchain**: Ethereum (Sepolia Testnet)
- **Encryption**: FHEVM SDK (this repository)
- **Wallet Connection**: wagmi + ethers.js
- **Smart Contracts**: Solidity with FHE types

## Quick Start

```bash
# Install dependencies
npm install

# Set environment variables
cp .env.example .env
# Edit .env with your values

# Run development server
npm run dev
```

## Using FHEVM SDK

This example showcases SDK usage:

### 1. Initialize Client

```typescript
import { createFhevmClient } from 'fhevm-sdk';

const client = await createFhevmClient({
  network: 'sepolia',
  contractAddress: CONTRACT_ADDRESS,
});
```

### 2. Encrypt Property Price

```typescript
import { encryptInput } from 'fhevm-sdk';

const encryptedPrice = await encryptInput(client, 1000000); // 1M USD
await contract.listProperty(propertyHash, encryptedPrice.data);
```

### 3. Decrypt for Authorized Users

```typescript
import { decryptOutput } from 'fhevm-sdk';

const encryptedPrice = await contract.getPrice(propertyId);
const price = await decryptOutput(client, encryptedPrice);
console.log(`Price: ${price} USD`);
```

## Project Structure

```
property-trading/
├── src/
│   ├── config/
│   │   ├── wagmi.ts       # Wallet configuration
│   │   └── contracts.ts   # Contract addresses & ABIs
│   ├── utils/
│   │   └── contract.ts    # Contract interaction utilities
│   └── main.ts            # Application entry point
├── contracts/
│   └── PrivatePropertyTrading.sol
└── README.md
```

## Smart Contract Overview

The `PrivatePropertyTrading.sol` contract uses FHEVM's encrypted types:

```solidity
struct Property {
    uint256 id;
    address owner;
    euint64 price;      // Encrypted price
    ebool isListed;     // Encrypted listing status
}

function listProperty(euint64 _price) external {
    // Store encrypted price on-chain
}

function getPrice(uint256 _propertyId)
    external
    view
    returns (euint64)
{
    // Return encrypted price
    // Only authorized users can decrypt
}
```

## Key Learnings

This example demonstrates:

1. **Framework Integration**: How to use FHEVM SDK in a React app
2. **Encrypted State Management**: Managing encrypted data in frontend state
3. **Permission Handling**: Granting/checking decryption permissions
4. **User Experience**: Building intuitive UIs for confidential data
5. **Error Handling**: Dealing with encryption/decryption errors gracefully

## Deployment

See main repository README for deployment instructions.

## License

MIT
