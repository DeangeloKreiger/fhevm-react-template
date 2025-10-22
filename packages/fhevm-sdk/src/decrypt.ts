import type { FhevmClient } from './client';

/**
 * Decrypt an encrypted output from FHEVM contract
 *
 * @example
 * ```typescript
 * const encryptedResult = await contract.getPrivateValue();
 * const decrypted = await decryptOutput(client, encryptedResult);
 * console.log(decrypted); // Original value
 * ```
 */
export async function decryptOutput(
  client: FhevmClient,
  handle: string,
  contractAddress?: string
): Promise<bigint> {
  if (!client.isReady) {
    throw new Error('FHEVM client is not ready');
  }

  const address = contractAddress || client.config.contractAddress;
  if (!address) {
    throw new Error('Contract address is required');
  }

  try {
    // Request decryption from gateway
    const decrypted = await client.instance.reencrypt(
      handle,
      await client.signer!.getAddress(),
      address,
      client.signer!
    );

    return decrypted;
  } catch (error) {
    throw new Error(`Decryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Decrypt multiple handles at once
 *
 * @example
 * ```typescript
 * const handles = await contract.getMultipleValues();
 * const decrypted = await decryptOutputBatch(client, handles);
 * ```
 */
export async function decryptOutputBatch(
  client: FhevmClient,
  handles: string[],
  contractAddress?: string
): Promise<bigint[]> {
  return Promise.all(
    handles.map(handle => decryptOutput(client, handle, contractAddress))
  );
}

/**
 * Decrypt a boolean value
 */
export async function decryptBool(
  client: FhevmClient,
  handle: string,
  contractAddress?: string
): Promise<boolean> {
  const result = await decryptOutput(client, handle, contractAddress);
  return result === BigInt(1);
}

/**
 * Decrypt an address
 */
export async function decryptAddress(
  client: FhevmClient,
  handle: string,
  contractAddress?: string
): Promise<string> {
  const result = await decryptOutput(client, handle, contractAddress);
  // Convert bigint to address string
  return `0x${result.toString(16).padStart(40, '0')}`;
}

/**
 * Decrypt a uint64 value
 */
export async function decryptUint64(
  client: FhevmClient,
  handle: string,
  contractAddress?: string
): Promise<number> {
  const result = await decryptOutput(client, handle, contractAddress);
  return Number(result);
}

/**
 * Decrypt a uint256 value (returns as string to avoid precision loss)
 */
export async function decryptUint256(
  client: FhevmClient,
  handle: string,
  contractAddress?: string
): Promise<string> {
  const result = await decryptOutput(client, handle, contractAddress);
  return result.toString();
}
