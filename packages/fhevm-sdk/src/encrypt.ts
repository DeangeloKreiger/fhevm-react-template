import type { FhevmClient } from './client';

export type EncryptedValue = {
  data: Uint8Array;
  handles: string[];
};

/**
 * Encrypt a numeric value for FHEVM
 *
 * @example
 * ```typescript
 * const encrypted = await encryptInput(client, 1000);
 * await contract.setPrivateValue(encrypted.data, encrypted.handles);
 * ```
 */
export async function encryptInput(
  client: FhevmClient,
  value: number | bigint,
  contractAddress?: string
): Promise<EncryptedValue> {
  if (!client.isReady) {
    throw new Error('FHEVM client is not ready');
  }

  const address = contractAddress || client.config.contractAddress;
  if (!address) {
    throw new Error('Contract address is required');
  }

  // Convert to Uint8Array for encryption
  const input = client.instance.createEncryptedInput(address, await client.signer!.getAddress());

  // Add the value - fhevmjs will handle type detection
  input.add64(BigInt(value));

  // Encrypt
  const encrypted = await input.encrypt();

  return {
    data: encrypted.data,
    handles: encrypted.handles,
  };
}

/**
 * Encrypt multiple values at once
 *
 * @example
 * ```typescript
 * const encrypted = await encryptInputBatch(client, [100, 200, 300]);
 * ```
 */
export async function encryptInputBatch(
  client: FhevmClient,
  values: (number | bigint)[],
  contractAddress?: string
): Promise<EncryptedValue[]> {
  return Promise.all(
    values.map(value => encryptInput(client, value, contractAddress))
  );
}

/**
 * Encrypt a boolean value
 */
export async function encryptBool(
  client: FhevmClient,
  value: boolean,
  contractAddress?: string
): Promise<EncryptedValue> {
  if (!client.isReady) {
    throw new Error('FHEVM client is not ready');
  }

  const address = contractAddress || client.config.contractAddress;
  if (!address) {
    throw new Error('Contract address is required');
  }

  const input = client.instance.createEncryptedInput(address, await client.signer!.getAddress());
  input.addBool(value);

  const encrypted = await input.encrypt();

  return {
    data: encrypted.data,
    handles: encrypted.handles,
  };
}

/**
 * Encrypt an address
 */
export async function encryptAddress(
  client: FhevmClient,
  address: string,
  contractAddress?: string
): Promise<EncryptedValue> {
  if (!client.isReady) {
    throw new Error('FHEVM client is not ready');
  }

  const targetAddress = contractAddress || client.config.contractAddress;
  if (!targetAddress) {
    throw new Error('Contract address is required');
  }

  const input = client.instance.createEncryptedInput(targetAddress, await client.signer!.getAddress());
  input.addAddress(address);

  const encrypted = await input.encrypt();

  return {
    data: encrypted.data,
    handles: encrypted.handles,
  };
}
