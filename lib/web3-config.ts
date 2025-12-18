import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { mainnet, polygon, arbitrum } from 'viem/chains'
import { QueryClient } from '@tanstack/react-query'

// 1. Get projectId from https://cloud.walletconnect.com
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || ''

if (!projectId) {
  console.warn('WalletConnect Project ID is not set. Please add NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID to your .env.local file')
}

// 2. Set up Wagmi adapter
export const wagmiAdapter = new WagmiAdapter({
  networks: [mainnet, polygon, arbitrum],
  projectId,
  ssr: true, // Enable SSR support
})

// 3. Set up query client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})

// 4. Create AppKit immediately (not lazily)
createAppKit({
  adapters: [wagmiAdapter],
  networks: [mainnet, polygon, arbitrum],
  projectId,
  metadata: {
    name: 'PredictX',
    description: 'Trade on real-world events',
    url: typeof window !== 'undefined' ? window.location.origin : 'https://predictx.app',
    icons: ['https://avatars.githubusercontent.com/u/37784886']
  },
  features: {
    analytics: false,
  },
})
