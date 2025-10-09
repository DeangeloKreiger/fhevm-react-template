'use client';

import { useState } from 'react';
import { useEncrypt } from 'fhevm-sdk/react';
import type { FhevmClient } from 'fhevm-sdk';
import styles from './EncryptionDemo.module.css';

interface Props {
  client: FhevmClient | null;
}

export default function EncryptionDemo({ client }: Props) {
  const [value, setValue] = useState<string>('');
  const [encrypted, setEncrypted] = useState<string>('');
  const { encrypt, isEncrypting, error } = useEncrypt(client);

  const handleEncrypt = async () => {
    if (!value || isNaN(Number(value))) {
      alert('Please enter a valid number');
      return;
    }

    const result = await encrypt(Number(value));
    if (result) {
      // Convert Uint8Array to hex string for display
      const hex = Array.from(result.data)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
      setEncrypted(hex);
    }
  };

  return (
    <div className={styles.container}>
      <h2>🔒 Encrypt a Value</h2>
      <p className={styles.description}>
        Encrypt a numeric value using FHEVM. The encrypted value can be sent to smart contracts
        for confidential computations.
      </p>

      <div className={styles.form}>
        <div className={styles.inputGroup}>
          <label htmlFor="value">Value to Encrypt:</label>
          <input
            id="value"
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter a number (e.g., 1000)"
            disabled={isEncrypting}
            className={styles.input}
          />
        </div>

        <button
          onClick={handleEncrypt}
          disabled={isEncrypting || !value}
          className={styles.button}
        >
          {isEncrypting ? (
            <>
              <span className={styles.spinner}></span>
              Encrypting...
            </>
          ) : (
            '🔒 Encrypt Value'
          )}
        </button>
      </div>

      {error && (
        <div className={styles.error}>
          <strong>Error:</strong> {error.message}
        </div>
      )}

      {encrypted && (
        <div className={styles.result}>
          <h3>✅ Encrypted Successfully!</h3>
          <div className={styles.output}>
            <label>Original Value:</label>
            <div className={styles.value}>{value}</div>
          </div>
          <div className={styles.output}>
            <label>Encrypted Data (hex):</label>
            <div className={styles.encrypted}>
              {encrypted.slice(0, 64)}...
              <span className={styles.length}>({encrypted.length} chars)</span>
            </div>
          </div>
          <p className={styles.note}>
            💡 This encrypted value can now be sent to your smart contract for confidential processing!
          </p>
        </div>
      )}

      <div className={styles.example}>
        <h4>Example Usage:</h4>
        <pre>
{`const { encrypt } = useEncrypt(client);

const handleSubmit = async () => {
  const encrypted = await encrypt(1000);

  // Send to contract
  await contract.setPrivateValue(
    encrypted.data,
    encrypted.handles
  );
};`}
        </pre>
      </div>
    </div>
  );
}
