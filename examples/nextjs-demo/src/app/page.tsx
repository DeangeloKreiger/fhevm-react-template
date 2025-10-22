'use client';

import { useState } from 'react';
import { useFhevmClient, useEncrypt, useDecrypt } from 'fhevm-sdk/react';
import EncryptionDemo from '@/components/EncryptionDemo';
import DecryptionDemo from '@/components/DecryptionDemo';
import styles from './page.module.css';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'encrypt' | 'decrypt'>('encrypt');

  const { client, isReady, error } = useFhevmClient({
    network: 'sepolia',
    contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0xD90c73b42952565F334E5FB6C349B0005ac06669',
  });

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>🔐 FHEVM SDK Demo</h1>
        <p>Next.js Integration Showcase</p>
      </header>

      <main className={styles.main}>
        {error && (
          <div className={styles.error}>
            <h3>⚠️ Error</h3>
            <p>{error.message}</p>
          </div>
        )}

        {!isReady && !error && (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Initializing FHEVM SDK...</p>
          </div>
        )}

        {isReady && (
          <>
            <div className={styles.status}>
              <span className={styles.statusDot}></span>
              <span>FHEVM Client Ready</span>
            </div>

            <div className={styles.tabs}>
              <button
                className={`${styles.tab} ${activeTab === 'encrypt' ? styles.active : ''}`}
                onClick={() => setActiveTab('encrypt')}
              >
                🔒 Encryption
              </button>
              <button
                className={`${styles.tab} ${activeTab === 'decrypt' ? styles.active : ''}`}
                onClick={() => setActiveTab('decrypt')}
              >
                🔓 Decryption
              </button>
            </div>

            <div className={styles.content}>
              {activeTab === 'encrypt' && <EncryptionDemo client={client} />}
              {activeTab === 'decrypt' && <DecryptionDemo client={client} />}
            </div>

            <div className={styles.info}>
              <h3>📚 Quick Start</h3>
              <pre className={styles.code}>
{`import { useFhevmClient, useEncrypt } from 'fhevm-sdk/react';

function MyComponent() {
  const { client, isReady } = useFhevmClient({
    network: 'sepolia',
    contractAddress: '0x...'
  });

  const { encrypt } = useEncrypt(client);

  const handleEncrypt = async (value: number) => {
    const encrypted = await encrypt(value);
    // Use encrypted.data with your contract
  };
}`}
              </pre>
            </div>
          </>
        )}
      </main>

      <footer className={styles.footer}>
        <p>
          Built with{' '}
          <a href="https://github.com/yourusername/fhevm-react-template" target="_blank" rel="noopener noreferrer">
            FHEVM SDK
          </a>
          {' '}for{' '}
          <a href="https://zama.ai" target="_blank" rel="noopener noreferrer">
            Zama
          </a>
        </p>
      </footer>
    </div>
  );
}
