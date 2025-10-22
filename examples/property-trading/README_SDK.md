# Property Trading - FHEVM SDK Example

> **Real-world integration of FHEVM SDK** in a vanilla TypeScript application

## 🎯 About This Example

This is a **complete, production-ready dApp** that demonstrates how to integrate the FHEVM SDK into a real-world application. Unlike the Next.js demo which focuses on React hooks, this example shows:

- ✅ **Vanilla TypeScript integration** - No framework required
- ✅ **Real application architecture** - Complete property trading platform
- ✅ **SDK wrapper patterns** - Best practices for SDK integration
- ✅ **Error handling** - Production-ready error management
- ✅ **Type safety** - Full TypeScript support

## 🔐 FHEVM SDK Integration

### Why FHEVM SDK?

This application uses the FHEVM SDK (this repository) for **confidential smart contract operations**:

```typescript
import { createFhevmClient, encryptInput, decryptOutput } from 'fhevm-sdk';
```

### Integration Architecture

```
Application Layer
    ↓
Utils Layer (src/utils/fhevm-sdk.ts)
    ↓
FHEVM SDK (packages/fhevm-sdk)
    ↓
fhevmjs (Encryption Library)
    ↓
Smart Contracts (Sepolia)
```

### Quick Start with SDK

**1. Initialize SDK on Wallet Connect:**
```typescript
import { initializeFhevmSdk } from './utils/fhevm-sdk';

await initializeFhevmSdk({
  network: 'sepolia',
  contractAddress: CONTRACT_ADDRESS,
});
```

**2. Encrypt Data Before Sending to Contract:**
```typescript
import { encryptValue } from './utils/fhevm-sdk';

const encrypted = await encryptValue(propertyPrice);
await contract.listProperty(encrypted.data);
```

**3. Decrypt Data from Contract:**
```typescript
import { decryptValue } from './utils/fhevm-sdk';

const encryptedHandle = await contract.getPrice(propertyId);
const price = await decryptValue(encryptedHandle);
```

## 📦 Installation

```bash
# Install dependencies
npm install

# The FHEVM SDK is included as a workspace dependency
# "fhevm-sdk": "workspace:*"
```

## 🚀 Running the Example

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Visit `http://localhost:5173` and connect your MetaMask wallet.

## 📁 Key Files

### SDK Integration
- **`src/utils/fhevm-sdk.ts`** - SDK wrapper utilities
  - `initializeFhevmSdk()` - Initialize client
  - `encryptValue()` - Encrypt data
  - `decryptValue()` - Decrypt data
  - `getFhevmClient()` - Get client instance

### Application Code
- **`src/main.ts`** - Main application entry point
- **`src/config/wagmi.ts`** - Wallet configuration
- **`src/config/contracts.ts`** - Contract ABIs and addresses
- **`src/utils/contract.ts`** - Contract interaction utilities

### Configuration
- **`package.json`** - Includes `fhevm-sdk: "workspace:*"`
- **`vite.config.ts`** - Vite build configuration
- **`tsconfig.json`** - TypeScript configuration

## 🎓 Learning from This Example

### 1. **Framework-Agnostic Integration**

This example proves the SDK works with **any JavaScript framework** (or no framework):

```typescript
// No React, Vue, or Angular required!
import { createFhevmClient } from 'fhevm-sdk';

const client = await createFhevmClient({
  network: 'sepolia',
  contractAddress: '0x...',
});
```

### 2. **Wrapper Pattern**

The `src/utils/fhevm-sdk.ts` file demonstrates best practices:

```typescript
// Centralized SDK management
let fhevmClient: FhevmClient | null = null;

export async function initializeFhevmSdk(config) {
  fhevmClient = await createFhevmClient(config);
  return fhevmClient;
}

export async function encryptValue(value: number) {
  const client = getFhevmClient(); // Throws if not initialized
  return await encryptInput(client, value);
}
```

**Benefits:**
- ✅ Single source of truth for client instance
- ✅ Consistent error handling
- ✅ Type-safe API
- ✅ Easy to test

### 3. **Error Handling**

```typescript
try {
  const encrypted = await encryptValue(price);
} catch (error) {
  if (error.message.includes('not initialized')) {
    // SDK not ready - show user message
    showError('Please connect your wallet first');
  } else {
    // Other encryption error
    showError('Failed to encrypt data');
  }
}
```

### 4. **Production Patterns**

```typescript
// Check if SDK is ready before operations
if (!isFhevmSdkReady()) {
  await initializeFhevmSdk({ network: 'sepolia' });
}

// Reset on wallet disconnect
watchAccount((account) => {
  if (!account.isConnected) {
    resetFhevmClient();
  }
});
```

## 🔄 Comparison: React vs Vanilla

### React (Next.js Demo)
```typescript
const { client, isReady } = useFhevmClient({ network: 'sepolia' });
const { encrypt } = useEncrypt(client);
```

### Vanilla (This Example)
```typescript
await initializeFhevmSdk({ network: 'sepolia' });
const encrypted = await encryptValue(data);
```

**Both use the exact same SDK core!** The React version just wraps it in hooks.

## 📚 Documentation

- **[SDK Integration Guide](./SDK_INTEGRATION.md)** - Detailed integration documentation
- **[Main Repository README](../../README.md)** - FHEVM SDK overview
- **[Next.js Demo](../nextjs-demo/)** - React hooks example
- **[API Reference](../../packages/fhevm-sdk/README.md)** - Complete API docs

## 🎯 Use Cases Demonstrated

### 1. **Property Registration**
```typescript
const encrypted = await encryptValue(propertyPrice);
await contract.registerProperty(propertyId, encrypted.data);
```

### 2. **Price Updates**
```typescript
const newPrice = await encryptValue(1000000);
await contract.updatePrice(propertyId, newPrice.data);
```

### 3. **View Encrypted Data**
```typescript
const handle = await contract.getEncryptedPrice(propertyId);
const price = await decryptValue(handle);
console.log(`Price: $${price}`);
```

## 🌟 Key Takeaways

1. **Universal SDK** - Works with any JS framework
2. **Simple API** - Only 3 main functions needed:
   - `createFhevmClient()`
   - `encryptInput()`
   - `decryptOutput()`
3. **Type Safe** - Full TypeScript support
4. **Production Ready** - Used in real dApp
5. **Well Documented** - Clear examples and patterns

## 🚀 Next Steps

1. **Explore the Code**
   - Read `src/utils/fhevm-sdk.ts` for integration patterns
   - Check `src/main.ts` for usage examples
   - Review `SDK_INTEGRATION.md` for detailed docs

2. **Build Your Own**
   - Copy the wrapper pattern
   - Adapt for your use case
   - Use same SDK functions

3. **Deploy**
   - Works on any hosting platform
   - No special configuration needed
   - Just build and deploy!

## 📄 License

MIT

---

**This is a real example of FHEVM SDK in production!** 🎉
