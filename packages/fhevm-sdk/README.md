# FHEVM SDK

Universal SDK for building confidential frontends with Fully Homomorphic Encryption (FHE).

## Installation

```bash
npm install fhevm-sdk
```

## Quick Start

```typescript
import { createFhevmClient, encryptInput, decryptOutput } from 'fhevm-sdk';

// Initialize
const client = await createFhevmClient({
  network: 'sepolia',
  contractAddress: '0x...',
});

// Encrypt
const encrypted = await encryptInput(client, 1000);

// Decrypt
const decrypted = await decryptOutput(client, encryptedHandle);
```

## React Hooks

```typescript
import { useFhevmClient, useEncrypt, useDecrypt } from 'fhevm-sdk/react';

function App() {
  const { client, isReady } = useFhevmClient({ ... });
  const { encrypt } = useEncrypt(client);
  const { decrypt } = useDecrypt(client);

  // Use hooks
}
```

## Features

- ✅ Framework agnostic (works with React, Vue, Node.js, etc.)
- ✅ Single package for all FHEVM needs
- ✅ wagmi-like API for web3 developers
- ✅ TypeScript first with full type safety
- ✅ < 10 lines to get started

## Documentation

See [full documentation](https://github.com/yourusername/fhevm-react-template) for complete API reference and examples.

## License

MIT
