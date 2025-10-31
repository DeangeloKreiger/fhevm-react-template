/**
 * API type definitions
 */

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface EncryptionRequest {
  value: number;
  type?: string;
}

export interface EncryptionResponse {
  encrypted: number[];
  handles: any;
  type: string;
  originalValue: number;
}

export interface DecryptionRequest {
  encryptedData: any;
  contractAddress?: string;
}

export interface DecryptionResponse {
  decrypted: number | boolean;
}

export interface ComputationRequest {
  operation: 'add' | 'subtract' | 'multiply' | 'divide';
  values: number[];
  contractAddress?: string;
}

export interface ComputationResponse {
  operation: string;
  encryptedValues: Array<{
    encrypted: number[];
    handles: any;
  }>;
  message: string;
}

export interface KeyInfoResponse {
  network: string;
  gatewayUrl: string;
  contractAddress: string;
  status: string;
  publicKey?: string;
}
