import { NextRequest, NextResponse } from 'next/server';
import { createFhevmClient, decryptOutput } from 'fhevm-sdk';

/**
 * API Route: Decrypt encrypted data using FHEVM
 * POST /api/fhe/decrypt
 */
export async function POST(request: NextRequest) {
  try {
    const { encryptedData, contractAddress } = await request.json();

    if (!encryptedData) {
      return NextResponse.json(
        { success: false, error: 'Encrypted data is required' },
        { status: 400 }
      );
    }

    // Initialize FHEVM client
    const client = await createFhevmClient({
      network: 'sepolia',
      gatewayUrl: process.env.GATEWAY_URL || 'https://gateway.zama.ai',
      contractAddress: contractAddress || process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0xD90c73b42952565F334E5FB6C349B0005ac06669',
    });

    // Decrypt the data
    const decrypted = await decryptOutput(client, encryptedData);

    return NextResponse.json({
      success: true,
      data: {
        decrypted,
      },
    });
  } catch (error) {
    console.error('Decryption error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Decryption failed',
      },
      { status: 500 }
    );
  }
}
