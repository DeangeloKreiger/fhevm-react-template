import { readContract, writeContract, waitForTransactionReceipt } from '@wagmi/core'
import { config } from '../config/wagmi'
import { parseEther, formatEther } from 'viem'
import { CONTRACT_ABI, CONTRACT_ADDRESS } from '../config/contracts'

const ABI = CONTRACT_ABI

export interface Property {
  id: bigint
  owner: string
  propertyHash: string
  price: bigint
  isListed: boolean
  listedAt: bigint
}

export interface Transaction {
  propertyId: bigint
  seller: string
  buyer: string
  price: bigint
  timestamp: bigint
  completed: boolean
}

// Read functions
export async function getProperty(propertyId: number): Promise<Property> {
  const result = await readContract(config, {
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: ABI,
    functionName: 'getProperty',
    args: [BigInt(propertyId)],
  })

  const [id, owner, propertyHash, price, isListed, listedAt] = result as [bigint, string, string, bigint, boolean, bigint]

  return { id, owner, propertyHash, price, isListed, listedAt }
}

export async function getListedProperties(): Promise<bigint[]> {
  const result = await readContract(config, {
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: ABI,
    functionName: 'getListedProperties',
  })

  return result as bigint[]
}

export async function getPropertiesByOwner(owner: `0x${string}` | string): Promise<bigint[]> {
  const result = await readContract(config, {
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'getPropertiesByOwner',
    args: [owner as any as `0x${string}`],
  })

  return result as bigint[]
}

export async function getTransactionsByUser(user: `0x${string}` | string): Promise<bigint[]> {
  const result = await readContract(config, {
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'getTransactionsByUser',
    args: [user as any as `0x${string}`],
  })

  return result as bigint[]
}

export async function getTransaction(txId: number): Promise<Transaction> {
  const result = await readContract(config, {
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: ABI,
    functionName: 'getTransaction',
    args: [BigInt(txId)],
  })

  const [propertyId, seller, buyer, price, timestamp, completed] = result as [bigint, string, string, bigint, bigint, boolean]

  return { propertyId, seller, buyer, price, timestamp, completed }
}

export async function getTotalProperties(): Promise<bigint> {
  const result = await readContract(config, {
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: ABI,
    functionName: 'getTotalProperties',
  })

  return result as bigint
}

// Write functions
export async function registerProperty(propertyHash: string, priceInEth: string) {
  try {
    const hash = await writeContract(config, {
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: ABI,
      functionName: 'registerProperty',
      args: [propertyHash, parseEther(priceInEth)],
      gas: BigInt(500000),
    })

    const receipt = await waitForTransactionReceipt(config, { hash })
    return receipt
  } catch (error: any) {
    const errorMessage = error?.message || ''

    if (errorMessage.includes('Property hash cannot be empty')) {
      throw new Error('Property hash is required.')
    }
    if (errorMessage.includes('Price must be greater than 0')) {
      throw new Error('Price must be greater than 0 ETH.')
    }
    if (errorMessage.includes('User rejected')) {
      throw new Error('Transaction was cancelled.')
    }
    if (errorMessage.includes('insufficient funds')) {
      throw new Error('Insufficient funds for gas fees.')
    }

    throw new Error('Failed to register property. Please try again.')
  }
}

export async function listProperty(propertyId: number) {
  try {
    const hash = await writeContract(config, {
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: ABI,
      functionName: 'listProperty',
      args: [BigInt(propertyId)],
      gas: BigInt(300000),
    })

    const receipt = await waitForTransactionReceipt(config, { hash })
    return receipt
  } catch (error: any) {
    const errorMessage = error?.message || ''

    if (errorMessage.includes('Not property owner')) {
      throw new Error('You are not the owner of this property.')
    }
    if (errorMessage.includes('Property already listed')) {
      throw new Error('This property is already listed for sale.')
    }
    if (errorMessage.includes('User rejected')) {
      throw new Error('Transaction was cancelled.')
    }

    throw new Error('Failed to list property. Please try again.')
  }
}

export async function delistProperty(propertyId: number) {
  try {
    const hash = await writeContract(config, {
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: ABI,
      functionName: 'delistProperty',
      args: [BigInt(propertyId)],
      gas: BigInt(300000),
    })

    const receipt = await waitForTransactionReceipt(config, { hash })
    return receipt
  } catch (error: any) {
    const errorMessage = error?.message || ''

    if (errorMessage.includes('Not property owner')) {
      throw new Error('You are not the owner of this property.')
    }
    if (errorMessage.includes('Property not listed')) {
      throw new Error('This property is not currently listed.')
    }
    if (errorMessage.includes('User rejected')) {
      throw new Error('Transaction was cancelled.')
    }

    throw new Error('Failed to delist property. Please try again.')
  }
}

export async function updatePrice(propertyId: number, newPriceInEth: string) {
  try {
    const hash = await writeContract(config, {
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: ABI,
      functionName: 'updatePrice',
      args: [BigInt(propertyId), parseEther(newPriceInEth)],
      gas: BigInt(300000),
    })

    const receipt = await waitForTransactionReceipt(config, { hash })
    return receipt
  } catch (error: any) {
    const errorMessage = error?.message || ''

    if (errorMessage.includes('Not property owner')) {
      throw new Error('You are not the owner of this property.')
    }
    if (errorMessage.includes('Price must be greater than 0')) {
      throw new Error('Price must be greater than 0 ETH.')
    }
    if (errorMessage.includes('User rejected')) {
      throw new Error('Transaction was cancelled.')
    }

    throw new Error('Failed to update price. Please try again.')
  }
}

export async function purchaseProperty(propertyId: number, priceInEth: string) {
  try {
    const hash = await writeContract(config, {
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: ABI,
      functionName: 'purchaseProperty',
      args: [BigInt(propertyId)],
      value: parseEther(priceInEth),
      gas: BigInt(500000),
    })

    const receipt = await waitForTransactionReceipt(config, { hash })
    return receipt
  } catch (error: any) {
    // Parse contract revert reasons into user-friendly messages
    const errorMessage = error?.message || ''

    if (errorMessage.includes('Cannot buy your own property')) {
      throw new Error('You cannot purchase your own property. Please use a different wallet address.')
    }
    if (errorMessage.includes('Property not listed')) {
      throw new Error('This property is not listed for sale.')
    }
    if (errorMessage.includes('Insufficient payment')) {
      throw new Error('Payment amount is insufficient. Please check the property price.')
    }
    if (errorMessage.includes('Property does not exist')) {
      throw new Error('Property not found. It may have been removed.')
    }
    if (errorMessage.includes('insufficient funds')) {
      throw new Error('Insufficient funds in your wallet. Please add more ETH.')
    }
    if (errorMessage.includes('User rejected')) {
      throw new Error('Transaction was cancelled.')
    }

    // Generic error
    throw new Error('Transaction failed. Please try again or contact support.')
  }
}

// Helper function
export function formatPrice(price: bigint): string {
  return formatEther(price)
}
