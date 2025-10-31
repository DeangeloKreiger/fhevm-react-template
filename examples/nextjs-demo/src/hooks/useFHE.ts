'use client';

import { useState, useEffect } from 'react';
import { createFhevmClient, FhevmClient } from 'fhevm-sdk';

interface UseFHEConfig {
  network?: string;
  gatewayUrl?: string;
  contractAddress?: string;
  autoInit?: boolean;
}

export function useFHE(config: UseFHEConfig = {}) {
  const [client, setClient] = useState<FhevmClient | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);

  const initialize = async () => {
    if (isInitializing) return;

    setIsInitializing(true);
    setError(null);

    try {
      const fhevmClient = await createFhevmClient({
        network: config.network || 'sepolia',
        gatewayUrl: config.gatewayUrl,
        contractAddress: config.contractAddress,
      });

      setClient(fhevmClient);
      setIsReady(true);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to initialize FHEVM client');
      setError(error);
      setIsReady(false);
    } finally {
      setIsInitializing(false);
    }
  };

  useEffect(() => {
    if (config.autoInit !== false) {
      initialize();
    }
  }, [config.network, config.gatewayUrl, config.contractAddress]);

  return {
    client,
    isReady,
    error,
    isInitializing,
    initialize,
  };
}
