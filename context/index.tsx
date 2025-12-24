'use client'

import { ReactNode, useEffect, useState } from 'react'
import { config, projectId, metadata } from '../lib/web3-config'
import { createWeb3Modal } from '@web3modal/wagmi/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { State, WagmiProvider } from 'wagmi'

// Setup queryClient
const queryClient = new QueryClient()

if (!projectId) throw new Error('Project ID is not defined')

// Flag to ensure modal is only created once
let modalInitialized = false

export default function AppKitProvider({
  children,
  initialState
}: {
  children: ReactNode
  initialState?: State
}) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Create modal only on client side and only once
    if (!modalInitialized && typeof window !== 'undefined') {
      console.log('Creating Web3Modal with projectId:', projectId)
      createWeb3Modal({
        metadata,
        wagmiConfig: config,
        projectId,
        enableAnalytics: false
      })
      modalInitialized = true
      console.log('Web3Modal created successfully')
    }
  }, [])

  return (
    <WagmiProvider config={config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}
