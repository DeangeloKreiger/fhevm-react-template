/**
 * React hooks for FHEVM SDK
 *
 * @packageDocumentation
 */

import { useState, useEffect, useCallback } from 'react';
import { createFhevmClient, type FhevmClient, type FhevmClientConfig } from '../client';
import { encryptInput, type EncryptedValue } from '../encrypt';
import { decryptOutput } from '../decrypt';

/**
 * Hook to create and manage FHEVM client
 *
 * @example
 * ```typescript
 * function App() {
 *   const { client, isReady, error } = useFhevmClient({
 *     network: 'sepolia',
 *     contractAddress: '0x...'
 *   });
 *
 *   if (!isReady) return <div>Loading...</div>;
 *   return <div>Client ready!</div>;
 * }
 * ```
 */
export function useFhevmClient(config: FhevmClientConfig) {
  const [client, setClient] = useState<FhevmClient | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        const newClient = await createFhevmClient(config);
        if (!cancelled) {
          setClient(newClient);
          setIsReady(true);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error('Failed to initialize client'));
          setIsReady(false);
        }
      }
    }

    init();

    return () => {
      cancelled = true;
    };
  }, [config.network, config.contractAddress]);

  return { client, isReady, error };
}

/**
 * Hook for encrypting values
 *
 * @example
 * ```typescript
 * function TransactionForm() {
 *   const { client } = useFhevmClient({ ... });
 *   const { encrypt, isEncrypting, error } = useEncrypt(client);
 *
 *   const handleSubmit = async (value: number) => {
 *     const encrypted = await encrypt(value);
 *     // Send to contract
 *   };
 * }
 * ```
 */
export function useEncrypt(client: FhevmClient | null) {
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const encrypt = useCallback(
    async (value: number | bigint, contractAddress?: string): Promise<EncryptedValue | null> => {
      if (!client) {
        setError(new Error('Client not initialized'));
        return null;
      }

      setIsEncrypting(true);
      setError(null);

      try {
        const encrypted = await encryptInput(client, value, contractAddress);
        return encrypted;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Encryption failed');
        setError(error);
        return null;
      } finally {
        setIsEncrypting(false);
      }
    },
    [client]
  );

  return { encrypt, isEncrypting, error };
}

/**
 * Hook for decrypting values
 *
 * @example
 * ```typescript
 * function BalanceDisplay() {
 *   const { client } = useFhevmClient({ ... });
 *   const { decrypt, isDecrypting, error } = useDecrypt(client);
 *
 *   const handleDecrypt = async (handle: string) => {
 *     const value = await decrypt(handle);
 *     console.log(value);
 *   };
 * }
 * ```
 */
export function useDecrypt(client: FhevmClient | null) {
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const decrypt = useCallback(
    async (handle: string, contractAddress?: string): Promise<bigint | null> => {
      if (!client) {
        setError(new Error('Client not initialized'));
        return null;
      }

      setIsDecrypting(true);
      setError(null);

      try {
        const decrypted = await decryptOutput(client, handle, contractAddress);
        return decrypted;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Decryption failed');
        setError(error);
        return null;
      } finally {
        setIsDecrypting(false);
      }
    },
    [client]
  );

  return { decrypt, isDecrypting, error };
}

/**
 * Hook for encrypted input state management
 *
 * @example
 * ```typescript
 * function PrivateInput() {
 *   const { client } = useFhevmClient({ ... });
 *   const { value, encrypted, setValue, isEncrypting } = useEncryptedInput(client);
 *
 *   return (
 *     <input
 *       type="number"
 *       value={value}
 *       onChange={(e) => setValue(Number(e.target.value))}
 *     />
 *   );
 * }
 * ```
 */
export function useEncryptedInput(client: FhevmClient | null) {
  const [value, setValue] = useState<number>(0);
  const [encrypted, setEncrypted] = useState<EncryptedValue | null>(null);
  const { encrypt, isEncrypting, error } = useEncrypt(client);

  useEffect(() => {
    if (value !== 0 && client) {
      encrypt(value).then(setEncrypted);
    }
  }, [value, client, encrypt]);

  return {
    value,
    encrypted,
    setValue,
    isEncrypting,
    error,
  };
}
