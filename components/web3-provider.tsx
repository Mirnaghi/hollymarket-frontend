"use client"

import { WagmiProvider } from 'wagmi'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactNode, useEffect, useState } from 'react'

export function Web3Provider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false)
  const [config, setConfig] = useState<any>(null)
  const [queryClient, setQueryClient] = useState<any>(null)

  useEffect(() => {
    // Only import and initialize on client side
    import('@/lib/web3-config').then(({ wagmiAdapter, queryClient: qc }) => {
      setConfig(wagmiAdapter.wagmiConfig)
      setQueryClient(qc)
      setMounted(true)
    })
  }, [])

  if (!mounted || !config || !queryClient) {
    return <>{children}</>
  }

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}
