# API Reference

Complete reference for FHEVM SDK.

## Core Functions

### `createFhevmClient(config)`

Creates and initializes an FHEVM client.

**Parameters:**
- `config: FhevmClientConfig`
  - `network`: `'sepolia' | 'localhost' | string` - Network to connect to
  - `gatewayUrl?`: `string` - Gateway URL (optional, uses default for network)
  - `contractAddress?`: `string` - Default contract address
  - `provider?`: `BrowserProvider | JsonRpcProvider` - Custom provider
  - `aclAddress?`: `string` - ACL contract address

**Returns:** `Promise<FhevmClient>`

**Example:**
```typescript
const client = await createFhevmClient({
  network: 'sepolia',
  contractAddress: '0x...',
});
```

---

### `encryptInput(client, value, contractAddress?)`

Encrypts a numeric value for FHEVM contract.

**Parameters:**
- `client: FhevmClient` - Initialized FHEVM client
- `value: number | bigint` - Value to encrypt
- `contractAddress?: string` - Override default contract address

**Returns:** `Promise<EncryptedValue>`

**Example:**
```typescript
const encrypted = await encryptInput(client, 1000);
await contract.setValue(encrypted.data, encrypted.handles);
```

---

### `encryptInputBatch(client, values, contractAddress?)`

Encrypts multiple values at once.

**Parameters:**
- `client: FhevmClient`
- `values: (number | bigint)[]` - Array of values to encrypt
- `contractAddress?: string`

**Returns:** `Promise<EncryptedValue[]>`

**Example:**
```typescript
const encrypted = await encryptInputBatch(client, [100, 200, 300]);
```

---

### `encryptBool(client, value, contractAddress?)`

Encrypts a boolean value.

**Parameters:**
- `client: FhevmClient`
- `value: boolean`
- `contractAddress?: string`

**Returns:** `Promise<EncryptedValue>`

**Example:**
```typescript
const encrypted = await encryptBool(client, true);
```

---

### `encryptAddress(client, address, contractAddress?)`

Encrypts an Ethereum address.

**Parameters:**
- `client: FhevmClient`
- `address: string` - Ethereum address
- `contractAddress?: string`

**Returns:** `Promise<EncryptedValue>`

**Example:**
```typescript
const encrypted = await encryptAddress(client, '0x...');
```

---

### `decryptOutput(client, handle, contractAddress?)`

Decrypts an encrypted value from contract.

**Parameters:**
- `client: FhevmClient`
- `handle: string` - Encrypted handle from contract
- `contractAddress?: string`

**Returns:** `Promise<bigint>`

**Example:**
```typescript
const encryptedValue = await contract.getValue();
const decrypted = await decryptOutput(client, encryptedValue);
```

---

### `decryptOutputBatch(client, handles, contractAddress?)`

Decrypts multiple values at once.

**Parameters:**
- `client: FhevmClient`
- `handles: string[]` - Array of encrypted handles
- `contractAddress?: string`

**Returns:** `Promise<bigint[]>`

---

### `decryptBool(client, handle, contractAddress?)`

Decrypts a boolean value.

**Returns:** `Promise<boolean>`

---

### `decryptAddress(client, handle, contractAddress?)`

Decrypts an address.

**Returns:** `Promise<string>`

---

### `decryptUint64(client, handle, contractAddress?)`

Decrypts uint64 to number.

**Returns:** `Promise<number>`

---

### `decryptUint256(client, handle, contractAddress?)`

Decrypts uint256 to string (avoids precision loss).

**Returns:** `Promise<string>`

---

## React Hooks

### `useFhevmClient(config)`

Hook to create and manage FHEVM client.

**Parameters:**
- `config: FhevmClientConfig`

**Returns:**
```typescript
{
  client: FhevmClient | null;
  isReady: boolean;
  error: Error | null;
}
```

**Example:**
```typescript
function App() {
  const { client, isReady, error } = useFhevmClient({
    network: 'sepolia',
    contractAddress: '0x...',
  });

  if (error) return <div>Error: {error.message}</div>;
  if (!isReady) return <div>Loading...</div>;

  return <div>Client ready!</div>;
}
```

---

### `useEncrypt(client)`

Hook for encrypting values.

**Parameters:**
- `client: FhevmClient | null`

**Returns:**
```typescript
{
  encrypt: (value: number | bigint, contractAddress?: string) => Promise<EncryptedValue | null>;
  isEncrypting: boolean;
  error: Error | null;
}
```

**Example:**
```typescript
function TransactionForm() {
  const { client } = useFhevmClient({ ... });
  const { encrypt, isEncrypting, error } = useEncrypt(client);

  const handleSubmit = async (value: number) => {
    const encrypted = await encrypt(value);
    if (encrypted) {
      await contract.submit(encrypted.data);
    }
  };

  return (
    <button onClick={() => handleSubmit(100)} disabled={isEncrypting}>
      {isEncrypting ? 'Encrypting...' : 'Submit'}
    </button>
  );
}
```

