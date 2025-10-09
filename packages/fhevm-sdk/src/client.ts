import { BrowserProvider, JsonRpcProvider, JsonRpcSigner } from 'ethers';
import { createInstance, FhevmInstance, initFhevm } from 'fhevmjs';

export interface FhevmClientConfig {
  network: 'sepolia' | 'localhost' | string;
  gatewayUrl?: string;
  contractAddress?: string;
  provider?: BrowserProvider | JsonRpcProvider;
  aclAddress?: string;
}

export interface FhevmClient {
  instance: FhevmInstance;
  provider: BrowserProvider | JsonRpcProvider;
  signer?: JsonRpcSigner;
  config: FhevmClientConfig;
  isReady: boolean;
}

/**
 * Creates and initializes an FHEVM client
 *
 * @example
 * ```typescript
 * const client = await createFhevmClient({
 *   network: 'sepolia',
 *   contractAddress: '0x...'
 * });
 * ```
 */
export async function createFhevmClient(
  config: FhevmClientConfig
): Promise<FhevmClient> {
  // Initialize FHEVM
  await initFhevm();

  // Setup provider
  let provider: BrowserProvider | JsonRpcProvider;
  let signer: JsonRpcSigner | undefined;

  if (config.provider) {
    provider = config.provider;
  } else if (typeof window !== 'undefined' && window.ethereum) {
    provider = new BrowserProvider(window.ethereum);
    signer = await provider.getSigner();
  } else {
    throw new Error('No provider available. Please provide a provider or ensure window.ethereum exists.');
  }

  // Network configuration
  const networkConfig = getNetworkConfig(config.network);

  // Create FHEVM instance
  const instance = await createInstance({
    chainId: networkConfig.chainId,
    network: window.ethereum,
    gatewayUrl: config.gatewayUrl || networkConfig.gatewayUrl,
    aclAddress: config.aclAddress || networkConfig.aclAddress,
  });

  return {
    instance,
    provider,
    signer,
    config,
    isReady: true,
  };
}

/**
 * Get network configuration
 */
function getNetworkConfig(network: string) {
  const configs: Record<string, any> = {
    sepolia: {
      chainId: 11155111,
      gatewayUrl: 'https://gateway.sepolia.zama.ai',
      aclAddress: '0x...', // Add actual ACL address
    },
    localhost: {
      chainId: 31337,
      gatewayUrl: 'http://localhost:8545',
      aclAddress: '0x...', // Add local ACL address
    },
  };

  return configs[network] || configs.sepolia;
}

/**
 * Check if client is ready
 */
export function isClientReady(client: FhevmClient | null): boolean {
  return client !== null && client.isReady;
}
