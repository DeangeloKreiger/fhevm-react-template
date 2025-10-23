# Migration Guide

This guide helps you migrate existing projects to use the FHEVM SDK.

## Table of Contents

- [Migrating from fhevmjs](#migrating-from-fhevmjs)
- [Migrating from Custom Encryption](#migrating-from-custom-encryption)
- [Migrating Between Frameworks](#migrating-between-frameworks)
- [Breaking Changes](#breaking-changes)
- [Troubleshooting](#troubleshooting)

---

## Migrating from fhevmjs

If you're currently using `fhevmjs` directly, migrating to FHEVM SDK provides a cleaner API and better developer experience.

### Before (Using fhevmjs directly)

```typescript
import { createInstance, initFhevm } from 'fhevmjs';
import { BrowserProvider } from 'ethers';

// Initialize
await initFhevm();

const provider = new BrowserProvider(window.ethereum);
const signer = await provider.getSigner();

const instance = await createInstance({
  chainId: 11155111,
  network: window.ethereum,
  gatewayUrl: 'https://gateway.sepolia.zama.ai',
  aclAddress: '0x...',
});

// Encrypt
const input = instance.createEncryptedInput(contractAddress, userAddress);
input.add64(BigInt(1000));
const encrypted = await input.encrypt();

// Decrypt
const decrypted = await instance.decrypt(contractAddress, handle);
```

### After (Using FHEVM SDK)

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
const decrypted = await decryptOutput(client, handle);
```

### Migration Steps

1. **Install FHEVM SDK**
   ```bash
   npm install fhevm-sdk
   # You can remove fhevmjs if not needed directly
   # npm uninstall fhevmjs
   ```

2. **Replace Initialization Code**
   ```typescript
   // Old
   await initFhevm();
   const instance = await createInstance({ ... });

   // New
   const client = await createFhevmClient({
     network: 'sepolia',
     contractAddress: CONTRACT_ADDRESS,
   });
   ```

3. **Replace Encryption Code**
   ```typescript
   // Old
   const input = instance.createEncryptedInput(contractAddress, userAddress);
   input.add64(BigInt(value));
   const encrypted = await input.encrypt();

   // New
   const encrypted = await encryptInput(client, value);
   ```

4. **Replace Decryption Code**
   ```typescript
   // Old
   const decrypted = await instance.decrypt(contractAddress, handle);

   // New
   const decrypted = await decryptOutput(client, handle);
   ```

### API Mapping Table

| fhevmjs API | FHEVM SDK API | Notes |
|-------------|---------------|-------|
| `initFhevm()` | `createFhevmClient()` | Combines init and create |
| `createInstance()` | `createFhevmClient()` | Simplified config |
| `instance.createEncryptedInput()` | `encryptInput()` | One function call |
| `input.add64()` | Value passed directly | No builder pattern |
| `input.encrypt()` | Part of `encryptInput()` | Automatic |
| `instance.decrypt()` | `decryptOutput()` | Simplified |

---

## Migrating from Custom Encryption

If you built custom encryption logic, the SDK provides standardized patterns.

### Before (Custom Implementation)

```typescript
class MyEncryption {
  private instance: any;

  async init() {
    await initFhevm();
    this.instance = await createInstance({ ... });
  }

  async encryptValue(value: number) {
    const input = this.instance.createEncryptedInput(...);
    input.add64(BigInt(value));
    return await input.encrypt();
  }

  async decryptValue(handle: string) {
    return await this.instance.decrypt(..., handle);
  }
}
```

### After (Using FHEVM SDK)

```typescript
import { createFhevmClient, encryptInput, decryptOutput } from 'fhevm-sdk';

const client = await createFhevmClient({
  network: 'sepolia',
  contractAddress: CONTRACT_ADDRESS,
});

const encrypted = await encryptInput(client, value);
const decrypted = await decryptOutput(client, handle);
```

**Benefits:**
- ✅ No need to maintain custom encryption logic
- ✅ Standardized error handling
- ✅ TypeScript support out of the box
- ✅ Regular updates and bug fixes

---

## Migrating Between Frameworks

### From Vanilla JS to React

**Before (Vanilla JS):**
```typescript
let fhevmClient: FhevmClient;

async function initApp() {
  fhevmClient = await createFhevmClient({ network: 'sepolia' });
}

async function encrypt(value: number) {
  return await encryptInput(fhevmClient, value);
}
```

**After (React with Hooks):**
```typescript
import { useFhevmClient, useEncrypt } from 'fhevm-sdk/react';

function MyComponent() {
  const { client, isReady } = useFhevmClient({ network: 'sepolia' });
  const { encrypt, isEncrypting } = useEncrypt(client);

  const handleEncrypt = async () => {
    const result = await encrypt(1000);
  };
}
```

### From React to Next.js

**Additional Steps for Next.js:**

1. **Mark Components as Client-Side**
   ```typescript
   'use client'; // Add this at the top

   import { useFhevmClient } from 'fhevm-sdk/react';
   ```

2. **Update Next.js Config**
   ```javascript
   // next.config.js
   const nextConfig = {
     webpack: (config) => {
       config.resolve.fallback = {
         ...config.resolve.fallback,
         fs: false,
         net: false,
         tls: false,
       };
       return config;
     },
   };
   ```

### From React to Vue

**Create Vue Composables:**
```typescript
// composables/useFhevm.ts
import { ref, onMounted } from 'vue';
import { createFhevmClient, encryptInput, decryptOutput } from 'fhevm-sdk';
import type { FhevmClient } from 'fhevm-sdk';

export function useFhevm(config: { network: string; contractAddress?: string }) {
  const client = ref<FhevmClient | null>(null);
  const isReady = ref(false);
  const error = ref<Error | null>(null);

  onMounted(async () => {
    try {
      client.value = await createFhevmClient(config);
      isReady.value = true;
    } catch (err) {
      error.value = err as Error;
    }
  });

  const encrypt = async (value: number | bigint) => {
    if (!client.value) throw new Error('Client not ready');
    return await encryptInput(client.value, value);
  };

  const decrypt = async (handle: string) => {
    if (!client.value) throw new Error('Client not ready');
    return await decryptOutput(client.value, handle);
  };

  return { client, isReady, error, encrypt, decrypt };
}
```

**Usage in Vue Component:**
```vue
<script setup lang="ts">
import { useFhevm } from '@/composables/useFhevm';

const { client, isReady, encrypt, decrypt } = useFhevm({
  network: 'sepolia',
  contractAddress: '0x...',
});

const handleEncrypt = async () => {
  const encrypted = await encrypt(1000);
  console.log('Encrypted:', encrypted);
};
</script>
```

---

## Breaking Changes

### v0.x to v1.x

#### 1. **Client Initialization**

**Before:**
```typescript
const client = createFhevmClient(network, contractAddress);
```

**After:**
```typescript
const client = await createFhevmClient({
  network,
  contractAddress,
});
```

#### 2. **Encryption Returns Object**

**Before:**
```typescript
const encrypted: Uint8Array = await encrypt(client, value);
```

**After:**
```typescript
const encrypted: EncryptedValue = await encryptInput(client, value);
// encrypted.data: Uint8Array
// encrypted.handles: string[]
```

#### 3. **React Hook Names**

**Before:**
```typescript
const { client } = useClient();
const { encrypt } = useEncryption(client);
```

**After:**
```typescript
const { client } = useFhevmClient({ network: 'sepolia' });
const { encrypt } = useEncrypt(client);
```

#### 4. **Network Configuration**

**Before:**
```typescript
createFhevmClient('sepolia', '0x...')
```

**After:**
```typescript
createFhevmClient({
  network: 'sepolia',
  contractAddress: '0x...',
  gatewayUrl: 'https://gateway.sepolia.zama.ai', // Optional
})
```

---

## Troubleshooting

### Common Migration Issues

#### Issue 1: "Client is not initialized"

**Problem:**
```typescript
const encrypted = await encryptInput(client, 1000);
// Error: Client is not initialized
```

**Solution:**
```typescript
// Ensure client is awaited
const client = await createFhevmClient({ ... });

// Or check if ready
if (client.isReady) {
  const encrypted = await encryptInput(client, 1000);
}
```

#### Issue 2: TypeScript Errors

**Problem:**
```
Cannot find module 'fhevm-sdk' or its corresponding type declarations
```

**Solution:**
```bash
# Ensure TypeScript can find the types
npm install --save-dev @types/node

# Check tsconfig.json
{
  "compilerOptions": {
    "moduleResolution": "node",
    "esModuleInterop": true
  }
}
```

#### Issue 3: Webpack/Vite Build Errors

**Problem:**
```
Module not found: Can't resolve 'crypto'
```

**Solution for Vite:**
```javascript
// vite.config.ts
import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    alias: {
      crypto: 'crypto-browserify',
      stream: 'stream-browserify',
      buffer: 'buffer',
    },
  },
  define: {
    'process.env': {},
    global: 'globalThis',
  },
});
```

**Solution for Webpack:**
```javascript
// webpack.config.js
module.exports = {
  resolve: {
    fallback: {
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      buffer: require.resolve('buffer/'),
    },
  },
};
```

#### Issue 4: "window is not defined" in Next.js

**Problem:**
```
ReferenceError: window is not defined
```

**Solution:**
```typescript
// Add 'use client' directive
'use client';

import { useFhevmClient } from 'fhevm-sdk/react';
```

#### Issue 5: Provider Errors

**Problem:**
```
Error: No provider available
```

**Solution:**
```typescript
// Check MetaMask is installed
if (typeof window !== 'undefined' && window.ethereum) {
  const client = await createFhevmClient({
    network: 'sepolia',
    contractAddress: CONTRACT_ADDRESS,
  });
} else {
  console.error('Please install MetaMask');
}
```

### Migration Checklist

- [ ] Installed `fhevm-sdk` package
- [ ] Updated client initialization code
- [ ] Replaced encryption function calls
- [ ] Replaced decryption function calls
- [ ] Updated TypeScript types
- [ ] Tested encryption functionality
- [ ] Tested decryption functionality
- [ ] Updated error handling
- [ ] Removed old dependencies (if applicable)
- [ ] Updated documentation
- [ ] Tested in production environment

---

## Getting Help

If you encounter issues during migration:

1. **Check Examples**
   - [Next.js Demo](../examples/nextjs-demo/)
   - [Property Trading Example](../examples/property-trading/)

2. **Read Documentation**
   - [Getting Started](./getting-started.md)
   - [API Reference](./api-reference.md)

3. **Common Patterns**
   - [Examples Guide](./examples.md)

4. **Community Support**
   - Open an issue on GitHub
   - Check existing issues for solutions

---

## Best Practices After Migration

1. **Use Wrapper Functions**
   ```typescript
   // Create reusable utilities
   export async function initializeFhevm(config) {
     return await createFhevmClient(config);
   }
   ```

2. **Handle Errors Gracefully**
   ```typescript
   try {
     const encrypted = await encryptInput(client, value);
   } catch (error) {
     console.error('Encryption failed:', error);
     // Show user-friendly message
   }
   ```

3. **Cache Client Instance**
   ```typescript
   let clientInstance: FhevmClient | null = null;

   export async function getClient() {
     if (!clientInstance) {
       clientInstance = await createFhevmClient({ ... });
     }
     return clientInstance;
   }
   ```

4. **Type Everything**
   ```typescript
   import type { FhevmClient, EncryptedValue } from 'fhevm-sdk';

   async function encrypt(client: FhevmClient, value: number): Promise<EncryptedValue> {
     return await encryptInput(client, value);
   }
   ```

---

**Happy migrating!** 🚀
