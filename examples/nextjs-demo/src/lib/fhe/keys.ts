/**
 * Key management utilities for FHEVM
 */

export interface KeyInfo {
  network: string;
  gatewayUrl: string;
  contractAddress: string;
  publicKey?: string;
}

export async function getPublicKeyInfo(): Promise<KeyInfo> {
  return {
    network: process.env.NEXT_PUBLIC_NETWORK || 'sepolia',
    gatewayUrl: process.env.NEXT_PUBLIC_GATEWAY_URL || 'https://gateway.zama.ai',
    contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0xD90c73b42952565F334E5FB6C349B0005ac06669',
  };
}

export function validateKeyConfiguration(config: Partial<KeyInfo>): boolean {
  return !!(config.network && config.gatewayUrl && config.contractAddress);
}
