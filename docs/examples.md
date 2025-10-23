# Examples Guide

This guide provides detailed walkthroughs of the example applications included in this repository.

## Table of Contents

- [Overview](#overview)
- [Next.js Demo](#nextjs-demo)
- [Property Trading Example](#property-trading-example)
- [Common Patterns](#common-patterns)
- [Building Your Own](#building-your-own)

---

## Overview

This repository includes two complete example applications demonstrating different integration approaches:

| Example | Framework | Use Case | Best For |
|---------|-----------|----------|----------|
| **Next.js Demo** | React + Next.js 14 | Interactive demo | React developers |
| **Property Trading** | Vanilla TypeScript | Real-world application | Any framework |

Both examples use the **same FHEVM SDK core**, just with different integration patterns.

---

## Next.js Demo

**Location:** `examples/nextjs-demo/`

### What It Demonstrates

- ✅ React hooks integration (`useFhevmClient`, `useEncrypt`, `useDecrypt`)
- ✅ Next.js App Router compatibility
- ✅ Client-side rendering with FHEVM
- ✅ Component-based architecture
- ✅ Modern UI with CSS Modules

### Project Structure

```
nextjs-demo/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Main page with SDK integration
│   │   ├── page.module.css     # Page styles
│   │   └── globals.css         # Global styles
│   └── components/
│       ├── EncryptionDemo.tsx  # Encryption UI component
│       ├── DecryptionDemo.tsx  # Decryption UI component
│       └── *.module.css        # Component styles
├── package.json
├── next.config.js
├── tsconfig.json
└── README.md
```

### Key Features

#### 1. FHEVM Client Initialization

**File:** `src/app/page.tsx`

```typescript
'use client';

import { useFhevmClient } from 'fhevm-sdk/react';

export default function Home() {
  const { client, isReady, error } = useFhevmClient({
    network: 'sepolia',
    contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
  });

  if (!isReady) return <div>Loading FHEVM...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>FHEVM Ready!</div>;
}
```

**Key Points:**
- Must use `'use client'` directive for Next.js
- Hook automatically handles initialization
- Provides loading and error states

#### 2. Encryption Component

**File:** `src/components/EncryptionDemo.tsx`

```typescript
'use client';

import { useState } from 'react';
import { useEncrypt } from 'fhevm-sdk/react';
import type { FhevmClient } from 'fhevm-sdk';

interface Props {
  client: FhevmClient | null;
}

export default function EncryptionDemo({ client }: Props) {
  const [value, setValue] = useState('');
  const [result, setResult] = useState('');
  const { encrypt, isEncrypting } = useEncrypt(client);

  const handleEncrypt = async () => {
    const encrypted = await encrypt(Number(value));
    if (encrypted) {
      const hex = Array.from(encrypted.data)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
      setResult(hex);
    }
  };

  return (
    <div>
      <input
        type="number"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={isEncrypting}
      />
      <button onClick={handleEncrypt} disabled={isEncrypting}>
        {isEncrypting ? 'Encrypting...' : 'Encrypt'}
      </button>
      {result && <div>Encrypted: {result}</div>}
    </div>
  );
}
```

**Key Points:**
- Uses `useEncrypt` hook for encryption
- Handles loading state with `isEncrypting`
- Converts encrypted bytes to hex for display

#### 3. Decryption Component

**File:** `src/components/DecryptionDemo.tsx`

```typescript
'use client';

import { useState } from 'react';
import { useDecrypt } from 'fhevm-sdk/react';
import type { FhevmClient } from 'fhevm-sdk';

interface Props {
  client: FhevmClient | null;
}

export default function DecryptionDemo({ client }: Props) {
  const [handle, setHandle] = useState('');
  const [result, setResult] = useState('');
  const { decrypt, isDecrypting } = useDecrypt(client);

  const handleDecrypt = async () => {
    const decrypted = await decrypt(handle);
    if (decrypted !== null) {
      setResult(decrypted.toString());
    }
  };

  return (
    <div>
      <input
        type="text"
        value={handle}
        onChange={(e) => setHandle(e.target.value)}
        placeholder="0x..."
        disabled={isDecrypting}
      />
      <button onClick={handleDecrypt} disabled={isDecrypting}>
        {isDecrypting ? 'Decrypting...' : 'Decrypt'}
      </button>
      {result && <div>Decrypted Value: {result}</div>}
    </div>
  );
}
```

**Key Points:**
- Uses `useDecrypt` hook for decryption
- Handles loading state with `isDecrypting`
- Displays decrypted value as string

### Running the Example

```bash
# Navigate to directory
cd examples/nextjs-demo

# Install dependencies
npm install

# Set environment variables
cp .env.example .env.local
# Edit .env.local with your contract address

# Run development server
npm run dev

# Open http://localhost:3000
```

### Key Learnings

1. **Client-Side Only**: FHEVM operations must run in the browser
2. **Hook Pattern**: React hooks provide clean state management
3. **Error Handling**: Always handle loading and error states
4. **Type Safety**: Use TypeScript types from the SDK

---

## Property Trading Example

**Location:** `examples/property-trading/`

### What It Demonstrates

- ✅ Vanilla TypeScript integration
- ✅ Real-world application architecture
- ✅ SDK wrapper pattern
- ✅ Complete property marketplace
- ✅ Production-ready code

### Project Structure

```
property-trading/
├── src/
│   ├── config/
│   │   ├── wagmi.ts           # Wallet configuration
│   │   └── contracts.ts       # Contract ABIs
│   ├── utils/
│   │   ├── fhevm-sdk.ts       # SDK wrapper utilities
│   │   ├── contract.ts        # Contract interactions
│   │   ├── loading.ts         # Loading state
│   │   └── notifications.ts   # User notifications
│   ├── main.ts                # Application entry
│   └── style.css              # Tailwind styles
├── contracts/
│   └── PrivatePropertyTrading.sol
├── public/                    # Static assets
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

### Key Features

#### 1. SDK Wrapper Utilities

**File:** `src/utils/fhevm-sdk.ts`

```typescript
import { createFhevmClient, encryptInput, decryptOutput } from 'fhevm-sdk';
import type { FhevmClient, EncryptedValue } from 'fhevm-sdk';

let fhevmClient: FhevmClient | null = null;

export async function initializeFhevmSdk(config: {
  network: string;
  contractAddress?: string;
}): Promise<FhevmClient> {
  fhevmClient = await createFhevmClient(config);
  return fhevmClient;
}

export function getFhevmClient(): FhevmClient {
  if (!fhevmClient) {
    throw new Error('FHEVM SDK not initialized');
  }
  return fhevmClient;
}

export async function encryptValue(
  value: number | bigint
): Promise<EncryptedValue> {
  const client = getFhevmClient();
  return await encryptInput(client, value);
}

export async function decryptValue(handle: string): Promise<bigint> {
  const client = getFhevmClient();
  return await decryptOutput(client, handle);
}

export function resetFhevmClient(): void {
  fhevmClient = null;
}
```

**Key Points:**
- Singleton pattern for client management
- Wrapper functions for common operations
- Clear error messages
- Easy to use throughout application

#### 2. Application Integration

**File:** `src/main.ts` (simplified)

```typescript
import { initializeFhevmSdk, encryptValue, decryptValue } from './utils/fhevm-sdk';
import { CONTRACT_ADDRESS } from './config/contracts';

// Initialize SDK on wallet connect
async function onWalletConnected(address: string) {
  try {
    await initializeFhevmSdk({
      network: 'sepolia',
      contractAddress: CONTRACT_ADDRESS,
    });

    console.log('FHEVM SDK initialized for', address);
    showSuccess('FHEVM ready for encrypted operations');
  } catch (error) {
    console.error('Failed to initialize FHEVM:', error);
    showError('Failed to initialize encryption');
  }
}

// List property with encrypted price
async function listProperty(propertyId: number, price: number) {
  try {
    showLoading('Encrypting price...');

    const encrypted = await encryptValue(price);

    showLoading('Listing property...');
    const tx = await contract.listProperty(
      propertyId,
      encrypted.data,
      encrypted.handles
    );

    await tx.wait();
    showSuccess('Property listed successfully!');
  } catch (error) {
    showError('Failed to list property');
    console.error(error);
  }
}

// View encrypted property price
async function viewPropertyPrice(propertyId: number) {
  try {
    showLoading('Fetching encrypted price...');

    const encryptedHandle = await contract.getEncryptedPrice(propertyId);

    showLoading('Decrypting price...');
    const price = await decryptValue(encryptedHandle);

    console.log('Property price:', price.toString());
    showSuccess(`Price: ${formatPrice(price)}`);

    return price;
  } catch (error) {
    showError('Failed to decrypt price');
    console.error(error);
  }
}
```

**Key Points:**
- Initialize on wallet connect
- Encrypt before sending to contract
- Decrypt when viewing data
- Comprehensive error handling
- User feedback at each step

#### 3. Contract Interaction

**File:** `src/utils/contract.ts`

```typescript
import { ethers } from 'ethers';
import { encryptValue, decryptValue } from './fhevm-sdk';
import { CONTRACT_ABI, CONTRACT_ADDRESS } from '../config/contracts';

export interface Property {
  id: number;
  owner: string;
  price: bigint;
  isListed: boolean;
}

export async function registerProperty(
  contract: ethers.Contract,
  propertyId: number,
  price: number
): Promise<void> {
  // Encrypt the price
  const encrypted = await encryptValue(price);

  // Send to contract
  const tx = await contract.registerProperty(
    propertyId,
    encrypted.data,
    encrypted.handles
  );

  await tx.wait();
}

export async function getPropertyPrice(
  contract: ethers.Contract,
  propertyId: number
): Promise<bigint> {
  // Get encrypted handle from contract
  const handle = await contract.getEncryptedPrice(propertyId);

  // Decrypt the value
  return await decryptValue(handle);
}

export async function updatePropertyPrice(
  contract: ethers.Contract,
  propertyId: number,
  newPrice: number
): Promise<void> {
  const encrypted = await encryptValue(newPrice);

  const tx = await contract.updatePrice(
    propertyId,
    encrypted.data,
    encrypted.handles
  );

  await tx.wait();
}
```

**Key Points:**
- Separate contract interaction logic
- Reusable functions
- Type definitions for data structures
- Clean separation of concerns

### Running the Example

```bash
# Navigate to directory
cd examples/property-trading

# Install dependencies
npm install

# Set environment variables
cp .env.example .env
# Edit .env with your values

# Run development server
npm run dev

# Open http://localhost:5173
```

### Key Learnings

1. **Wrapper Pattern**: Creating utilities makes SDK easier to use
2. **Singleton Client**: One client instance for the whole app
3. **Error Handling**: Graceful error handling improves UX
4. **Type Safety**: TypeScript catches errors early
5. **User Feedback**: Show loading/success/error states

---

## Common Patterns

### Pattern 1: Initialize on Wallet Connect

```typescript
// React
function App() {
  const { isConnected, address } = useAccount();
  const { client } = useFhevmClient({
    network: 'sepolia',
    contractAddress: CONTRACT_ADDRESS,
  });

  useEffect(() => {
    if (isConnected && client) {
      console.log('Ready for', address);
    }
  }, [isConnected, client]);
}

// Vanilla JS
watchAccount(async (account) => {
  if (account.isConnected) {
    await initializeFhevmSdk({
      network: 'sepolia',
      contractAddress: CONTRACT_ADDRESS,
    });
  } else {
    resetFhevmClient();
  }
});
```

### Pattern 2: Encrypt User Input

```typescript
// React
function PriceForm() {
  const { encrypt } = useEncrypt(client);

  const handleSubmit = async (price: number) => {
    const encrypted = await encrypt(price);
    await contract.setPrice(encrypted.data);
  };
}

// Vanilla JS
async function handleSubmit(price: number) {
  const encrypted = await encryptValue(price);
  await contract.setPrice(encrypted.data);
}
```

### Pattern 3: Decrypt Contract Data

```typescript
// React
function PriceDisplay({ propertyId }: Props) {
  const [price, setPrice] = useState<bigint | null>(null);
  const { decrypt } = useDecrypt(client);

  useEffect(() => {
    async function loadPrice() {
      const handle = await contract.getPrice(propertyId);
      const decrypted = await decrypt(handle);
      setPrice(decrypted);
    }
    loadPrice();
  }, [propertyId]);

  return <div>Price: {price?.toString()}</div>;
}

// Vanilla JS
async function displayPrice(propertyId: number) {
  const handle = await contract.getPrice(propertyId);
  const price = await decryptValue(handle);

  document.getElementById('price').textContent = price.toString();
}
```

### Pattern 4: Error Handling

```typescript
// With try-catch
async function encrypt AndSend(value: number) {
  try {
    const encrypted = await encryptValue(value);
    await contract.send(encrypted.data);
    showSuccess('Success!');
  } catch (error) {
    if (error.message.includes('not initialized')) {
      showError('Please connect wallet first');
    } else if (error.message.includes('permission')) {
      showError('No permission to decrypt');
    } else {
      showError('Operation failed');
    }
    console.error(error);
  }
}
```

### Pattern 5: Loading States

```typescript
// React
function EncryptButton() {
  const { encrypt, isEncrypting } = useEncrypt(client);

  return (
    <button disabled={isEncrypting} onClick={() => encrypt(1000)}>
      {isEncrypting ? 'Encrypting...' : 'Encrypt'}
    </button>
  );
}

// Vanilla JS
async function handleEncrypt(value: number) {
  const button = document.getElementById('encrypt-btn');
  button.disabled = true;
  button.textContent = 'Encrypting...';

  try {
    await encryptValue(value);
  } finally {
    button.disabled = false;
    button.textContent = 'Encrypt';
  }
}
```

---

## Building Your Own

### Step 1: Choose Your Approach

**React/Next.js:**
- Use `examples/nextjs-demo` as template
- Install dependencies
- Use React hooks

**Vanilla/Other Framework:**
- Use `examples/property-trading` SDK wrapper
- Create utilities
- Use direct SDK calls

### Step 2: Set Up Project

```bash
# Create new project
npm create vite@latest my-fhevm-app -- --template vanilla-ts
cd my-fhevm-app

# Install FHEVM SDK
npm install fhevm-sdk ethers

# Install dev dependencies
npm install -D vite typescript
```

### Step 3: Create SDK Wrapper

```typescript
// src/fhevm.ts
import { createFhevmClient, encryptInput, decryptOutput } from 'fhevm-sdk';
import type { FhevmClient } from 'fhevm-sdk';

let client: FhevmClient | null = null;

export async function initFhevm(contractAddress: string) {
  client = await createFhevmClient({
    network: 'sepolia',
    contractAddress,
  });
  return client;
}

export async function encrypt(value: number) {
  if (!client) throw new Error('Not initialized');
  return await encryptInput(client, value);
}

export async function decrypt(handle: string) {
  if (!client) throw new Error('Not initialized');
  return await decryptOutput(client, handle);
}
```

### Step 4: Integrate in Your App

```typescript
// src/main.ts
import { initFhevm, encrypt, decrypt } from './fhevm';

async function main() {
  // Initialize
  await initFhevm('0xYourContractAddress');

  // Encrypt
  const encrypted = await encrypt(1000);
  console.log('Encrypted:', encrypted);

  // Use with contract
  // const tx = await contract.setValue(encrypted.data);
  // await tx.wait();
}

main();
```

### Step 5: Add Error Handling

```typescript
try {
  await initFhevm(CONTRACT_ADDRESS);
} catch (error) {
  console.error('Initialization failed:', error);
  // Show error to user
}
```

---

## Next Steps

1. **Explore Examples**
   - Run both examples locally
   - Read the source code
   - Understand the patterns

2. **Build Your Own**
   - Start with a simple use case
   - Follow the patterns from examples
   - Add features incrementally

3. **Get Help**
   - Check [Migration Guide](./migration.md)
   - Read [API Reference](./api-reference.md)
   - Open GitHub issues

---

**Happy coding!** 🚀
