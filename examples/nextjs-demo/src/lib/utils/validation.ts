/**
 * Validation utilities for FHE operations
 */

import type { FHEDataType } from '../fhe/types';

export function validateNumericInput(value: any, type: FHEDataType = 'uint32'): boolean {
  const num = Number(value);

  if (isNaN(num)) return false;
  if (!Number.isFinite(num)) return false;

  switch (type) {
    case 'uint8':
      return num >= 0 && num <= 255 && Number.isInteger(num);
    case 'uint16':
      return num >= 0 && num <= 65535 && Number.isInteger(num);
    case 'uint32':
      return num >= 0 && num <= 4294967295 && Number.isInteger(num);
    case 'uint64':
      return num >= 0 && Number.isInteger(num);
    case 'int8':
      return num >= -128 && num <= 127 && Number.isInteger(num);
    case 'int16':
      return num >= -32768 && num <= 32767 && Number.isInteger(num);
    case 'int32':
      return num >= -2147483648 && num <= 2147483647 && Number.isInteger(num);
    case 'int64':
      return Number.isInteger(num);
    case 'bool':
      return num === 0 || num === 1;
    default:
      return false;
  }
}

export function validateContractAddress(address: string): boolean {
  if (!address) return false;
  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) return false;
  return true;
}

export function validateGatewayUrl(url: string): boolean {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

export function validateNetwork(network: string): boolean {
  const validNetworks = ['sepolia', 'mainnet', 'local', 'hardhat'];
  return validNetworks.includes(network.toLowerCase());
}

export interface ValidationErrors {
  [key: string]: string;
}

export function validateFHEConfig(config: {
  network?: string;
  gatewayUrl?: string;
  contractAddress?: string;
}): ValidationErrors {
  const errors: ValidationErrors = {};

  if (config.network && !validateNetwork(config.network)) {
    errors.network = 'Invalid network. Must be one of: sepolia, mainnet, local, hardhat';
  }

  if (config.gatewayUrl && !validateGatewayUrl(config.gatewayUrl)) {
    errors.gatewayUrl = 'Invalid gateway URL. Must be a valid HTTPS URL';
  }

  if (config.contractAddress && !validateContractAddress(config.contractAddress)) {
    errors.contractAddress = 'Invalid contract address. Must be a valid Ethereum address';
  }

  return errors;
}
