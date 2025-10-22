// Simplified initialization - catch errors early
console.log('=== MAIN.TS START ===')

// Global error catcher
window.addEventListener('error', (e) => {
  console.error('=== GLOBAL ERROR ===', e.message, e.filename, e.lineno)
  const app = document.getElementById('app')
  if (app) {
    app.innerHTML = `<div style="color:white;padding:20px;"><h1 style="color:red;">Error Loading Module</h1><pre>${e.message}\n${e.filename}:${e.lineno}</pre></div>`
  }
})

window.addEventListener('unhandledrejection', (e) => {
  console.error('=== PROMISE REJECTION ===', e.reason)
  const app = document.getElementById('app')
  if (app) {
    app.innerHTML = `<div style="color:white;padding:20px;"><h1 style="color:red;">Promise Error</h1><pre>${e.reason}</pre></div>`
  }
})

import './style.css'
import { getAccount, connect, disconnect, watchAccount } from '@wagmi/core'
import { config, setWalletConnectProjectId, getWalletConnectProjectId } from './config/wagmi'
import { injected } from '@wagmi/connectors'
import { showError, showSuccess, showInfo } from './utils/notifications'
import { loadingState } from './utils/loading'
import * as Contract from './utils/contract'
import type { Property } from './utils/contract'
import { CONTRACT_ADDRESS } from './config/contracts'

console.log('=== ALL IMPORTS SUCCESSFUL ===')
console.log('CONTRACT_ADDRESS:', CONTRACT_ADDRESS)

let currentAccount: string | undefined

// Initialize application with enhanced UI
function initializeApp() {
  console.log('=== initializeApp CALLED ===')
  const app = document.querySelector<HTMLDivElement>('#app')!

  console.log('=== APP ELEMENT FOUND ===', app)

  try {
    console.log('=== CREATING HTML ===')
    const html = createAppHTML()
    console.log('=== HTML CREATED, LENGTH:', html.length, '===')

    app.innerHTML = html
    console.log('=== HTML SET ===')

    console.log('=== SETTING UP EVENT LISTENERS ===')
    setupEventListeners()
    console.log('=== EVENT LISTENERS SET ===')

    console.log('=== CHECKING WALLET CONNECTION ===')
    checkWalletConnection()
    console.log('=== WALLET CHECK DONE ===')

    console.log('=== SHOWING INFO ===')
    showInfo('Welcome to Private Property Trading Platform')
    console.log('=== INFO SHOWN ===')
  } catch (error) {
    console.error('=== ERROR IN initializeApp ===', error)
    throw error // Re-throw to be caught by outer handler
  }
}

