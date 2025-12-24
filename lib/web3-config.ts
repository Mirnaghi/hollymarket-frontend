import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'
import { cookieStorage, createStorage } from 'wagmi'
import { mainnet, polygon, arbitrum } from 'viem/chains'

// Get projectId from https://cloud.walletconnect.com
export const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID

if (!projectId) throw new Error('Project ID is not defined')

export const metadata = {
  name: 'PredictX',
  description: 'Trade on real-world events with prediction markets',
  url: typeof window !== 'undefined' ? window.location.origin : 'https://predictx.app',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

// Create wagmiConfig with Polygon (required for Polymarket CLOB)
const chains = [polygon, mainnet, arbitrum] as const
export const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage
  }),
})