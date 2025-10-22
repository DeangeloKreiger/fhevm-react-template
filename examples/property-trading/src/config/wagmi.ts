import { http, createConfig } from '@wagmi/core'
import { sepolia } from '@wagmi/core/chains'
import { injected, walletConnect } from '@wagmi/connectors'

// Get WalletConnect Project ID from localStorage or environment variable
const getProjectId = () => {
  // Check if we're in a browser environment
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    const stored = localStorage.getItem('walletconnect_project_id')
    if (stored) return stored
  }

  const envId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID
  if (envId && envId !== 'YOUR_WALLETCONNECT_PROJECT_ID') {
    return envId
  }

  return null
}

const projectId = getProjectId()

// Create config with connectors
const connectors: any = projectId
  ? [injected(), walletConnect({ projectId })]
  : [injected()]

export const config = createConfig({
  chains: [sepolia],
  connectors,
  transports: {
    [sepolia.id]: http(),
  },
})

export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || '0x...'

// Helper functions to manage settings
export const setWalletConnectProjectId = (id: string) => {
  localStorage.setItem('walletconnect_project_id', id)
  // Need to reload page to apply changes
  window.location.reload()
}

export const getWalletConnectProjectId = () => {
  return localStorage.getItem('walletconnect_project_id') || ''
}

export const clearWalletConnectProjectId = () => {
  localStorage.removeItem('walletconnect_project_id')
  window.location.reload()
}