function createAppHTML(): string {
  return `
    <div class="min-h-screen">
      <header class="header">
        <div class="container mx-auto py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-info flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                </svg>
              </div>
              <div>
                <h1 class="text-xl font-bold text-gradient">Private Property Trading</h1>
                <p class="text-xs" style="color: var(--color-text-secondary)">Secure Blockchain Marketplace</p>
              </div>
            </div>

            <div id="wallet-section" class="flex items-center gap-3">
              <button id="settings-btn" class="btn-secondary p-2" title="Settings">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
              </button>

              <button id="connect-btn" class="btn-primary flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
                <span>Connect Wallet</span>
              </button>

              <div id="account-info" class="hidden">
                <div class="flex items-center gap-3 card py-2 px-4">
                  <div class="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-success flex items-center justify-center text-xs font-bold">
                    <span id="account-initial">?</span>
                  </div>
                  <span id="account-address" class="address-text text-sm"></span>
                  <button id="disconnect-btn" class="btn-secondary py-2 px-4 text-sm">Disconnect</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main class="container mx-auto py-8">
        <div class="flex gap-2 mb-8 border-b" style="border-color: var(--color-border)">
          <button id="tab-marketplace" class="tab-button tab-button-active flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            <span>Marketplace</span>
          </button>

          <button id="tab-my-properties" class="tab-button tab-button-inactive flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
            </svg>
            <span>My Properties</span>
          </button>

          <button id="tab-history" class="tab-button tab-button-inactive flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>History</span>
          </button>
        </div>

        <div id="marketplace-content" class="tab-content">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h2 class="text-2xl font-bold mb-1">Property Marketplace</h2>
              <p class="text-sm" style="color: var(--color-text-secondary)">Browse and purchase listed properties</p>
            </div>
            <button id="register-property-btn" class="btn-primary flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              </svg>
              <span>Register Property</span>
            </button>
          </div>

          <div id="listed-properties" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <p class="text-center col-span-full" style="color: var(--color-text-secondary)">Connect wallet to view properties</p>
          </div>
        </div>

        <div id="my-properties-content" class="tab-content hidden">
          <div class="mb-6">
            <h2 class="text-2xl font-bold mb-1">My Properties</h2>
            <p class="text-sm" style="color: var(--color-text-secondary)">Manage your property portfolio</p>
          </div>

          <div id="my-properties-list" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <p class="text-center col-span-full" style="color: var(--color-text-secondary)">No properties yet</p>
          </div>
        </div>

        <div id="history-content" class="tab-content hidden">
          <div class="mb-6">
            <h2 class="text-2xl font-bold mb-1">Transaction History</h2>
            <p class="text-sm" style="color: var(--color-text-secondary)">Complete audit trail of your transactions</p>
          </div>

          <div id="transaction-history" class="space-y-4">
            <p class="text-center" style="color: var(--color-text-secondary)">No transactions yet</p>
          </div>
        </div>
      </main>
    </div>
  `
}

function setupEventListeners() {
  document.getElementById('connect-btn')?.addEventListener('click', connectWallet)
  document.getElementById('disconnect-btn')?.addEventListener('click', disconnectWallet)
  document.getElementById('register-property-btn')?.addEventListener('click', showRegisterModal)
  document.getElementById('settings-btn')?.addEventListener('click', showSettingsModal)

  document.getElementById('tab-marketplace')?.addEventListener('click', () => switchTab('marketplace'))
  document.getElementById('tab-my-properties')?.addEventListener('click', () => switchTab('my-properties'))
  document.getElementById('tab-history')?.addEventListener('click', () => switchTab('history'))

  watchAccount(config, {
    onChange(account) {
      currentAccount = account.address
      updateWalletUI()
    },
  })
}

async function connectWallet() {
  try {
    loadingState.show('Connecting to wallet...')
    await connect(config, { connector: injected() })
    const account = getAccount(config)
    currentAccount = account.address
    updateWalletUI()
    showSuccess('Wallet connected successfully!')
    loadingState.hide()
  } catch (error: any) {
    loadingState.hide()
    showError(error.message || 'Failed to connect wallet')
  }
}

async function disconnectWallet() {
  try {
    await disconnect(config)
    currentAccount = undefined
    updateWalletUI()
    showInfo('Wallet disconnected')
  } catch (error: any) {
    showError(error.message || 'Failed to disconnect')
  }
}

function checkWalletConnection() {
  const account = getAccount(config)
  if (account.isConnected) {
    currentAccount = account.address
    updateWalletUI()
  }
}

function updateWalletUI() {
  const connectBtn = document.getElementById('connect-btn')
  const accountInfo = document.getElementById('account-info')
  const accountAddress = document.getElementById('account-address')
  const accountInitial = document.getElementById('account-initial')

  if (currentAccount) {
    connectBtn?.classList.add('hidden')
    accountInfo?.classList.remove('hidden')
    if (accountAddress) {
      const short = `${currentAccount.slice(0, 6)}...${currentAccount.slice(-4)}`
      accountAddress.textContent = short
    }
    if (accountInitial) {
      accountInitial.textContent = currentAccount.slice(2, 3).toUpperCase()
    }
    // Load properties when wallet is connected
    loadListedProperties()
    loadMyProperties()
  } else {
    connectBtn?.classList.remove('hidden')
    accountInfo?.classList.add('hidden')
  }
}

