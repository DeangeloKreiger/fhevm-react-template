import { NextRequest, NextResponse } from 'next/server';
import { createFhevmClient } from 'fhevm-sdk';

/**
 * API Route: Manage FHEVM keys
 * GET /api/keys - Get public key information
 */
export async function GET(request: NextRequest) {
  try {
    const client = await createFhevmClient({
      network: 'sepolia',
      gatewayUrl: process.env.GATEWAY_URL || 'https://gateway.zama.ai',
      contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0xD90c73b42952565F334E5FB6C349B0005ac06669',
    });

    // Get public key info (if available from client)
    const keyInfo = {
      network: 'sepolia',
      gatewayUrl: process.env.GATEWAY_URL || 'https://gateway.zama.ai',
      contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0xD90c73b42952565F334E5FB6C349B0005ac06669',
      status: 'initialized',
    };

    return NextResponse.json({
      success: true,
      data: keyInfo,
    });
  } catch (error) {
    console.error('Key management error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to retrieve key information',
      },
      { status: 500 }
    );
  }
}
