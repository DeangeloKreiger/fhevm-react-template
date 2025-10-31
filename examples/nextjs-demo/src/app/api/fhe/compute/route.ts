import { NextRequest, NextResponse } from 'next/server';
import { createFhevmClient, encryptInput } from 'fhevm-sdk';

/**
 * API Route: Perform homomorphic computation
 * POST /api/fhe/compute
 */
export async function POST(request: NextRequest) {
  try {
    const { operation, values, contractAddress } = await request.json();

    if (!operation || !values || !Array.isArray(values)) {
      return NextResponse.json(
        { success: false, error: 'Operation and values array are required' },
        { status: 400 }
      );
    }

    // Initialize FHEVM client
    const client = await createFhevmClient({
      network: 'sepolia',
      gatewayUrl: process.env.GATEWAY_URL || 'https://gateway.zama.ai',
      contractAddress: contractAddress || process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0xD90c73b42952565F334E5FB6C349B0005ac06669',
    });

    // Encrypt all values
    const encryptedValues = await Promise.all(
      values.map(value => encryptInput(client, value))
    );

    return NextResponse.json({
      success: true,
      data: {
        operation,
        encryptedValues: encryptedValues.map(ev => ({
          encrypted: Array.from(ev.data),
          handles: ev.handles,
        })),
        message: `Encrypted ${values.length} values for ${operation} operation`,
      },
    });
  } catch (error) {
    console.error('Computation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Computation failed',
      },
      { status: 500 }
    );
  }
}
