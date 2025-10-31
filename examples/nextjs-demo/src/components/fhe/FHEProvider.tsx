'use client';

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { createFhevmClient, FhevmClient } from 'fhevm-sdk';

interface FHEContextValue {
  client: FhevmClient | null;
  isReady: boolean;
  error: Error | null;
  reinitialize: () => Promise<void>;
}

const FHEContext = createContext<FHEContextValue | undefined>(undefined);

interface FHEProviderProps {
  children: ReactNode;
  network?: string;
  gatewayUrl?: string;
  contractAddress?: string;
}

export function FHEProvider({
  children,
  network = 'sepolia',
  gatewayUrl,
  contractAddress,
}: FHEProviderProps) {
  const [client, setClient] = useState<FhevmClient | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const initializeClient = async () => {
    try {
      setError(null);
      setIsReady(false);

      const fhevmClient = await createFhevmClient({
        network,
        gatewayUrl,
        contractAddress,
      });

      setClient(fhevmClient);
      setIsReady(true);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to initialize FHEVM client'));
      setIsReady(false);
    }
  };

  useEffect(() => {
    initializeClient();
  }, [network, gatewayUrl, contractAddress]);

  const reinitialize = async () => {
    await initializeClient();
  };

  return (
    <FHEContext.Provider value={{ client, isReady, error, reinitialize }}>
      {children}
    </FHEContext.Provider>
  );
}

export function useFHEContext() {
  const context = useContext(FHEContext);
  if (!context) {
    throw new Error('useFHEContext must be used within FHEProvider');
  }
  return context;
}
