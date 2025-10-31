/**
 * Type definitions for FHE operations
 */

export type FHEType =
  | 'ebool'
  | 'euint8'
  | 'euint16'
  | 'euint32'
  | 'euint64'
  | 'euint128'
  | 'euint256';

export interface EncryptedValue {
  data: Uint8Array;
  handles: any;
  type?: FHEType;
}

export interface DecryptedValue {
  value: number | boolean;
  type?: FHEType;
}

export interface FHEOperation {
  type: 'add' | 'sub' | 'mul' | 'div' | 'eq' | 'ne' | 'lt' | 'lte' | 'gt' | 'gte';
  operands: EncryptedValue[];
}

export interface PermissionSignature {
  signature: string;
  publicKey: string;
}

export interface ReencryptionRequest {
  handle: string;
  contractAddress: string;
  userAddress: string;
}

export interface FHEClientState {
  isInitialized: boolean;
  publicKey: string | null;
  network: string;
  error: Error | null;
}
