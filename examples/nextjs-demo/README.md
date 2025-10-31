# FHEVM SDK - Next.js Demo

This is a Next.js application demonstrating the integration of FHEVM SDK for building confidential dApps.

## Features

- ✅ **Client Initialization** - Using `useFhevmClient` hook
- ✅ **Encryption Demo** - Interactive encryption of numeric values
- ✅ **Decryption Demo** - Decrypting encrypted handles from contracts
- ✅ **Loading States** - Proper handling of async operations
- ✅ **Error Handling** - User-friendly error messages
- ✅ **Modern UI** - Clean, responsive design with CSS modules

## Quick Start

### Installation

```bash
# Install dependencies
npm install
# or
pnpm install
```

### Configuration

Copy the example environment file:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourContractAddress
NEXT_PUBLIC_NETWORK=sepolia
NEXT_PUBLIC_GATEWAY_URL=https://gateway.sepolia.zama.ai
```

### Development

```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

### Build for Production

```bash
npm run build
npm start
# or
pnpm build
pnpm start
```

## Project Structure

```
nextjs-demo/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Main page
│   │   ├── page.module.css     # Page styles
│   │   ├── globals.css         # Global styles
│   │   └── ...
│   └── components/
│       ├── EncryptionDemo.tsx  # Encryption UI
│       ├── DecryptionDemo.tsx  # Decryption UI
│       └── *.module.css        # Component styles
├── public/                     # Static assets
├── next.config.js             # Next.js configuration
├── tsconfig.json              # TypeScript configuration
└── package.json
```

## Using FHEVM SDK in Next.js

### 1. Client-Side Component (Required)

FHEVM SDK uses browser APIs, so components must be client-side:

```typescript
'use client'; // Important!

import { useFhevmClient } from 'fhevm-sdk/react';

export default function MyComponent() {
  const { client, isReady } = useFhevmClient({
    network: 'sepolia',
    contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
  });

  // ... rest of component
}
```

### 2. Encryption Hook

```typescript
import { useEncrypt } from 'fhevm-sdk/react';

function EncryptExample({ client }) {
  const { encrypt, isEncrypting } = useEncrypt(client);

  const handleEncrypt = async (value: number) => {
    const encrypted = await encrypt(value);
    // Use encrypted.data with your contract
  };

  return (
    <button onClick={() => handleEncrypt(100)} disabled={isEncrypting}>
      {isEncrypting ? 'Encrypting...' : 'Encrypt'}
    </button>
  );
}
```

### 3. Decryption Hook

```typescript
import { useDecrypt } from 'fhevm-sdk/react';

function DecryptExample({ client }) {
  const { decrypt, isDecrypting } = useDecrypt(client);

  const handleDecrypt = async (handle: string) => {
    const value = await decrypt(handle);
    console.log('Decrypted:', value.toString());
  };

  return (
    <button onClick={() => handleDecrypt('0x...')} disabled={isDecrypting}>
      {isDecrypting ? 'Decrypting...' : 'Decrypt'}
    </button>
  );
}
```

## Key Concepts

### App Router (Next.js 13+)

This demo uses Next.js App Router with:
- Server Components by default
- `'use client'` directive for client-side components
- CSS Modules for styling
- TypeScript for type safety

### FHEVM Integration

The demo showcases:
- Initializing FHEVM client in a Next.js app
- Managing loading and error states
- Encrypting user inputs
- Decrypting contract outputs
- Proper TypeScript typing

### Responsive Design

- Mobile-friendly layout
- Dark theme for better visibility
- Smooth animations and transitions
- Accessible form controls

## Deployment

### Deploy to Vercel

The easiest way to deploy is using [Vercel](https://vercel.com):

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Deploy to Other Platforms

Build the production bundle:

```bash
npm run build
```

The output will be in `.next/` directory. Follow your platform's deployment guide for Next.js applications.

### Environment Variables

Make sure to set these environment variables in your deployment platform:

- `NEXT_PUBLIC_CONTRACT_ADDRESS`
- `NEXT_PUBLIC_NETWORK`
- `NEXT_PUBLIC_GATEWAY_URL`

## Common Issues

### "window is not defined"

Make sure your FHEVM components have `'use client'` directive at the top.

### Module Not Found

Ensure the SDK is installed:

```bash
cd ../../packages/fhevm-sdk
pnpm build
cd ../../examples/nextjs-demo
pnpm install
```

### Encryption/Decryption Fails

- Check that MetaMask or another wallet is installed
- Verify the contract address is correct
- Ensure you're on the right network (Sepolia)

## Learn More

- [FHEVM SDK Documentation](../../README.md)
- [Next.js Documentation](https://nextjs.org/docs)
- [Zama Documentation](https://docs.zama.ai/fhevm)

## License

MIT
