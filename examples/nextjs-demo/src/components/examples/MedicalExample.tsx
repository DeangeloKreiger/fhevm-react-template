'use client';

import { useState } from 'react';
import { useEncrypt } from 'fhevm-sdk/react';
import type { FhevmClient } from 'fhevm-sdk';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import styles from './MedicalExample.module.css';

interface Props {
  client: FhevmClient | null;
}

export default function MedicalExample({ client }: Props) {
  const [bloodPressure, setBloodPressure] = useState<string>('');
  const [heartRate, setHeartRate] = useState<string>('');
  const [glucose, setGlucose] = useState<string>('');
  const [encryptedData, setEncryptedData] = useState<any>(null);

  const { encrypt, isEncrypting } = useEncrypt(client);

  const handleEncryptHealthData = async () => {
    if (!bloodPressure || !heartRate || !glucose) {
      alert('Please fill in all health metrics');
      return;
    }

    try {
      const encBP = await encrypt(Number(bloodPressure));
      const encHR = await encrypt(Number(heartRate));
      const encGlucose = await encrypt(Number(glucose));

      if (encBP && encHR && encGlucose) {
        setEncryptedData({
          bloodPressure: Array.from(encBP.data).slice(0, 16).map(b => b.toString(16).padStart(2, '0')).join(''),
          heartRate: Array.from(encHR.data).slice(0, 16).map(b => b.toString(16).padStart(2, '0')).join(''),
          glucose: Array.from(encGlucose.data).slice(0, 16).map(b => b.toString(16).padStart(2, '0')).join(''),
        });
      }
    } catch (error) {
      console.error('Encryption error:', error);
      alert('Failed to encrypt health data');
    }
  };

  return (
    <Card
      title="Private Medical Records"
      subtitle="Confidential health data storage and analysis"
      variant="elevated"
    >
      <div className={styles.container}>
        <div className={styles.form}>
          <Input
            label="Blood Pressure (systolic)"
            type="number"
            value={bloodPressure}
            onChange={(e) => setBloodPressure(e.target.value)}
            placeholder="e.g., 120"
            helperText="mmHg"
            disabled={isEncrypting}
          />
          <Input
            label="Heart Rate"
            type="number"
            value={heartRate}
            onChange={(e) => setHeartRate(e.target.value)}
            placeholder="e.g., 75"
            helperText="bpm"
            disabled={isEncrypting}
          />
          <Input
            label="Blood Glucose"
            type="number"
            value={glucose}
            onChange={(e) => setGlucose(e.target.value)}
            placeholder="e.g., 95"
            helperText="mg/dL"
            disabled={isEncrypting}
          />
        </div>

        <Button
          onClick={handleEncryptHealthData}
          loading={isEncrypting}
          disabled={!bloodPressure || !heartRate || !glucose}
          className={styles.button}
        >
          🔒 Encrypt Health Data
        </Button>

        {encryptedData && (
          <div className={styles.results}>
            <h3>✅ Health Data Encrypted</h3>
            <div className={styles.metric}>
              <span className={styles.label}>Blood Pressure:</span>
              <code className={styles.value}>{encryptedData.bloodPressure}...</code>
            </div>
            <div className={styles.metric}>
              <span className={styles.label}>Heart Rate:</span>
              <code className={styles.value}>{encryptedData.heartRate}...</code>
            </div>
            <div className={styles.metric}>
              <span className={styles.label}>Blood Glucose:</span>
              <code className={styles.value}>{encryptedData.glucose}...</code>
            </div>
          </div>
        )}

        <div className={styles.note}>
          💡 <strong>Use Case:</strong> Medical records can be stored on-chain in encrypted form.
          Authorized doctors can perform analysis and comparisons without seeing the raw data,
          preserving patient privacy while enabling healthcare services.
        </div>

        <div className={styles.features}>
          <h4>Key Features:</h4>
          <ul>
            <li>✓ Patient data remains confidential</li>
            <li>✓ Authorized analysis without decryption</li>
            <li>✓ Compliance with privacy regulations</li>
            <li>✓ Tamper-proof medical records</li>
          </ul>
        </div>
      </div>
    </Card>
  );
}
