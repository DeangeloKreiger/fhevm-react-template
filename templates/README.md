# FHEVM SDK Templates

This directory contains starter templates for integrating the FHEVM SDK into various frameworks.

## Available Templates

### 1. Next.js Template
**Location:** `../examples/nextjs-demo/`

A comprehensive Next.js 14+ template showcasing:
- App Router integration
- API routes for FHE operations
- Client and server-side encryption/decryption
- React hooks (useFhevmClient, useEncrypt, useDecrypt)
- UI components for FHE operations
- Real-world use case examples (Banking, Medical)

**Quick Start:**
```bash
cd examples/nextjs-demo
pnpm install
pnpm dev
```

### 2. Vanilla TypeScript/Vite Template
**Location:** `../examples/property-trading/`

A real-world property trading application using:
- Vite for fast development
- wagmi for Web3 integration
- FHEVM SDK for confidential data
- Tailwind CSS for styling

**Quick Start:**
```bash
cd examples/property-trading
pnpm install
pnpm dev
```

## Using These Templates

### Option 1: Copy an Example

```bash
# Copy Next.js template
cp -r examples/nextjs-demo my-fhevm-app
cd my-fhevm-app
pnpm install
```

### Option 2: Start Fresh

1. Install the SDK:
```bash
npm install fhevm-sdk
# or
pnpm add fhevm-sdk
```

2. Initialize the client:
```typescript
import { createFhevmClient } from 'fhevm-sdk';

const client = await createFhevmClient({
  network: 'sepolia',
  gatewayUrl: 'https://gateway.zama.ai',
  contractAddress: '0x...',
});
```

3. Use encryption/decryption:
```typescript
import { encryptInput, decryptOutput } from 'fhevm-sdk';

// Encrypt
const encrypted = await encryptInput(client, 1000);

// Decrypt
const decrypted = await decryptOutput(client, encryptedHandle);
```

## Template Structure

Each template follows this general structure:

```
template/
├── src/
│   ├── components/      # UI components
│   ├── lib/            # FHE utilities
│   ├── hooks/          # React hooks (if applicable)
│   └── types/          # TypeScript types
├── package.json
├── tsconfig.json
└── README.md
```

## Next Steps

After choosing a template:

1. **Configure Environment Variables**
   ```env
   NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
   NEXT_PUBLIC_GATEWAY_URL=https://gateway.zama.ai
   NEXT_PUBLIC_NETWORK=sepolia
   ```

2. **Review Documentation**
   - [Getting Started](../docs/getting-started.md)
   - [API Reference](../docs/api-reference.md)
   - [Examples](../docs/examples.md)

3. **Deploy Your App**
   - Vercel (Next.js)
   - Netlify
   - GitHub Pages

## Contributing

Have a template for another framework? We'd love to see it!
- Vue.js
- Svelte
- Angular
- Node.js CLI

See [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.
