# FHEVM SDK Integration in Property Trading

This document explains how the Property Trading example integrates the FHEVM SDK for confidential smart contract operations.

## 🎯 Overview

The Property Trading dApp demonstrates **real-world usage** of the FHEVM SDK in a vanilla TypeScript application. Unlike the Next.js demo which uses React hooks, this example shows how to integrate the SDK in any JavaScript/TypeScript project.

## 📦 SDK Installation

The SDK is added as a workspace dependency:

```json
{
  "dependencies": {
    "fhevm-sdk": "workspace:*",
    "fhevmjs": "^0.6.0"
  }
}
```

## 🔧 SDK Integration Architecture

### 1. SDK Wrapper Utility (`src/utils/fhevm-sdk.ts`)

We created a utility module that wraps the FHEVM SDK with application-specific logic:

```typescript
import { createFhevmClient, encryptInput, decryptOutput } from 'fhevm-sdk';
import type { FhevmClient } from 'fhevm-sdk';

// Global client instance
let fhevmClient: FhevmClient | null = null;

// Initialize SDK
export async function initializeFhevmSdk(config) {
  fhevmClient = await createFhevmClient({
    network: config.network,
    contractAddress: config.contractAddress,
    gatewayUrl: config.gatewayUrl,
  });
  return fhevmClient;
}

// Encrypt helper
export async function encryptValue(value: number | bigint) {
  const client = getFhevmClient();
  return await encryptInput(client, value);
}

// Decrypt helper
export async function decryptValue(handle: string) {
  const client = getFhevmClient();
  return await decryptOutput(client, handle);
}
```

**Why this approach?**
- ✅ Centralized SDK management
- ✅ Easy error handling
- ✅ Reusable across the application
- ✅ Type-safe API

### 2. Usage in Main Application

#### A. Initialize on Wallet Connect

```typescript
import { initializeFhevmSdk } from './utils/fhevm-sdk';

async function onWalletConnected(account: string) {
  // Initialize FHEVM SDK with connected wallet
  await initializeFhevmSdk({
    network: 'sepolia',
    contractAddress: CONTRACT_ADDRESS,
    gatewayUrl: 'https://gateway.sepolia.zama.ai',
  });

  console.log('FHEVM SDK ready for', account);
}
```

#### B. Encrypt Property Price

```typescript
import { encryptValue } from './utils/fhevm-sdk';

async function listProperty(price: number) {
  try {
    // Encrypt the price using SDK
    const encrypted = await encryptValue(price);

    // Send to smart contract
    const tx = await contract.listProperty({
      encryptedPrice: encrypted.data,
      handles: encrypted.handles,
    });

    await tx.wait();
    console.log('Property listed with encrypted price');
  } catch (error) {
    console.error('Failed to list property:', error);
  }
}
```

#### C. Decrypt Property Price

```typescript
import { decryptValue } from './utils/fhevm-sdk';

async function viewPropertyPrice(propertyId: number) {
  try {
    // Get encrypted handle from contract
    const encryptedHandle = await contract.getPrice(propertyId);

    // Decrypt using SDK
    const price = await decryptValue(encryptedHandle);

    console.log('Property price:', price.toString());
    return price;
  } catch (error) {
    console.error('Failed to decrypt price:', error);
    throw error;
  }
}
```

## 🔐 Key Features Demonstrated

### 1. **Client Initialization**
```typescript
const client = await createFhevmClient({
  network: 'sepolia',
  contractAddress: '0x...',
  gatewayUrl: 'https://gateway.sepolia.zama.ai',
});
```

### 2. **Input Encryption**
```typescript
const encrypted = await encryptInput(client, 1000000);
// encrypted.data: Uint8Array - encrypted bytes
// encrypted.handles: string[] - encryption handles
```

### 3. **Output Decryption**
```typescript
const decrypted = await decryptOutput(client, handle);
// decrypted: bigint - original value
```

