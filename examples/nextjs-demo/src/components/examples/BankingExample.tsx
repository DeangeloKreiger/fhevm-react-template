'use client';

import { useState } from 'react';
import { useEncrypt, useDecrypt } from 'fhevm-sdk/react';
import type { FhevmClient } from 'fhevm-sdk';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import styles from './BankingExample.module.css';

interface Props {
  client: FhevmClient | null;
}

export default function BankingExample({ client }: Props) {
  const [balance, setBalance] = useState<string>('');
  const [transferAmount, setTransferAmount] = useState<string>('');
  const [recipient, setRecipient] = useState<string>('');
  const [encryptedBalance, setEncryptedBalance] = useState<string>('');

  const { encrypt, isEncrypting } = useEncrypt(client);
  const { decrypt, isDecrypting } = useDecrypt(client);

  const handleSetBalance = async () => {
    if (!balance || isNaN(Number(balance))) {
      alert('Please enter a valid balance');
      return;
    }

    const encrypted = await encrypt(Number(balance));
    if (encrypted) {
      const hex = Array.from(encrypted.data)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
      setEncryptedBalance(hex);
    }
  };

  const handleTransfer = async () => {
    if (!transferAmount || isNaN(Number(transferAmount)) || !recipient) {
      alert('Please enter valid transfer details');
      return;
    }

    const encrypted = await encrypt(Number(transferAmount));
    if (encrypted) {
      alert(`Transfer of ${transferAmount} to ${recipient} encrypted successfully! In production, this would be sent to the smart contract.`);
    }
  };

  return (
    <Card
      title="Private Banking Example"
      subtitle="Confidential balance and transfer operations"
      variant="elevated"
    >
      <div className={styles.container}>
        <div className={styles.section}>
          <h3>💰 Set Private Balance</h3>
          <div className={styles.form}>
            <Input
              label="Account Balance"
              type="number"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              placeholder="Enter balance amount"
              disabled={isEncrypting}
            />
            <Button
              onClick={handleSetBalance}
              loading={isEncrypting}
              disabled={!balance}
            >
              Encrypt Balance
            </Button>
          </div>

          {encryptedBalance && (
            <div className={styles.result}>
              <p className={styles.success}>✅ Balance encrypted successfully!</p>
              <p className={styles.encrypted}>
                {encryptedBalance.slice(0, 32)}...
              </p>
            </div>
          )}
        </div>

        <div className={styles.divider}></div>

        <div className={styles.section}>
          <h3>💸 Private Transfer</h3>
          <div className={styles.form}>
            <Input
              label="Recipient Address"
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="0x..."
              disabled={isEncrypting}
            />
            <Input
              label="Transfer Amount"
              type="number"
              value={transferAmount}
              onChange={(e) => setTransferAmount(e.target.value)}
              placeholder="Enter amount"
              disabled={isEncrypting}
            />
            <Button
              onClick={handleTransfer}
              loading={isEncrypting}
              disabled={!transferAmount || !recipient}
            >
              Execute Private Transfer
            </Button>
          </div>
        </div>

        <div className={styles.note}>
          💡 <strong>Use Case:</strong> Private banking allows users to keep their balances and
          transactions confidential while still enabling verification and compliance checks by
          authorized parties.
        </div>
      </div>
    </Card>
  );
}
