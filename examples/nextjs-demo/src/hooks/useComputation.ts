'use client';

import { useState, useCallback } from 'react';
import { encryptInput, FhevmClient } from 'fhevm-sdk';

type Operation = 'add' | 'subtract' | 'multiply' | 'divide';

export function useComputation(client: FhevmClient | null) {
  const [isComputing, setIsComputing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const prepareComputation = useCallback(
    async (operation: Operation, values: number[], type: string = 'uint32') => {
      if (!client) {
        setError(new Error('FHEVM client not initialized'));
        return null;
      }

      if (values.length < 2) {
        setError(new Error('At least 2 values required for computation'));
        return null;
      }

      setIsComputing(true);
      setError(null);

      try {
        // Encrypt all values
        const encryptedValues = await Promise.all(
          values.map(value => encryptInput(client, value, type))
        );

        return {
          operation,
          encryptedValues,
          type,
        };
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Computation preparation failed');
        setError(error);
        return null;
      } finally {
        setIsComputing(false);
      }
    },
    [client]
  );

  const add = useCallback(
    async (a: number, b: number, type: string = 'uint32') => {
      return prepareComputation('add', [a, b], type);
    },
    [prepareComputation]
  );

  const subtract = useCallback(
    async (a: number, b: number, type: string = 'uint32') => {
      return prepareComputation('subtract', [a, b], type);
    },
    [prepareComputation]
  );

  const multiply = useCallback(
    async (a: number, b: number, type: string = 'uint32') => {
      return prepareComputation('multiply', [a, b], type);
    },
    [prepareComputation]
  );

  return {
    prepareComputation,
    add,
    subtract,
    multiply,
    isComputing,
    error,
  };
}
