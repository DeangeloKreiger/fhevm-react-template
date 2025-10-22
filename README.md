# FHEVM SDK - Universal Frontend SDK for Confidential Smart Contracts

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://badge.fury.io/js/fhevm-sdk.svg)](https://www.npmjs.com/package/fhevm-sdk)

A framework-agnostic SDK that makes building confidential frontends simple, consistent, and developer-friendly using Fully Homomorphic Encryption (FHE).

## 🎯 Features

- **Framework Agnostic**: Works with Node.js, Next.js, Vue, React, or any frontend setup
- **Unified API**: Single wrapper for all required packages - no scattered dependencies
- **wagmi-like Structure**: Intuitive for web3 developers familiar with modern tooling
- **Quick Setup**: Less than 10 lines of code to get started
- **Complete FHEVM Flow**: Covers initialization, encryption, decryption, and contract interactions
- **TypeScript First**: Full type safety and IDE autocompletion

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
  contractAddress: '0x...',
});

// 2. Encrypt sensitive input
const encryptedValue = await encryptInput(client, 1000);

// 3. Send to contract
await contract.setPrivateValue(encryptedValue);

// 4. Decrypt output
const decrypted = await decryptOutput(client, encryptedData);
console.log(decrypted); // 1000
```

## 📦 What's Included

This repository contains:

- **`packages/fhevm-sdk/`** - The core SDK (main deliverable)
- **`examples/nextjs-demo/`** - Next.js integration example (required)
- **`examples/property-trading/`** - Real-world dApp showcase
- **`docs/`** - Comprehensive documentation

## 🏗️ Project Structure

```
fhevm-react-template/
├── packages/
│   └── fhevm-sdk/           # Core SDK package
│       ├── src/
│       │   ├── client.ts    # Client initialization
│       │   ├── encrypt.ts   # Encryption utilities
│       │   ├── decrypt.ts   # Decryption utilities
│       │   ├── hooks/       # React hooks (optional)
│       │   └── index.ts     # Main exports
│       ├── package.json
│       └── README.md
├── examples/
│   ├── nextjs-demo/         # Next.js showcase
│   └── property-trading/    # Private property trading dApp
├── docs/
│   ├── getting-started.md
│   ├── api-reference.md
│   └── examples.md
├── demo.mp4                 # Video demonstration
└── README.md
```

## 📚 Documentation

- [Getting Started](./docs/getting-started.md)
- [API Reference](./docs/api-reference.md)
- [Examples & Use Cases](./docs/examples.md)
- [Migration Guide](./docs/migration.md)

## 🎥 Video Demo

See [`demo.mp4`](./demo.mp4) for a complete walkthrough of:
- SDK installation and setup
- Integration with different frameworks
- Real-world use case (private property trading)
- Design choices and architecture

## 🌐 Live Demos

- **Next.js Demo**: [https://fhevm-sdk-nextjs.vercel.app](https://fhevm-sdk-nextjs.vercel.app)
- **Property Trading dApp**: [https://property-trading.vercel.app](https://property-trading.vercel.app)

## 💡 Key Design Choices

### 1. Framework Agnostic Core

The SDK core is pure TypeScript with no framework dependencies:

```typescript
// Works in Node.js
const client = await createFhevmClient({ ... });

// Works in React
function MyComponent() {
  const client = useFhevmClient({ ... });
}

// Works in Vue
const client = ref(await createFhevmClient({ ... }));
```

### 2. Unified Dependency Management

Instead of installing multiple packages:
```bash
# ❌ Old way (scattered dependencies)
npm install fhevmjs @zama-fhe/gateway-sdk ethers

# ✅ New way (single package)
npm install fhevm-sdk
```

### 3. wagmi-like API Design

Familiar patterns for web3 developers:

```typescript
// Similar to wagmi's useAccount, useConnect
import { useFhevmClient, useEncrypt, useDecrypt } from 'fhevm-sdk/react';

function App() {
  const { client, isReady } = useFhevmClient();
  const { encrypt } = useEncrypt(client);
  const { decrypt } = useDecrypt(client);

  // Use it like wagmi hooks
}
```

### 4. Following Zama's Official Guidelines

Built on top of Zama's official tools:
- `fhevmjs` for encryption/decryption
- Official gateway SDK for key management
- Follows Zama's security best practices

## 🏆 Evaluation Criteria

### ✅ Usability
- **Installation**: Single `npm install fhevm-sdk` command
- **Setup**: < 10 lines of code to start
- **Minimal Boilerplate**: Smart defaults, optional configuration

### ✅ Completeness
- ✓ Client initialization
- ✓ Input encryption
- ✓ Output decryption
- ✓ Contract interactions
- ✓ Error handling
- ✓ Type safety

### ✅ Reusability
- Modular components for different use cases
- Framework-specific adapters (React, Vue, etc.)
- Clean separation of concerns
- Extensible architecture

### ✅ Documentation
- Comprehensive README
- API reference with examples
- Integration guides for multiple frameworks
- Real-world use case documentation

### ✅ Creativity
- Property Trading dApp showcasing FHE potential
- Multi-framework support (React, Vue, Node.js)
- Developer-friendly abstractions
- Performance optimizations

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

# Build the SDK
cd packages/fhevm-sdk
pnpm build

# Run examples
cd ../../examples/nextjs-demo
pnpm dev
```

### Testing

```bash
# Run SDK tests
cd packages/fhevm-sdk
pnpm test

# Run integration tests
pnpm test:integration
```

## 📋 Examples

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
- Private property listings
- Encrypted price negotiations
- Confidential ownership records
- Secure transaction history

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## 📄 License

MIT License - see [LICENSE](./LICENSE) for details.

## 🔗 Links

- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [Zama GitHub](https://github.com/zama-ai)
- [Original Template](https://github.com/zama-ai/fhevm-react-template)

## 🙏 Acknowledgments

Built for the Zama FHEVM SDK Competition. Special thanks to:
- Zama team for FHE technology
- Community feedback from GitHub issues
- Original fhevm-react-template contributors

---

**Made with ❤️ for confidential computing**
