import { createFhevmClient, encryptInput, decryptOutput } from 'fhevm-sdk';

/**
 * Server-side FHE operations
 * These functions are designed to be used in API routes
 */

export async function serverEncrypt(
  value: number,
  config: {
    network?: string;
    gatewayUrl?: string;
    contractAddress?: string;
  } = {}
) {
  const client = await createFhevmClient({
    network: config.network || 'sepolia',
    gatewayUrl: config.gatewayUrl || process.env.GATEWAY_URL,
    contractAddress: config.contractAddress || process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
  });

  return await encryptInput(client, value);
}

export async function serverDecrypt(
  encryptedData: any,
  config: {
    network?: string;
    gatewayUrl?: string;
    contractAddress?: string;
  } = {}
) {
  const client = await createFhevmClient({
    network: config.network || 'sepolia',
    gatewayUrl: config.gatewayUrl || process.env.GATEWAY_URL,
    contractAddress: config.contractAddress || process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
  });

  return await decryptOutput(client, encryptedData);
}