---

### `useDecrypt(client)`

Hook for decrypting values.

**Parameters:**
- `client: FhevmClient | null`

**Returns:**
```typescript
{
  decrypt: (handle: string, contractAddress?: string) => Promise<bigint | null>;
  isDecrypting: boolean;
  error: Error | null;
}
```

**Example:**
```typescript
function BalanceDisplay() {
  const { client } = useFhevmClient({ ... });
  const { decrypt, isDecrypting } = useDecrypt(client);
  const [balance, setBalance] = useState<bigint | null>(null);

  useEffect(() => {
    async function fetchBalance() {
      const encryptedBalance = await contract.getBalance();
      const decrypted = await decrypt(encryptedBalance);
      setBalance(decrypted);
    }
    fetchBalance();
  }, [decrypt]);

  if (isDecrypting) return <div>Decrypting...</div>;
  return <div>Balance: {balance?.toString()}</div>;
}
```

---

### `useEncryptedInput(client)`

Hook for managing encrypted input state.

**Parameters:**
- `client: FhevmClient | null`

**Returns:**
```typescript
{
  value: number;
  encrypted: EncryptedValue | null;
  setValue: (value: number) => void;
  isEncrypting: boolean;
  error: Error | null;
}
```

**Example:**
```typescript
function PrivateInputForm() {
  const { client } = useFhevmClient({ ... });
  const { value, encrypted, setValue, isEncrypting } = useEncryptedInput(client);

  return (
    <div>
      <input
        type="number"
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
      />
      {isEncrypting && <span>Encrypting...</span>}
      {encrypted && <span>Encrypted and ready!</span>}
    </div>
  );
}
```

---

## Types

### `FhevmClient`

```typescript
interface FhevmClient {
  instance: FhevmInstance;
  provider: BrowserProvider | JsonRpcProvider;
  signer?: JsonRpcSigner;
  config: FhevmClientConfig;
  isReady: boolean;
}
```

### `FhevmClientConfig`

```typescript
interface FhevmClientConfig {
  network: 'sepolia' | 'localhost' | string;
  gatewayUrl?: string;
  contractAddress?: string;
  provider?: BrowserProvider | JsonRpcProvider;
  aclAddress?: string;
}
```

### `EncryptedValue`

```typescript
type EncryptedValue = {
  data: Uint8Array;
  handles: string[];
}
```

---

## Utility Functions

### `isClientReady(client)`

Check if client is initialized and ready.

**Parameters:**
- `client: FhevmClient | null`

**Returns:** `boolean`

---

### `waitForTransaction(client, txHash)`

Wait for transaction confirmation.

**Parameters:**
- `client: FhevmClient`
- `txHash: string`

**Returns:** `Promise<TransactionReceipt>`

---

### `estimateGas(client, transaction)`

Estimate gas for transaction.

**Parameters:**
- `client: FhevmClient`
- `transaction: any`

**Returns:** `Promise<bigint>`

---

## Error Handling

All functions may throw the following errors:

### Common Errors

- `"FHEVM client is not ready"` - Client not initialized
- `"Contract address is required"` - No contract address provided
- `"No provider available"` - No Ethereum provider found
- `"Encryption failed: ..."` - Encryption error with details
- `"Decryption failed: ..."` - Decryption error with details

### Error Handling Pattern

```typescript
try {
  const encrypted = await encryptInput(client, value);
  await contract.submit(encrypted.data);
} catch (error) {
  if (error instanceof Error) {
    console.error('Operation failed:', error.message);
    // Handle specific errors
    if (error.message.includes('not ready')) {
      // Client initialization issue
    } else if (error.message.includes('Encryption failed')) {
      // Encryption issue
    }
  }
}
```

---

## Advanced Usage

### Custom Network Configuration

```typescript
const client = await createFhevmClient({
  network: 'custom',
  gatewayUrl: 'https://your-gateway.com',
  aclAddress: '0xYourACLAddress',
  contractAddress: '0xYourContract',
});
```

### Using Multiple Contracts

```typescript
// Set default contract
const client = await createFhevmClient({
  contractAddress: '0xContract1',
});

// Override for specific operations
const encrypted = await encryptInput(client, 100, '0xContract2');
```

### Permission Management

```typescript
import { grantPermission, hasPermission, getPermission } from 'fhevm-sdk';

// Grant permission to address
await grantPermission(client, '0xUserAddress', handle);

// Check if address has permission
const canDecrypt = await hasPermission(client, '0xUserAddress', handle);

// Get permission details
const permission = await getPermission(client, handle);
```
