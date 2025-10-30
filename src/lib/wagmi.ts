import { getDefaultConfig } from 'connectkit'
import { createConfig, http } from 'wagmi'
import { mainnet, polygon, arbitrum, optimism, base } from 'wagmi/chains'

const isDevelopment = import.meta.env.DEV

// Fallback to public RPC URLs for development if API keys are not provided
const alchemyId = import.meta.env.VITE_ALCHEMY_ID
const walletConnectProjectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID

// Show warning in development if API keys are missing
if (isDevelopment && (!alchemyId || !walletConnectProjectId)) {
  console.warn(
    '⚠️ Missing Web3 API keys in .env file. Wallet functionality may be limited.\n' +
      'Please add VITE_ALCHEMY_ID and VITE_WALLETCONNECT_PROJECT_ID to your .env file.\n' +
      'See .env.example for details.'
  )
}

export const config = createConfig(
  getDefaultConfig({
    // Required API Keys (with fallback for development)
    walletConnectProjectId: walletConnectProjectId || 'demo-project-id',

    // Required
    appName: 'Market Alert Admin',
    appIcon: 'https://family.co/connectkit/logo.png', // Your app's icon here
    appDescription:
      'Admin dashboard for market alerts with Web3 authentication',

    // Use browser wallets by default (MetaMask, etc.)
    enableFamily: false,

    // Configure coinbase wallet preference
    coinbaseWalletPreference: 'all',

    chains: [mainnet, polygon, arbitrum, optimism, base],
    transports: {
      [mainnet.id]: http(
        alchemyId
          ? `https://eth-mainnet.g.alchemy.com/v2/${alchemyId}`
          : 'https://ethereum.publicnode.com'
      ),
      [polygon.id]: http(
        alchemyId
          ? `https://polygon-mainnet.g.alchemy.com/v2/${alchemyId}`
          : 'https://polygon.publicnode.com'
      ),
      [arbitrum.id]: http(
        alchemyId
          ? `https://arb-mainnet.g.alchemy.com/v2/${alchemyId}`
          : 'https://arbitrum.publicnode.com'
      ),
      [optimism.id]: http(
        alchemyId
          ? `https://opt-mainnet.g.alchemy.com/v2/${alchemyId}`
          : 'https://optimism.publicnode.com'
      ),
      [base.id]: http(
        alchemyId
          ? `https://base-mainnet.g.alchemy.com/v2/${alchemyId}`
          : 'https://base.publicnode.com'
      ),
    },

    // Additional options to prevent provider not found errors
    ssr: false,
  })
)

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
