import { NextRequest, NextResponse } from 'next/server';
import { createFhevmClient, encryptInput, decryptOutput } from 'fhevm-sdk';

export async function POST(request: NextRequest) {
  try {
    const { action, value, encryptedData } = await request.json();

    const client = await createFhevmClient({
      network: 'sepolia',
      gatewayUrl: process.env.GATEWAY_URL || 'https://gateway.zama.ai',
      contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0xD90c73b42952565F334E5FB6C349B0005ac06669',
    });

    if (action === 'encrypt') {
      const encrypted = await encryptInput(client, value);
      return NextResponse.json({
        success: true,
        data: {
          encrypted: Array.from(encrypted.data),
          handles: encrypted.handles,
        },
      });
    }

    if (action === 'decrypt') {
      const decrypted = await decryptOutput(client, encryptedData);
      return NextResponse.json({
        success: true,
        data: decrypted,
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('FHE operation error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
