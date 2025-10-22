import type { FhevmClient } from '../client';

export async function waitForTransaction(client: FhevmClient, txHash: string) {
  return await client.provider.waitForTransaction(txHash);
}

export async function estimateGas(client: FhevmClient, transaction: any) {
  return await client.provider.estimateGas(transaction);
}
