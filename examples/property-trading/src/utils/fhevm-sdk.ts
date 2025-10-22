/**
 * FHEVM SDK Integration Utilities
 *
 * This file demonstrates how to use the FHEVM SDK in a vanilla TypeScript application.
 * The property trading example uses this SDK for all encryption and decryption operations.
 */

import { createFhevmClient, encryptInput, decryptOutput } from 'fhevm-sdk';
import type { FhevmClient, EncryptedValue } from 'fhevm-sdk';
import { BrowserProvider } from 'ethers';

// Global FHEVM client instance
let fhevmClient: FhevmClient | null = null;

/**
 * Initialize the FHEVM SDK client
 * This should be called once when the application starts or when a wallet is connected
 *
 * @example
 * ```typescript
 * await initializeFhevmSdk({
 *   network: 'sepolia',
 *   contractAddress: '0x...',
 * });
 * ```
 */
export async function initializeFhevmSdk(config: {
  network: 'sepolia' | 'localhost' | string;
  contractAddress?: string;
  gatewayUrl?: string;
}): Promise<FhevmClient> {
  try {
    console.log('[FHEVM SDK] Initializing client...', config);

    // Create provider from MetaMask/window.ethereum
    let provider: BrowserProvider | undefined;
    if (typeof window !== 'undefined' && window.ethereum) {
      provider = new BrowserProvider(window.ethereum);
    }

    // Initialize the FHEVM client
    fhevmClient = await createFhevmClient({
      network: config.network,
      contractAddress: config.contractAddress,
      gatewayUrl: config.gatewayUrl,
      provider,
    });

    console.log('[FHEVM SDK] Client initialized successfully');
    return fhevmClient;
  } catch (error) {
    console.error('[FHEVM SDK] Failed to initialize client:', error);
    throw new Error(`FHEVM SDK initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get the current FHEVM client instance
 * Throws an error if the client is not initialized
 */
export function getFhevmClient(): FhevmClient {
  if (!fhevmClient) {
    throw new Error('FHEVM SDK not initialized. Call initializeFhevmSdk() first.');
  }
  return fhevmClient;
}

/**
 * Check if the FHEVM SDK is initialized and ready to use
 */
export function isFhevmSdkReady(): boolean {
  return fhevmClient !== null && fhevmClient.isReady;
}

/**
 * Encrypt a numeric value using the FHEVM SDK
 *
 * @example
 * ```typescript
 * const encrypted = await encryptValue(1000000); // Encrypt property price
 * await contract.setPrice(encrypted.data);
 * ```
 */
export async function encryptValue(
  value: number | bigint,
  contractAddress?: string
): Promise<EncryptedValue> {
  const client = getFhevmClient();

  try {
    console.log('[FHEVM SDK] Encrypting value:', value);
    const encrypted = await encryptInput(client, value, contractAddress);
    console.log('[FHEVM SDK] Value encrypted successfully');
    return encrypted;
  } catch (error) {
    console.error('[FHEVM SDK] Encryption failed:', error);
    throw new Error(`Failed to encrypt value: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Decrypt an encrypted value from the contract
 *
 * @example
 * ```typescript
 * const encryptedHandle = await contract.getPrice(propertyId);
 * const price = await decryptValue(encryptedHandle);
 * console.log('Property price:', price);
 * ```
 */
export async function decryptValue(handle: string): Promise<bigint> {
  const client = getFhevmClient();

  try {
    console.log('[FHEVM SDK] Decrypting handle:', handle);
    const decrypted = await decryptOutput(client, handle);
    console.log('[FHEVM SDK] Value decrypted successfully:', decrypted);
    return decrypted;
  } catch (error) {
    console.error('[FHEVM SDK] Decryption failed:', error);
    throw new Error(`Failed to decrypt value: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Reset the FHEVM client (useful when switching accounts or networks)
 */
export function resetFhevmClient(): void {
  console.log('[FHEVM SDK] Resetting client');
  fhevmClient = null;
}

// TypeScript type exports for convenience
export type { FhevmClient, EncryptedValue };