// Load listed properties from blockchain
async function loadListedProperties() {
  const container = document.getElementById('listed-properties')
  if (!container) return

  try {
    loadingState.show('Loading properties...')

    // Try to get total properties first
    const total = await Contract.getTotalProperties()
    console.log('Total properties:', total)

    if (total === BigInt(0)) {
      container.innerHTML = '<p class="text-center col-span-full" style="color: var(--color-text-secondary)">No properties registered yet. Register your first property!</p>'
      loadingState.hide()
      return
    }

    const propertyIds = await Contract.getListedProperties()

    if (propertyIds.length === 0) {
      container.innerHTML = '<p class="text-center col-span-full" style="color: var(--color-text-secondary)">No properties listed for sale yet</p>'
      loadingState.hide()
      return
    }

    const properties: Property[] = []
    for (const id of propertyIds) {
      try {
        const property = await Contract.getProperty(Number(id))
        properties.push(property)
      } catch (error) {
        console.error(`Failed to load property ${id}:`, error)
      }
    }

    container.innerHTML = properties.map(property => createPropertyCard(property, false)).join('')

    // Add event listeners for purchase buttons
    properties.forEach(property => {
      const btn = document.getElementById(`purchase-${property.id}`)
      btn?.addEventListener('click', () => handlePurchase(property))
    })

    loadingState.hide()
  } catch (error: any) {
    loadingState.hide()
    console.error('Error loading properties:', error)

    // Show user-friendly message
    const errorMsg = error?.message || 'Unknown error'
    if (errorMsg.includes('reverted') || errorMsg.includes('execution')) {
      container.innerHTML = `
        <div class="col-span-full card p-6 text-center">
          <p class="text-warning mb-2">⚠️ Contract Connection Issue</p>
          <p class="text-sm mb-4" style="color: var(--color-text-secondary)">
            Unable to read from the contract. This might be because:
          </p>
          <ul class="text-left text-sm max-w-md mx-auto" style="color: var(--color-text-secondary)">
            <li>• The contract ABI doesn't match the deployed contract</li>
            <li>• The contract address is incorrect</li>
            <li>• You're connected to the wrong network (should be Sepolia)</li>
          </ul>
          <p class="text-xs mt-4" style="color: var(--color-text-secondary)">
            Contract: <code class="font-mono">${CONTRACT_ADDRESS}</code>
          </p>
        </div>
      `
    } else {
      container.innerHTML = '<p class="text-center col-span-full" style="color: var(--color-error)">Failed to load properties</p>'
    }
  }
}

// Load user's properties from blockchain
async function loadMyProperties() {
  const container = document.getElementById('my-properties-list')
  if (!container || !currentAccount) return

  try {
    const propertyIds = await Contract.getPropertiesByOwner(currentAccount)

    if (propertyIds.length === 0) {
      container.innerHTML = '<p class="text-center col-span-full" style="color: var(--color-text-secondary)">You don\'t own any properties yet</p>'
      return
    }

    const properties: Property[] = []
    for (const id of propertyIds) {
      try {
        const property = await Contract.getProperty(Number(id))
        properties.push(property)
      } catch (error) {
        console.error(`Failed to load property ${id}:`, error)
      }
    }

    container.innerHTML = properties.map(property => createPropertyCard(property, true)).join('')

    // Add event listeners for list/delist buttons
    properties.forEach(property => {
      const listBtn = document.getElementById(`list-${property.id}`)
      const delistBtn = document.getElementById(`delist-${property.id}`)
      const updateBtn = document.getElementById(`update-price-${property.id}`)

      listBtn?.addEventListener('click', () => handleListProperty(property.id))
      delistBtn?.addEventListener('click', () => handleDelistProperty(property.id))
      updateBtn?.addEventListener('click', () => handleUpdatePrice(property))
    })
  } catch (error: any) {
    console.error('Error loading my properties:', error)
    container.innerHTML = '<p class="text-center col-span-full" style="color: var(--color-error)">Failed to load your properties</p>'
  }
}

