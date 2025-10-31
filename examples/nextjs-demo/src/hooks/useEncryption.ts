'use client';

import { useState, useCallback } from 'react';
import { encryptInput, FhevmClient } from 'fhevm-sdk';

export function useEncryption(client: FhevmClient | null) {
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const encrypt = useCallback(
    async (value: number, type: string = 'uint32') => {
      if (!client) {
        setError(new Error('FHEVM client not initialized'));
        return null;
      }

      setIsEncrypting(true);
      setError(null);

      try {
        const encrypted = await encryptInput(client, value, type);
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

  const encryptBatch = useCallback(
    async (values: number[], type: string = 'uint32') => {
      if (!client) {
        setError(new Error('FHEVM client not initialized'));
        return null;
      }

      setIsEncrypting(true);
      setError(null);

      try {
        const encrypted = await Promise.all(
          values.map(value => encryptInput(client, value, type))
        );
        return encrypted;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Batch encryption failed');
        setError(error);
        return null;
      } finally {
        setIsEncrypting(false);
      }
    },
    [client]
  );

  return {
    encrypt,
    encryptBatch,
    isEncrypting,
    error,
  };
}
