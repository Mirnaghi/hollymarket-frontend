'use client'

import { ReactNode, useEffect } from 'react'
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
  useEffect(() => {

    // Create modal only on client side and only once
    if (!modalInitialized && typeof window !== 'undefined' && projectId) {
      console.log('Creating Web3Modal with projectId:', projectId)
      const modal = createWeb3Modal({
        metadata,
        wagmiConfig: config,
        projectId: projectId as string,
        enableAnalytics: false
      })
      modalInitialized = true
      console.log('Web3Modal created successfully')

      // Listen for custom event to open modal
      const handleOpenModal = () => {
        modal.open()
      }
      window.addEventListener('web3modal:open', handleOpenModal)

      return () => {
        window.removeEventListener('web3modal:open', handleOpenModal)
      }
    }
  }, [])

  return (
    <WagmiProvider config={config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}
