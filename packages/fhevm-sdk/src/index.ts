/**
 * FHEVM SDK - Universal SDK for Confidential Smart Contracts
 *
 * @packageDocumentation
 */

// Core exports
export { createFhevmClient, isClientReady } from './client';
export type { FhevmClient, FhevmClientConfig } from './client';

// Encryption exports
export {
  encryptInput,
  encryptInputBatch,
  encryptBool,
  encryptAddress,
} from './encrypt';
export type { EncryptedValue } from './encrypt';

// Decryption exports
export {
  decryptOutput,
  decryptOutputBatch,
  decryptBool,
  decryptAddress,
  decryptUint64,
  decryptUint256,
} from './decrypt';

// Utility exports
export { getPermission, hasPermission, grantPermission } from './utils/permissions';
export { waitForTransaction, estimateGas } from './utils/transactions';

// Re-export useful types from fhevmjs
export type { FhevmInstance } from 'fhevmjs';
