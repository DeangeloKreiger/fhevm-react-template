/**
 * Type definitions for FHE operations
 */

export interface EncryptedData {
  data: Uint8Array;
  handles: any;
}

export interface FHEClientConfig {
  network: string;
  gatewayUrl?: string;
  contractAddress?: string;
}

export interface EncryptionResult {
  encrypted: Uint8Array;
  handles: any;
  type: string;
}

export interface DecryptionResult {
  decrypted: number;
}

export type FHEDataType =
  | 'uint8'
  | 'uint16'
  | 'uint32'
  | 'uint64'
  | 'int8'
  | 'int16'
  | 'int32'
  | 'int64'
  | 'bool';

export interface ComputationRequest {
  operation: 'add' | 'subtract' | 'multiply' | 'divide';
  values: number[];
  type?: FHEDataType;
}
