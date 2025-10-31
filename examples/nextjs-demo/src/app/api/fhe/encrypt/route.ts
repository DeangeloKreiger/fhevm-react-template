import { NextRequest, NextResponse } from 'next/server';
import { createFhevmClient, encryptInput } from 'fhevm-sdk';

/**
 * API Route: Encrypt a value using FHEVM
 * POST /api/fhe/encrypt
 */
export async function POST(request: NextRequest) {
  try {
    const { value, type = 'uint32' } = await request.json();

    if (value === undefined || value === null) {
      return NextResponse.json(
        { success: false, error: 'Value is required' },
        { status: 400 }
      );
    }

    // Initialize FHEVM client
    const client = await createFhevmClient({
      network: 'sepolia',
      gatewayUrl: process.env.GATEWAY_URL || 'https://gateway.zama.ai',
      contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0xD90c73b42952565F334E5FB6C349B0005ac06669',
    });

    // Encrypt the value
    const encrypted = await encryptInput(client, value, type);

    return NextResponse.json({
      success: true,
      data: {
        encrypted: Array.from(encrypted.data),
        handles: encrypted.handles,
        type,
        originalValue: value,
      },
    });
  } catch (error) {
    console.error('Encryption error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Encryption failed',
      },
      { status: 500 }
    );
  }
}