// Create property card HTML
function createPropertyCard(property: Property, isOwner: boolean): string {
  const priceEth = Contract.formatPrice(property.price)
  const shortHash = `${property.propertyHash.slice(0, 10)}...${property.propertyHash.slice(-8)}`
  const ownerShort = `${property.owner.slice(0, 6)}...${property.owner.slice(-4)}`

  const listBadge = property.isListed
    ? '<span class="px-2 py-1 text-xs rounded-full bg-gradient-to-r from-success to-accent text-white">Listed</span>'
    : '<span class="px-2 py-1 text-xs rounded-full" style="background: var(--color-panel); color: var(--color-text-secondary)">Unlisted</span>'

  let actionButtons = ''
  if (isOwner) {
    if (property.isListed) {
      actionButtons = `
        <button id="delist-${property.id}" class="btn-secondary flex-1">Delist</button>
        <button id="update-price-${property.id}" class="btn-primary flex-1">Update Price</button>
      `
    } else {
      actionButtons = `
        <button id="list-${property.id}" class="btn-primary flex-1">List for Sale</button>
      `
    }
  } else if (property.isListed) {
    actionButtons = `
      <button id="purchase-${property.id}" class="btn-primary w-full">Purchase for ${priceEth} ETH</button>
    `
  }

  return `
    <div class="card p-6 hover-lift">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-bold">Property #${property.id}</h3>
        ${listBadge}
      </div>

      <div class="space-y-3 mb-5">
        <div>
          <p class="text-xs mb-1" style="color: var(--color-text-secondary)">Property Hash</p>
          <p class="text-sm font-mono">${shortHash}</p>
        </div>

        <div>
          <p class="text-xs mb-1" style="color: var(--color-text-secondary)">Owner</p>
          <p class="text-sm font-mono">${ownerShort}</p>
        </div>

        <div>
          <p class="text-xs mb-1" style="color: var(--color-text-secondary)">Price</p>
          <p class="text-2xl font-bold text-gradient">${priceEth} ETH</p>
        </div>
      </div>

      ${actionButtons ? `<div class="flex gap-2">${actionButtons}</div>` : ''}
    </div>
  `
}

function switchTab(tab: string) {
  const tabs = ['marketplace', 'my-properties', 'history']
  tabs.forEach(t => {
    const btn = document.getElementById(`tab-${t}`)
    const content = document.getElementById(`${t}-content`)

    if (t === tab) {
      btn?.classList.remove('tab-button-inactive')
      btn?.classList.add('tab-button-active')
      content?.classList.remove('hidden')
    } else {
      btn?.classList.remove('tab-button-active')
      btn?.classList.add('tab-button-inactive')
      content?.classList.add('hidden')
    }
  })
}

function showRegisterModal() {
  if (!currentAccount) {
    showError('Please connect your wallet first')
    return
  }

  const modal = document.createElement('div')
  modal.className = 'modal-overlay'
  modal.innerHTML = `
    <div class="modal-content">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold">Register New Property</h2>
        <button id="close-modal" class="text-2xl hover:opacity-70" style="color: var(--color-text-secondary)">&times;</button>
      </div>

      <form id="register-form" class="space-y-5">
        <div>
          <label class="label">Property Hash</label>
          <input
            type="text"
            id="property-hash"
            class="input-field"
            placeholder="IPFS hash or encrypted property data"
            required
          />
          <p class="text-xs mt-1" style="color: var(--color-text-secondary)">
            Enter IPFS hash (QmXx...) or any encrypted property identifier
          </p>
        </div>

        <div>
          <label class="label">Price (ETH)</label>
          <input
            type="number"
            id="property-price"
            class="input-field"
            placeholder="0.1"
            step="0.01"
            min="0"
            required
          />
          <p class="text-xs mt-1" style="color: var(--color-text-secondary)">
            Set the price in ETH for your property
          </p>
        </div>

        <div class="flex gap-3 pt-4">
          <button type="submit" class="btn-primary flex-1">Register Property</button>
          <button type="button" id="cancel-register" class="btn-secondary flex-1">Cancel</button>
        </div>
      </form>
    </div>
  `

  document.body.appendChild(modal)

  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove()
  })

  document.getElementById('close-modal')?.addEventListener('click', () => modal.remove())
  document.getElementById('cancel-register')?.addEventListener('click', () => modal.remove())

  document.getElementById('register-form')?.addEventListener('submit', async (e) => {
    e.preventDefault()
    const hash = (document.getElementById('property-hash') as HTMLInputElement).value
    const price = (document.getElementById('property-price') as HTMLInputElement).value

    modal.remove()

    try {
      loadingState.show('Registering property on blockchain...')

      await Contract.registerProperty(hash, price)

      loadingState.hide()
      showSuccess(`Property registered successfully! Hash: ${hash}, Price: ${price} ETH`)

      // Refresh property lists
      await loadListedProperties()
      await loadMyProperties()

    } catch (error: any) {
      loadingState.hide()
      const errorMessage = error?.message || 'Failed to register property'
      showError(errorMessage)
      console.error('Registration error:', error)
    }
  })
}

