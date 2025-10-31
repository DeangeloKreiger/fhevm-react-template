'use client';

import { useState } from 'react';
import { useEncrypt } from 'fhevm-sdk/react';
import type { FhevmClient } from 'fhevm-sdk';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card from '../ui/Card';
import styles from './ComputationDemo.module.css';

interface Props {
  client: FhevmClient | null;
}

export default function ComputationDemo({ client }: Props) {
  const [value1, setValue1] = useState<string>('');
  const [value2, setValue2] = useState<string>('');
  const [operation, setOperation] = useState<'add' | 'subtract' | 'multiply'>('add');
  const [result, setResult] = useState<string>('');
  const { encrypt, isEncrypting } = useEncrypt(client);

  const handleCompute = async () => {
    if (!value1 || !value2 || isNaN(Number(value1)) || isNaN(Number(value2))) {
      alert('Please enter valid numbers');
      return;
    }

    try {
      // Encrypt both values
      const encrypted1 = await encrypt(Number(value1));
      const encrypted2 = await encrypt(Number(value2));

      if (encrypted1 && encrypted2) {
        // In a real implementation, you would send these to a smart contract
        // that performs homomorphic computation
        setResult(`Encrypted ${operation} operation prepared. In production, send to smart contract for computation.`);
      }
    } catch (error) {
      console.error('Computation error:', error);
      alert('Computation failed');
    }
  };

  return (
    <Card
      title="Homomorphic Computation"
      subtitle="Perform operations on encrypted values without decryption"
      variant="elevated"
    >
      <div className={styles.container}>
        <div className={styles.inputs}>
          <Input
            label="First Value"
            type="number"
            value={value1}
            onChange={(e) => setValue1(e.target.value)}
            placeholder="Enter first number"
            disabled={isEncrypting}
          />

          <div className={styles.operation}>
            <label>Operation</label>
            <select
              value={operation}
              onChange={(e) => setOperation(e.target.value as any)}
              className={styles.select}
              disabled={isEncrypting}
            >
              <option value="add">Addition (+)</option>
              <option value="subtract">Subtraction (-)</option>
              <option value="multiply">Multiplication (×)</option>
            </select>
          </div>

          <Input
            label="Second Value"
            type="number"
            value={value2}
            onChange={(e) => setValue2(e.target.value)}
            placeholder="Enter second number"
            disabled={isEncrypting}
          />
        </div>

        <Button
          onClick={handleCompute}
          loading={isEncrypting}
          disabled={!value1 || !value2}
          className={styles.button}
        >
          Compute on Encrypted Values
        </Button>

        {result && (
          <div className={styles.result}>
            <h4>Result:</h4>
            <p>{result}</p>
            <div className={styles.note}>
              💡 The computation happens on encrypted data. The smart contract never sees the actual values!
            </div>
          </div>
        )}

        <div className={styles.example}>
          <h4>Example Usage:</h4>
          <pre>
{`// Encrypt values
const enc1 = await encrypt(100);
const enc2 = await encrypt(50);

// Perform computation on-chain
const result = await contract.add(
  enc1.data, enc2.data
);

// Result is still encrypted!
const decrypted = await decrypt(result);`}
          </pre>
        </div>
      </div>
    </Card>
  );
}
