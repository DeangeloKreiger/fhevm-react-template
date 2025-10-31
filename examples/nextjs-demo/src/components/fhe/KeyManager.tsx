'use client';

import { useState, useEffect } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import styles from './KeyManager.module.css';

export default function KeyManager() {
  const [keyInfo, setKeyInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const fetchKeyInfo = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/keys');
      const data = await response.json();

      if (data.success) {
        setKeyInfo(data.data);
      } else {
        setError(data.error || 'Failed to fetch key information');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKeyInfo();
  }, []);

  return (
    <Card
      title="Key Management"
      subtitle="View FHEVM public key and network information"
      variant="elevated"
    >
      <div className={styles.container}>
        {loading && <p>Loading key information...</p>}

        {error && (
          <div className={styles.error}>
            <strong>Error:</strong> {error}
          </div>
        )}

        {keyInfo && (
          <div className={styles.info}>
            <div className={styles.row}>
              <span className={styles.label}>Network:</span>
              <span className={styles.value}>{keyInfo.network}</span>
            </div>
            <div className={styles.row}>
              <span className={styles.label}>Gateway URL:</span>
              <span className={styles.value}>{keyInfo.gatewayUrl}</span>
            </div>
            <div className={styles.row}>
              <span className={styles.label}>Contract Address:</span>
              <span className={styles.value}>{keyInfo.contractAddress}</span>
            </div>
            <div className={styles.row}>
              <span className={styles.label}>Status:</span>
              <span className={`${styles.value} ${styles.status}`}>
                <span className={styles.statusDot}></span>
                {keyInfo.status}
              </span>
            </div>
          </div>
        )}

        <Button
          onClick={fetchKeyInfo}
          loading={loading}
          variant="secondary"
          className={styles.refreshButton}
        >
          Refresh
        </Button>

        <div className={styles.note}>
          💡 The public key is used to encrypt data before sending to smart contracts.
          The corresponding private key never leaves the secure gateway.
        </div>
      </div>
    </Card>
  );
}
