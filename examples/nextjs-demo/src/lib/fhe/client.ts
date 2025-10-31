import { createFhevmClient as createClient, FhevmClient } from 'fhevm-sdk';

/**
 * Create and configure an FHEVM client instance
 */
export async function createFhevmClient(config: {
  network?: string;
  gatewayUrl?: string;
  contractAddress?: string;
}): Promise<FhevmClient> {
  return await createClient({
    network: config.network || 'sepolia',
    gatewayUrl: config.gatewayUrl || process.env.NEXT_PUBLIC_GATEWAY_URL,
    contractAddress: config.contractAddress || process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
  });
}

/**
 * Singleton client instance for reuse
 */
let clientInstance: FhevmClient | null = null;

export async function getOrCreateClient(config?: {
  network?: string;
  gatewayUrl?: string;
  contractAddress?: string;
}): Promise<FhevmClient> {
  if (!clientInstance) {
    clientInstance = await createFhevmClient(config || {});
  }
  return clientInstance;
}

export function resetClient(): void {
  clientInstance = null;
}
