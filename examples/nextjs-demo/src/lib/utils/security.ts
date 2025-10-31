/**
 * Security utilities for FHE operations
 */

export function sanitizeInput(value: any): number {
  const num = Number(value);
  if (isNaN(num)) {
    throw new Error('Invalid numeric input');
  }
  return num;
}

export function validateAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

export function validateEncryptedData(data: any): boolean {
  if (!data) return false;
  if (data instanceof Uint8Array) return data.length > 0;
  if (Array.isArray(data)) return data.length > 0;
  return false;
}

export function secureCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

export function hashData(data: string): string {
  // Simple hash for demonstration - use crypto library in production
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(16);
}