// Handle property actions
async function handleListProperty(propertyId: bigint) {
  try {
    loadingState.show('Listing property for sale...')
    await Contract.listProperty(Number(propertyId))
    loadingState.hide()
    showSuccess('Property listed successfully!')

    // Refresh lists
    await loadListedProperties()
    await loadMyProperties()
  } catch (error: any) {
    loadingState.hide()
    showError(error?.message || 'Failed to list property')
  }
}

async function handleDelistProperty(propertyId: bigint) {
  try {
    loadingState.show('Delisting property...')
    await Contract.delistProperty(Number(propertyId))
    loadingState.hide()
    showSuccess('Property delisted successfully!')

    // Refresh lists
    await loadListedProperties()
    await loadMyProperties()
  } catch (error: any) {
    loadingState.hide()
    showError(error?.message || 'Failed to delist property')
  }
}

async function handleUpdatePrice(property: Property) {
  const newPrice = prompt('Enter new price in ETH:', Contract.formatPrice(property.price))
  if (!newPrice) return

  try {
    loadingState.show('Updating price...')
    await Contract.updatePrice(Number(property.id), newPrice)
    loadingState.hide()
    showSuccess(`Price updated to ${newPrice} ETH!`)

    // Refresh lists
    await loadListedProperties()
    await loadMyProperties()
  } catch (error: any) {
    loadingState.hide()
    showError(error?.message || 'Failed to update price')
  }
}

async function handlePurchase(property: Property) {
  const priceEth = Contract.formatPrice(property.price)
  const confirmed = confirm(`Purchase this property for ${priceEth} ETH?`)
  if (!confirmed) return

  try {
    loadingState.show('Purchasing property...')
    await Contract.purchaseProperty(Number(property.id), priceEth)
    loadingState.hide()
    showSuccess('Property purchased successfully!')

    // Refresh lists
    await loadListedProperties()
    await loadMyProperties()
  } catch (error: any) {
    loadingState.hide()
    showError(error?.message || 'Failed to purchase property')
  }
}

