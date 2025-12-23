"use client"

import { ReactNode, useEffect } from "react"
import { Web3Provider } from "./web3-provider"
import { createAppKit } from '@reown/appkit/react'
import { wagmiAdapter } from '@/lib/web3-config'
import { mainnet, polygon, arbitrum } from 'viem/chains'

// Initialize AppKit once
let appKitInitialized = false

export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (!appKitInitialized && typeof window !== 'undefined') {
      const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || ''

      createAppKit({
        adapters: [wagmiAdapter],
        networks: [mainnet, polygon, arbitrum],
        projectId,
        metadata: {
          name: 'PredictX',
          description: 'Trade on real-world events',
          url: window.location.origin,
          icons: ['https://avatars.githubusercontent.com/u/37784886']
        },
        features: {
          analytics: false,
        },
      })

      appKitInitialized = true
    }
  }, [])

  return (
    <Web3Provider>
      {children}
    </Web3Provider>
  )
}