### 4. **Error Handling**
```typescript
try {
  const encrypted = await encryptValue(price);
} catch (error) {
  if (error.message.includes('not initialized')) {
    // SDK not ready
  } else if (error.message.includes('permission')) {
    // No decrypt permission
  }
}
```

## 📊 Comparison: React Hooks vs Vanilla JS

### React (Next.js Demo)
```typescript
// Using hooks
const { client, isReady } = useFhevmClient({ network: 'sepolia' });
const { encrypt } = useEncrypt(client);
const { decrypt } = useDecrypt(client);
```

### Vanilla JS (Property Trading)
```typescript
// Using utility functions
await initializeFhevmSdk({ network: 'sepolia' });
const encrypted = await encryptValue(1000);
const decrypted = await decryptValue(handle);
```

**Both approaches use the same underlying SDK!**

## 🎓 SDK Architecture Benefits

### Framework-Agnostic Core
```
fhevm-sdk/
├── client.ts       # Core client (works anywhere)
├── encrypt.ts      # Encryption utils (works anywhere)
├── decrypt.ts      # Decryption utils (works anywhere)
└── react/          # Optional React hooks layer
    └── index.ts
```

### Usage in Any Framework

**React:**
```typescript
import { useFhevmClient } from 'fhevm-sdk/react';
```

**Vue:**
```typescript
import { createFhevmClient } from 'fhevm-sdk';
// Use in Vue composables
```

**Angular:**
```typescript
import { createFhevmClient } from 'fhevm-sdk';
// Use in Angular services
```

**Vanilla JS:**
```typescript
import { createFhevmClient } from 'fhevm-sdk';
// Use directly
```

## 🚀 Integration Steps Summary

1. **Add SDK dependency** to `package.json`
   ```json
   "fhevm-sdk": "workspace:*"
   ```

2. **Create wrapper utilities** (`utils/fhevm-sdk.ts`)
   - Initialize function
   - Encrypt helper
   - Decrypt helper

3. **Initialize on wallet connect**
   ```typescript
   await initializeFhevmSdk({ network, contractAddress });
   ```

4. **Use in your application**
   ```typescript
   const encrypted = await encryptValue(data);
   const decrypted = await decryptValue(handle);
   ```

## 📝 Best Practices

### ✅ DO:
- Initialize SDK once per wallet connection
- Cache the client instance
- Handle errors gracefully
- Validate encrypted data before sending to contract
- Check permissions before decryption

### ❌ DON'T:
- Re-initialize SDK on every operation
- Ignore initialization errors
- Expose raw encryption handles to users
- Skip error handling
- Use SDK without wallet connection

## 🔍 Complete Example

```typescript
import { initializeFhevmSdk, encryptValue, decryptValue } from './utils/fhevm-sdk';
import { CONTRACT_ADDRESS } from './config/contracts';

class PropertyService {
  // Initialize when wallet connects
  async initialize() {
    await initializeFhevmSdk({
      network: 'sepolia',
      contractAddress: CONTRACT_ADDRESS,
    });
  }

  // List property with encrypted price
  async listProperty(price: number) {
    const encrypted = await encryptValue(price);

    const tx = await this.contract.listProperty(
      encrypted.data,
      encrypted.handles
    );

    return await tx.wait();
  }

  // Get and decrypt property price
  async getPrice(propertyId: number) {
    const handle = await this.contract.getEncryptedPrice(propertyId);
    return await decryptValue(handle);
  }
}
```

## 📚 Learn More

- **SDK Core**: See `packages/fhevm-sdk/src/client.ts`
- **React Integration**: See `examples/nextjs-demo/`
- **Vanilla Integration**: See this example
- **API Reference**: See main repository README

## ✅ Conclusion

This property trading example demonstrates that the FHEVM SDK is:
- ✅ **Framework-agnostic** - Works with any JS framework
- ✅ **Easy to integrate** - Simple API surface
- ✅ **Type-safe** - Full TypeScript support
- ✅ **Production-ready** - Used in real dApp

The same SDK powers both the React-based Next.js demo and this vanilla TypeScript application!