function showSettingsModal() {
  const modal = document.createElement('div')
  modal.className = 'modal-overlay'

  const currentProjectId = getWalletConnectProjectId()

  modal.innerHTML = `
    <div class="modal-content" style="max-width: 500px;">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold">Settings</h2>
        <button id="close-settings-modal" class="text-2xl hover:opacity-70" style="color: var(--color-text-secondary)">&times;</button>
      </div>

      <form id="settings-form" class="space-y-5">
        <div>
          <label class="label flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
            WalletConnect Project ID
          </label>
          <input
            type="text"
            id="project-id-input"
            class="input-field font-mono text-sm"
            placeholder="Enter your WalletConnect Project ID"
            value="${currentProjectId}"
          />
          <p class="text-xs mt-2" style="color: var(--color-text-secondary)">
            Get your free Project ID from <a href="https://cloud.walletconnect.com" target="_blank" class="text-accent hover:underline">cloud.walletconnect.com</a>
          </p>
          <p class="text-xs mt-1" style="color: var(--color-text-secondary)">
            This is optional. If not set, only injected wallets (MetaMask) will be available.
          </p>
        </div>

        <div class="card p-4" style="background: var(--color-panel-hover);">
          <div class="flex items-start gap-3">
            <svg class="w-5 h-5 mt-0.5 flex-shrink-0" style="color: var(--color-info)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div class="text-xs" style="color: var(--color-text-secondary)">
              <strong>How to get Project ID:</strong><br>
              1. Visit <a href="https://cloud.walletconnect.com/sign-in" target="_blank" class="text-accent hover:underline">cloud.walletconnect.com</a><br>
              2. Sign up or log in<br>
              3. Create a new project<br>
              4. Copy the Project ID and paste it above
            </div>
          </div>
        </div>

        <div class="flex gap-3 pt-4">
          <button type="submit" class="btn-primary flex-1">Save Settings</button>
          <button type="button" id="cancel-settings" class="btn-secondary flex-1">Cancel</button>
        </div>
      </form>
    </div>
  `

  document.body.appendChild(modal)

  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove()
  })

  document.getElementById('close-settings-modal')?.addEventListener('click', () => modal.remove())
  document.getElementById('cancel-settings')?.addEventListener('click', () => modal.remove())

  document.getElementById('settings-form')?.addEventListener('submit', (e) => {
    e.preventDefault()
    const projectId = (document.getElementById('project-id-input') as HTMLInputElement).value.trim()

    if (projectId) {
      setWalletConnectProjectId(projectId)
      showSuccess('Settings saved! Page will reload to apply changes.')
    } else {
      showInfo('Project ID cleared. Only MetaMask will be available.')
      localStorage.removeItem('walletconnect_project_id')
      window.location.reload()
    }
  })
}

// Initialize when DOM is ready
console.log('=== SETTING UP INITIALIZATION ===')
console.log('=== SCRIPT EXECUTION POINT REACHED ===')

// Force execution even if DOMContentLoaded already fired
const initApp = () => {
  console.log('=== INIT FUNCTION CALLED ===')
  const app = document.getElementById('app')

  if (!app) {
    console.error('=== APP DIV NOT FOUND ===')
    document.body.innerHTML = '<div style="color:white;padding:20px;"><h1>ERROR: #app div not found!</h1></div>'
    return
  }

  console.log('=== APP DIV FOUND ===', app)

  try {
    console.log('=== CALLING initializeApp() ===')
    initializeApp()
    console.log('=== ✅ INITIALIZATION SUCCESS ===')
  } catch (error) {
    console.error('=== ❌ INITIALIZATION ERROR ===', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : 'No stack',
      type: typeof error,
      error: error
    })

    app.innerHTML = `
      <div style="color:white;padding:20px;text-align:center;">
        <h1 style="color:#ff5555;">❌ Initialization Failed</h1>
        <pre style="text-align:left;background:rgba(0,0,0,0.5);padding:15px;border-radius:8px;margin:20px auto;max-width:800px;overflow-x:auto;">${error instanceof Error ? error.message : String(error)}

${error instanceof Error && error.stack ? error.stack : 'No stack trace available'}</pre>
        <p>Contract Address: ${CONTRACT_ADDRESS || 'UNDEFINED'}</p>
        <p style="font-size:12px;margin-top:20px;color:#ffaa00;">⚠️ Open browser console (F12) for full error details</p>
      </div>
    `
  }
}

console.log('=== REGISTERING DOM READY LISTENER ===')
if (document.readyState === 'loading') {
  console.log('=== Document still loading, adding listener ===')
  document.addEventListener('DOMContentLoaded', () => {
    console.log('=== DOM READY EVENT FIRED ===')
    setTimeout(initApp, 200)
  })
} else {
  console.log('=== Document already ready, calling init immediately ===')
  setTimeout(initApp, 200)
}

console.log('=== END OF MAIN.TS ===')
console.log('=== If you see this, the entire module executed successfully ===')
