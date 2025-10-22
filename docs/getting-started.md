# Getting Started with FHEVM SDK

Welcome to FHEVM SDK! This guide will help you set up and start building confidential dApps in less than 10 minutes.

## Installation

```bash
npm install fhevm-sdk
# or
yarn add fhevm-sdk
# or
pnpm add fhevm-sdk
```

## Quick Start

### 1. Basic Setup (Node.js)

```typescript
import { createFhevmClient, encryptInput, decryptOutput } from 'fhevm-sdk';

// Initialize client
const client = await createFhevmClient({
  network: 'sepolia',
  gatewayUrl: 'https://gateway.sepolia.zama.ai',
  contractAddress: '0xYourContractAddress',
});

// Encrypt a value
const encrypted = await encryptInput(client, 1000);

// Send to contract
await contract.setPrivateValue(encrypted.data, encrypted.handles);

// Decrypt result
const encryptedResult = await contract.getPrivateValue();
const decrypted = await decryptOutput(client, encryptedResult);
console.log(decrypted); // 1000
```

### 2. React Setup

```typescript
import { useFhevmClient, useEncrypt, useDecrypt } from 'fhevm-sdk/react';

function App() {
  const { client, isReady } = useFhevmClient({
    network: 'sepolia',
    contractAddress: '0xYourContractAddress',
  });

  const { encrypt, isEncrypting } = useEncrypt(client);
  const { decrypt, isDecrypting } = useDecrypt(client);

  if (!isReady) return <div>Loading FHEVM...</div>;

  const handleSubmit = async (value: number) => {
    const encrypted = await encrypt(value);
    // Send to contract
  };

  return <button onClick={() => handleSubmit(100)}>Send Private Transaction</button>;
}
```

### 3. Vue Setup

```typescript
import { ref, onMounted } from 'vue';
import { createFhevmClient, encryptInput } from 'fhevm-sdk';

export default {
  setup() {
    const client = ref(null);
    const isReady = ref(false);

    onMounted(async () => {
      client.value = await createFhevmClient({
        network: 'sepolia',
        contractAddress: '0xYourContractAddress',
      });
      isReady.value = true;
    });

    const handleEncrypt = async (value) => {
      const encrypted = await encryptInput(client.value, value);
      // Use encrypted data
    };

    return { client, isReady, handleEncrypt };
  },
};
```

## Configuration

### Network Options

```typescript
const client = await createFhevmClient({
  network: 'sepolia', // 'sepolia' | 'localhost' | custom
  gatewayUrl: 'https://gateway.sepolia.zama.ai', // optional
  contractAddress: '0x...', // your contract
  aclAddress: '0x...', // optional ACL address
});
```

### Custom Provider

```typescript
import { BrowserProvider } from 'ethers';

const provider = new BrowserProvider(window.ethereum);

const client = await createFhevmClient({
  network: 'sepolia',
  provider: provider,
  contractAddress: '0x...',
});
```

## Core Concepts

### 1. Client Initialization

The FHEVM client manages:
- Connection to Ethereum network
- FHE key generation and management
- Gateway communication for encryption/decryption

### 2. Encryption

Encrypt sensitive data before sending to smart contracts:

```typescript
// Encrypt a number
const encrypted = await encryptInput(client, 1000);

// Encrypt a boolean
const encryptedBool = await encryptBool(client, true);

// Encrypt an address
const encryptedAddr = await encryptAddress(client, '0x...');

// Batch encryption
const batch = await encryptInputBatch(client, [100, 200, 300]);
```

### 3. Decryption

Decrypt values returned from contracts:

```typescript
// Decrypt uint64
const value = await decryptUint64(client, handle);

// Decrypt boolean
const isTrue = await decryptBool(client, handle);

// Decrypt address
const address = await decryptAddress(client, handle);

// Batch decryption
const values = await decryptOutputBatch(client, handles);
```

## Next Steps

- [API Reference](./api-reference.md) - Complete API documentation
- [Examples](./examples.md) - Real-world use cases
- [Migration Guide](./migration.md) - Migrate from fhevmjs

## Common Patterns

### Loading State

```typescript
function MyComponent() {
  const { client, isReady, error } = useFhevmClient({ ... });

  if (error) return <div>Error: {error.message}</div>;
  if (!isReady) return <div>Initializing FHEVM...</div>;

  return <div>Ready to encrypt!</div>;
}
```

### Error Handling

```typescript
try {
  const encrypted = await encryptInput(client, value);
  await contract.submit(encrypted.data);
} catch (error) {
  if (error.message.includes('not initialized')) {
    // Handle client not ready
  } else if (error.message.includes('Encryption failed')) {
    // Handle encryption error
  }
}
```

### Permission Management

```typescript
import { grantPermission, hasPermission } from 'fhevm-sdk';

// Grant permission to address
await grantPermission(client, userAddress, handle);

// Check permission
const canDecrypt = await hasPermission(client, userAddress, handle);
```

## Troubleshooting

### "Client not initialized"

Make sure to await client creation:

```typescript
const client = await createFhevmClient({ ... });
// ✅ Use client here
```

### "Contract address is required"

Provide contract address in config or function call:

```typescript
// Option 1: In config
const client = await createFhevmClient({
  contractAddress: '0x...',
});

// Option 2: Per function call
await encryptInput(client, value, '0xContractAddress');
```

### "No provider available"

Ensure MetaMask or another wallet is installed:

```typescript
if (!window.ethereum) {
  alert('Please install MetaMask');
}
```

## Support

- GitHub Issues: [Report bugs](https://github.com/yourusername/fhevm-react-template/issues)
- Discord: [Join community](https://discord.gg/zama)
- Documentation: [Full docs](https://docs.zama.ai/fhevm)
