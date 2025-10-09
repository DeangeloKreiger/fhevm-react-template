'use client';

import { useState } from 'react';
import { useDecrypt } from 'fhevm-sdk/react';
import type { FhevmClient } from 'fhevm-sdk';
import styles from './DecryptionDemo.module.css';

interface Props {
  client: FhevmClient | null;
}

export default function DecryptionDemo({ client }: Props) {
  const [handle, setHandle] = useState<string>('');
  const [decrypted, setDecrypted] = useState<string>('');
  const { decrypt, isDecrypting, error } = useDecrypt(client);

  const handleDecrypt = async () => {
    if (!handle) {
      alert('Please enter a handle');
      return;
    }

    const result = await decrypt(handle);
    if (result !== null) {
      setDecrypted(result.toString());
    }
  };

  return (
    <div className={styles.container}>
      <h2>🔓 Decrypt a Value</h2>
      <p className={styles.description}>
        Decrypt an encrypted handle from a smart contract. You must have permission
        to decrypt the value.
      </p>

      <div className={styles.form}>
        <div className={styles.inputGroup}>
          <label htmlFor="handle">Encrypted Handle:</label>
          <input
            id="handle"
            type="text"
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            placeholder="0x... (handle from contract)"
            disabled={isDecrypting}
            className={styles.input}
          />
          <small className={styles.hint}>
            Enter the encrypted handle returned by your smart contract
          </small>
        </div>

        <button
          onClick={handleDecrypt}
          disabled={isDecrypting || !handle}
          className={styles.button}
        >
          {isDecrypting ? (
            <>
              <span className={styles.spinner}></span>
              Decrypting...
            </>
          ) : (
            '🔓 Decrypt Value'
          )}
        </button>
      </div>

      {error && (
        <div className={styles.error}>
          <strong>Error:</strong> {error.message}
          <p className={styles.errorHint}>
            💡 Make sure you have permission to decrypt this value
          </p>
        </div>
      )}

      {decrypted && (
        <div className={styles.result}>
          <h3>✅ Decrypted Successfully!</h3>
          <div className={styles.output}>
            <label>Original Encrypted Handle:</label>
            <div className={styles.handle}>
              {handle.slice(0, 20)}...{handle.slice(-10)}
            </div>
          </div>
          <div className={styles.output}>
            <label>Decrypted Value:</label>
            <div className={styles.value}>{decrypted}</div>
          </div>
          <p className={styles.note}>
            🎉 Successfully retrieved the confidential value!
          </p>
        </div>
      )}

      <div className={styles.example}>
        <h4>Example Usage:</h4>
        <pre>
{`const { decrypt } = useDecrypt(client);

const fetchPrivateBalance = async () => {
  // Get encrypted handle from contract
  const encryptedBalance = await contract.getBalance();

  // Decrypt it
  const balance = await decrypt(encryptedBalance);

  console.log('Balance:', balance.toString());
};`}
        </pre>
      </div>

      <div className={styles.info}>
        <h4>ℹ️ About Decryption</h4>
        <ul>
          <li>Decryption requires permission from the smart contract</li>
          <li>Only authorized addresses can decrypt specific values</li>
          <li>The gateway handles the decryption process securely</li>
          <li>Decrypted values are never exposed on-chain</li>
        </ul>
      </div>
    </div>
  );
}
