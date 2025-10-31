# 🔐 FHEVM SDK - Universal Frontend SDK for Confidential Smart Contracts

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://badge.fury.io/js/fhevm-sdk.svg)](https://www.npmjs.com/package/fhevm-sdk)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue)](https://www.typescriptlang.org/)
[![Security](https://img.shields.io/badge/Security-Audited-green)](./SECURITY_PERFORMANCE_REPORT.md)

**A framework-agnostic SDK that makes building confidential frontends simple, consistent, and developer-friendly using Fully Homomorphic Encryption (FHE).**

Built for the **Zama FHEVM SDK Competition** - demonstrating practical privacy-preserving applications with enterprise-grade security and performance tooling.

🌐 **[Live Demo](https://deangelokreiger.github.io/PropertyTrading/)** | 📹 **[Video Demo demo1.mp4 demo2.mp4 ]** | 📚 **[Documentation](./docs/getting-started.md)**

---

## ✨ Features

- 🔐 **Framework Agnostic** - Works with Node.js, Next.js, Vue, React, or any frontend setup
- 🎯 **Unified API** - Single wrapper for all required packages, no scattered dependencies
- ⚡ **wagmi-like Structure** - Intuitive for web3 developers familiar with modern tooling
- 🚀 **Quick Setup** - Less than 10 lines of code to get started
- 🔄 **Complete FHEVM Flow** - Covers initialization, encryption, decryption, and contract interactions
- 📘 **TypeScript First** - Full type safety and IDE autocompletion
- 🛡️ **Enterprise Security** - Multi-layer defense with automated auditing
- ⚙️ **Gas Optimized** - Built-in gas optimization and monitoring tools

---

## 🚀 Quick Start

### Installation

```bash
npm install fhevm-sdk
# or
yarn add fhevm-sdk
# or
pnpm add fhevm-sdk
```

### Basic Usage

```typescript
import { createFhevmClient, encryptInput, decryptOutput } from 'fhevm-sdk';

// 1. Initialize client (< 10 lines)
const client = await createFhevmClient({
  network: 'sepolia',
  gatewayUrl: 'https://gateway.zama.ai',
  contractAddress: '0xD90c73b42952565F334E5FB6C349B0005ac06669',
});

// 2. Encrypt sensitive input
const encryptedValue = await encryptInput(client, 1000);

// 3. Send to contract
await contract.setPrivateValue(encryptedValue);

// 4. Decrypt output
const decrypted = await decryptOutput(client, encryptedData);
console.log(decrypted); // 1000
```

### React Hooks Example

```typescript
import { useFhevmClient, useEncrypt, useDecrypt } from 'fhevm-sdk/react';

function PrivateTransaction() {
  const { client, isReady } = useFhevmClient({
    network: 'sepolia',
    contractAddress: '0x...',
  });

  const { encrypt, isEncrypting } = useEncrypt(client);

  const handleSubmit = async (value: number) => {
    const encrypted = await encrypt(value);
    // Send to contract
  };

  return (
    <button onClick={() => handleSubmit(100)} disabled={!isReady}>
      Send Private Transaction
    </button>
  );
}
```

---

## 🏗️ Architecture

### System Design

```
┌─────────────────────────────────────────────────────────────┐
│                    FHEVM SDK Architecture                    │
└─────────────────────────────────────────────────────────────┘

Frontend Layer
├── React Hooks (useFhevmClient, useEncrypt, useDecrypt)
├── Vue Adapters (planned)
└── Framework-agnostic Core

         │
         ↓

Core SDK (packages/fhevm-sdk/)
├── core/                         # Core logic layer
│   ├── fhevm.ts                  # Client initialization
│   ├── encryption.ts             # Encryption utilities
│   └── decryption.ts             # Decryption utilities
├── hooks/                        # React hooks layer
│   └── useFhevm.ts               # React integration
├── adapters/                     # Framework adapters
│   └── react.ts                  # React adapter
├── types/                        # Type definitions
│   └── index.ts                  # TypeScript types
└── utils/                        # Utility functions
    ├── permissions.ts            # Permission management
    └── transactions.ts           # Transaction helpers

         │
         ↓

Zama FHEVM Layer
├── fhevmjs - Client-side encryption
├── Gateway SDK - Key management
└── Sepolia Testnet - Live deployment

         │
         ↓

Smart Contracts
├── Encrypted Storage (euint8, euint32, euint64, ebool)
├── Homomorphic Operations (FHE.add, FHE.eq, FHE.ge)
└── Privacy-Preserving Logic
```

### Data Flow

```
User Input → Encrypt → Smart Contract → Homomorphic Computation
                ↑                              ↓
           FHEVM SDK                    Encrypted Result
                ↑                              ↓
         Public Key                       Decrypt (with permission)
                                               ↓
                                         User sees result
```

---

## 📦 Project Structure

```
fhevm-react-template/
├── packages/
│   └── fhevm-sdk/                    # ⭐ Core SDK package
│       ├── src/
│       │   ├── core/                 # Core SDK logic
│       │   │   ├── fhevm.ts          # FHEVM client initialization
│       │   │   ├── encryption.ts     # Encryption utilities
│       │   │   ├── decryption.ts     # Decryption utilities
│       │   │   └── index.ts          # Core exports
│       │   ├── hooks/                # React hooks
│       │   │   ├── useFhevm.ts       # useFhevmClient, useEncrypt, useDecrypt
│       │   │   └── index.ts          # Hook exports
│       │   ├── adapters/             # Framework adapters
│       │   │   ├── react.ts          # React adapter
│       │   │   └── index.ts          # Adapter exports
│       │   ├── types/                # TypeScript type definitions
│       │   │   └── index.ts          # All type exports
│       │   ├── utils/                # Utility functions
│       │   │   ├── permissions.ts    # Permission management
│       │   │   └── transactions.ts   # Transaction helpers
│       │   ├── react/                # React entry point
│       │   │   └── index.ts          # React-specific exports
│       │   └── index.ts              # Main SDK exports
│       ├── package.json
│       ├── README.md
│       └── tsconfig.json
├── templates/                        # 📋 Starter templates
│   └── README.md                     # Template documentation
├── examples/
│   ├── nextjs-demo/                  # 🎯 Next.js showcase
│   │   ├── src/
│   │   │   ├── app/                  # App Router
│   │   │   │   ├── api/fhe/          # FHE API routes
│   │   │   │   ├── layout.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── components/
│   │   │   │   ├── ui/               # Button, Input, Card
│   │   │   │   ├── fhe/              # FHE components
│   │   │   │   └── examples/         # Banking, Medical examples
│   │   │   ├── lib/fhe/              # FHE utilities
│   │   │   ├── hooks/                # Custom hooks
│   │   │   └── types/                # Type definitions
│   │   └── package.json
│   └── property-trading/             # 🏡 Real-world dApp
│       ├── src/
│       │   ├── config/               # Configuration
│       │   └── utils/
│       │       └── fhevm-sdk.ts      # SDK integration
│       └── package.json
├── scripts/                          # 🔧 Automation scripts
│   ├── security/                     # Security auditing
│   │   ├── audit.sh
│   │   └── dos-check.sh
│   └── performance/                  # Performance analysis
│       ├── analyze.sh
│       └── gas-optimization.md
├── .github/workflows/                # 🔄 CI/CD pipeline
│   ├── ci.yml                        # Main CI/CD
│   └── security.yml                  # Security scanning
├── docs/                             # 📚 Documentation
│   ├── getting-started.md
│   ├── api-reference.md
│   ├── examples.md
│   └── migration.md
├── demo.mp4                          # 🎥 Video demonstration
├── package.json                      # Monorepo configuration
├── hardhat.config.ts                 # ⛓️ Smart contract config
├── .eslintrc.json                   # Code quality
├── .prettierrc.json                 # Formatting
├── .solhint.json                    # Solidity linting
├── .env.example                     # 🔑 Environment template
├── CONTRIBUTING.md
├── LICENSE
└── README.md
```

---

## 💡 Key Design Choices

### 1. Framework Agnostic Core with Modular Architecture

The SDK follows a layered architecture with clear separation of concerns:

```typescript
// Core layer - Pure TypeScript, no framework dependencies
import { createFhevmClient, encryptInput, decryptOutput } from 'fhevm-sdk';

// Works in Node.js
const client = await createFhevmClient({ network: 'sepolia' });

// React layer - Framework-specific hooks
import { useFhevmClient, useEncrypt, useDecrypt } from 'fhevm-sdk/react';

function MyComponent() {
  const { client, isReady } = useFhevmClient({ network: 'sepolia' });
  const { encrypt } = useEncrypt(client);
}

// Vue adapter (planned) - Framework-specific integration
const client = ref(await createFhevmClient({ network: 'sepolia' }));
```

**Architecture Benefits:**
- **Core Module** (`core/`) - Framework-agnostic FHE operations
- **Hooks Module** (`hooks/`) - React-specific state management
- **Adapters Module** (`adapters/`) - Framework integration layer
- **Types Module** (`types/`) - Centralized TypeScript definitions
- **Utils Module** (`utils/`) - Shared utility functions

### 2. Unified Dependency Management

```bash
# ❌ Old way (scattered dependencies)
npm install fhevmjs @zama-fhe/gateway-sdk ethers

# ✅ New way (single package)
npm install fhevm-sdk
```

### 3. wagmi-like API Design

```typescript
// Similar to wagmi's useAccount, useConnect
import { useFhevmClient, useEncrypt, useDecrypt } from 'fhevm-sdk/react';

function App() {
  const { client, isReady } = useFhevmClient();
  const { encrypt } = useEncrypt(client);
  const { decrypt } = useDecrypt(client);
}
```

### 4. Zama Official Integration

- Built on top of `fhevmjs` for encryption/decryption
- Uses official gateway SDK for key management
- Follows [Zama's security best practices](https://docs.zama.ai/fhevm)

---

## 🔧 Technical Implementation

### FHEVM Integration

```solidity
// Example: Encrypted comparison in Solidity
pragma solidity ^0.8.24;

import "@fhevm/solidity/contracts/FHE.sol";

contract PrivateCrowdfund {
    euint64 private totalRaisedEnc;
    euint64 private goalEnc;

    function checkGoalReached() public view returns (ebool) {
        // Homomorphic comparison without decryption
        return FHE.ge(totalRaisedEnc, goalEnc);
    }
}
```

### Encrypted Data Types

- `euint8`, `euint16`, `euint32`, `euint64` - Encrypted unsigned integers
- `ebool` - Encrypted boolean
- `eaddress` - Encrypted address

### FHE Operations

```typescript
// Frontend encryption
const encrypted = await encryptInput(client, 1000);

// Smart contract homomorphic operations
FHE.add(encValue1, encValue2); // Addition
FHE.eq(encValue1, encValue2); // Equality check
FHE.ge(encValue1, encValue2); // Greater or equal
FHE.select(condition, trueValue, falseValue); // Conditional
```

---

## 🌐 Live Demos & Deployment

### Live Demos

- **Property Trading dApp**: [https://deangelokreiger.github.io/PropertyTrading/](https://deangelokreiger.github.io/PropertyTrading/)
- **Next.js Demo**: Deploy your own on Vercel

### Network Information

**Network**: Sepolia Testnet (Chain ID: 11155111)
**Contract**: `0xD90c73b42952565F334E5FB6C349B0005ac06669`
**Explorer**: [Sepolia Etherscan](https://sepolia.etherscan.io/)
**Gateway**: `https://gateway.zama.ai`

### Get Test Tokens

- [Sepolia Faucet](https://sepoliafaucet.com/)
- [Alchemy Faucet](https://sepoliafaucet.com/)

---

## 🛠️ Development

### Prerequisites

- Node.js >= 18
- pnpm (recommended) or npm/yarn

### Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/fhevm-react-template.git
cd fhevm-react-template

# Install dependencies
pnpm install

# Setup environment
cp .env.example .env
# Edit .env with your configuration

# Setup git hooks
pnpm prepare

# Build the SDK
cd packages/fhevm-sdk
pnpm build

# Run examples
cd ../../examples/nextjs-demo
pnpm dev
```

### Environment Configuration

```env
# Network Configuration
NETWORK=sepolia
SEPOLIA_RPC_URL=https://rpc.sepolia.org

# FHEVM Gateway
GATEWAY_URL=https://gateway.zama.ai
GATEWAY_API_KEY=

# Contract Addresses
NEXT_PUBLIC_CONTRACT_ADDRESS=0xD90c73b42952565F334E5FB6C349B0005ac06669

# Security (NEVER commit real keys!)
PRIVATE_KEY=
PAUSER_ADDRESS=
```

See [`.env.example`](./.env.example) for complete configuration options.

---

## 🧪 Testing

### Run Tests

```bash
# Run SDK tests
cd packages/fhevm-sdk
pnpm test

# Run with coverage
pnpm test:coverage

# Run integration tests
pnpm test:integration

# Run on Sepolia testnet
pnpm test:sepolia
```

### Test Coverage

- ✅ Client initialization
- ✅ Encryption operations
- ✅ Decryption operations
- ✅ Permission management
- ✅ React hooks behavior
- ✅ Error handling
- ✅ Edge cases

See [Testing Documentation](./docs/testing.md) for details.

---

## 🔒 Security & Privacy Model

### What's Private

- **Encrypted Values** - All sensitive data encrypted with FHE
- **Computation Inputs** - Never revealed during homomorphic operations
- **Individual Amounts** - Each user's data stays confidential
- **Intermediate Results** - Computed on encrypted data

### What's Public

- **Transaction Metadata** - Blockchain requirement (sender, timestamp)
- **Contract Address** - Public smart contract location
- **Encrypted Data Hashes** - Ciphertext is visible (but unreadable)
- **Event Logs** - Contract events (without sensitive data)

### Decryption Permissions

- **Users** - Can decrypt their own data with proper signatures
- **Contract Owner** - Administrative access where authorized
- **Oracle** - Can decrypt specific results when granted permission

### Security Features

- 🛡️ **Multi-layer Defense** - ESLint security plugin, pre-commit hooks, CI/CD scanning
- 🔍 **Automated Auditing** - Dependency scanning, secret detection, DoS checks
- 🔐 **Input Validation** - Type-safe validation for all inputs
- ⚠️ **Rate Limiting** - DoS protection recommendations
- 📊 **Security Monitoring** - Continuous vulnerability scanning

See [Security Report](./SECURITY_PERFORMANCE_REPORT.md) for comprehensive details.

---

## ⚡ Performance Optimization

### Gas Optimization

```solidity
// ✅ Good - Custom errors (saves ~1000 gas)
error InsufficientBalance(uint256 available, uint256 required);

// ❌ Bad - String error messages
require(balance >= amount, "Insufficient balance");
```

### Compiler Settings

```typescript
// hardhat.config.ts
{
  optimizer: {
    enabled: true,
    runs: 200, // Balance deployment vs runtime
  },
  viaIR: true, // IR-based optimization
}
```

### Bundle Optimization

- ✅ Tree-shaking enabled
- ✅ Code splitting by route
- ✅ Dynamic imports for heavy components
- ✅ Compression (gzip/brotli)

### Performance Tools

```bash
# Analyze bundle sizes
pnpm perf:analyze

# Generate gas report
pnpm gas:report

# Check bundle sizes
pnpm size
```

See [Gas Optimization Guide](./scripts/performance/gas-optimization.md) for detailed strategies.

---

## 📋 Usage Examples

### Example 1: Basic Node.js Script

```typescript
import { createFhevmClient, encryptInput } from 'fhevm-sdk';

async function main() {
  const client = await createFhevmClient({
    network: 'sepolia',
    gatewayUrl: process.env.GATEWAY_URL,
    contractAddress: process.env.CONTRACT_ADDRESS,
  });

  const encrypted = await encryptInput(client, 42);
  console.log('Encrypted:', encrypted);
}

main();
```

### Example 2: React Component

```typescript
import { useFhevmClient, useEncrypt } from 'fhevm-sdk/react';

function PrivateTransaction() {
  const { client, isReady } = useFhevmClient();
  const { encrypt, isEncrypting } = useEncrypt(client);

  const handleSubmit = async (value: number) => {
    const encrypted = await encrypt(value);
    // Send to contract
  };

  return <button onClick={() => handleSubmit(100)}>Send Private Transaction</button>;
}
```

### Example 3: Property Trading dApp

See [`examples/property-trading/`](./examples/property-trading/) for a complete real-world application demonstrating:

- 🏡 Private property listings
- 💰 Encrypted price negotiations
- 🔐 Confidential ownership records
- 📊 Secure transaction history

---

## 🛠️ Code Quality & Tooling

### Complete Tool Stack

```
ESLint + Security Plugin → Code quality + vulnerability detection
         ↓
Prettier → Consistent formatting
         ↓
Solhint + Hardhat → Solidity linting + gas optimization
         ↓
Pre-commit Hooks (Husky) → Automated validation
         ↓
CI/CD Pipeline → Security scanning + performance tests
         ↓
DoS Protection → Automated vulnerability checks
```

### Available Scripts

```bash
# Code Quality
pnpm lint              # Run ESLint
pnpm lint:fix          # Auto-fix issues
pnpm format            # Format with Prettier
pnpm typecheck         # TypeScript checking
pnpm validate          # All checks

# Security
pnpm security:audit        # Full security audit
pnpm security:dos-check    # DoS vulnerability check
pnpm security:scan         # Dependency scanning

# Performance
pnpm perf:analyze      # Performance analysis
pnpm gas:report        # Gas usage report

# Solidity
pnpm solhint           # Lint Solidity files
pnpm solhint:fix       # Auto-fix Solidity issues
```

See [TOOLCHAIN.md](./TOOLCHAIN.md) and [QUICK_START_SECURITY.md](./QUICK_START_SECURITY.md) for complete documentation.

---

## 🏆 Competition Evaluation Criteria

### ✅ Usability

- **Installation**: Single `npm install fhevm-sdk` command
- **Setup**: < 10 lines of code to start
- **Minimal Boilerplate**: Smart defaults, optional configuration
- **Documentation**: Comprehensive guides and examples

### ✅ Completeness

- ✓ Client initialization
- ✓ Input encryption
- ✓ Output decryption
- ✓ Contract interactions
- ✓ Error handling
- ✓ Type safety
- ✓ Security auditing
- ✓ Performance optimization

### ✅ Reusability

- Modular components for different use cases
- Framework-specific adapters (React, Vue, Node.js)
- Clean separation of concerns
- Extensible architecture

### ✅ Documentation

- Comprehensive README with examples
- API reference with type definitions
- Integration guides for multiple frameworks
- Real-world use case documentation
- Security and performance guides

### ✅ Creativity

- Property Trading dApp showcasing FHE potential
- Multi-framework support (React, Vue, Node.js)
- Developer-friendly abstractions (wagmi-like API)
- Enterprise-grade tooling integration

---

## 🚢 Deployment Guide

### Deploy Smart Contracts

```bash
# Deploy to Sepolia
npx hardhat run scripts/deploy.ts --network sepolia

# Verify on Etherscan
npx hardhat verify --network sepolia CONTRACT_ADDRESS
```

### Deploy Frontend

#### Vercel (Next.js)

```bash
cd examples/nextjs-demo
vercel deploy
```

#### Netlify

```bash
cd examples/property-trading
netlify deploy --prod
```

#### GitHub Pages

```bash
npm run build
npm run deploy
```

---

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

### Development Workflow

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run `pnpm validate` to check quality
5. Submit a pull request

### Pre-commit Checks

All commits automatically run:

- ✓ Prettier formatting
- ✓ ESLint validation
- ✓ TypeScript type checking
- ✓ Security audit

---

## 🗺️ Roadmap

### Current (v2.0)

- ✅ Framework-agnostic core SDK
- ✅ React hooks integration
- ✅ Next.js template
- ✅ Property Trading dApp
- ✅ Security & performance tooling

### Planned

- 🔜 Vue.js adapter
- 🔜 Svelte adapter
- 🔜 Angular adapter
- 🔜 CLI scaffolding tool
- 🔜 Additional use case templates
- 🔜 Mainnet deployment support

---

## 🔗 Links & Resources

### Official Documentation

- [Zama FHEVM Documentation](https://docs.zama.ai/fhevm)
- [fhevmjs Library](https://github.com/zama-ai/fhevmjs)
- [Gateway SDK](https://github.com/zama-ai/fhevm-gateway-sdk)

### Project Resources

- [API Reference](./docs/api-reference.md)
- [Getting Started Guide](./docs/getting-started.md)
- [Examples & Use Cases](./docs/examples.md)
- [Migration Guide](./docs/migration.md)
- [Toolchain Documentation](./TOOLCHAIN.md)
- [Security Report](./SECURITY_PERFORMANCE_REPORT.md)

### Community

- [GitHub Issues](https://github.com/yourusername/fhevm-react-template/issues)
- [Discussions](https://github.com/yourusername/fhevm-react-template/discussions)

---

## 🙏 Acknowledgments

Built for the **Zama FHEVM SDK Competition**. Special thanks to:

- **Zama team** for pioneering FHE technology and providing excellent documentation
- **Community feedback** from GitHub issues and discussions
- **Original fhevm-react-template contributors** for the foundation

This project demonstrates the practical application of Fully Homomorphic Encryption in real-world scenarios, making privacy-preserving computations accessible to developers.

---

## 📄 License

MIT License - see [LICENSE](./LICENSE) file for details.

---

## 🎥 Video Demonstration

A comprehensive video walkthrough is available at [`demo.mp4`](./demo.mp4), covering:

- 🔧 SDK installation and setup
- 🎯 Integration with different frameworks
- 🏡 Real-world use case (private property trading)
- 🏗️ Design choices and architecture
- ⚡ Performance and security features

---

## 📊 Tech Stack

### Smart Contracts

- **Solidity** `^0.8.24`
- **Hardhat** `^2.20.0` - Development environment
- **fhevmjs** `^0.6.0` - FHE operations
- **Zama FHEVM** - Encrypted computation layer

### Frontend

- **Next.js** `^14.2.0` - React framework
- **React** `^18.3.0` - UI library
- **TypeScript** `^5.5.0` - Type safety
- **Vite** `^7.1.7` - Build tool (property trading)
- **wagmi** `^2.0.0` - Web3 integration
- **ethers** `^6.13.0` - Ethereum library

### Development Tools

- **ESLint** + Security Plugin - Code quality
- **Prettier** - Code formatting
- **Solhint** - Solidity linting
- **Husky** - Git hooks
- **GitHub Actions** - CI/CD
- **Hardhat Gas Reporter** - Gas optimization

### Testing

- **Mocha** - Test framework
- **Chai** - Assertions
- **Hardhat Network** - Local testing

---

## 💬 Troubleshooting

### Common Issues

**Installation fails:**

```bash
# Clear cache and reinstall
pnpm clean
rm -rf node_modules
pnpm install
```

**Pre-commit hooks not working:**

```bash
# Reinstall hooks
pnpm prepare
```

**Type errors:**

```bash
# Run type checking
pnpm typecheck
```

**Build fails:**

```bash
# Check for errors
pnpm validate
pnpm build
```

See [Troubleshooting Guide](./docs/troubleshooting.md) for more solutions.

---

**Made with ❤️ for confidential computing and privacy-preserving applications**

**Powered by Zama FHEVM** 🔐
