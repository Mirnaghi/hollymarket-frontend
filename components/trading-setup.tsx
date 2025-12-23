"use client"

import { useState } from "react"
import { useTradingSetup } from "@/lib/hooks/useTradingSetup"
import { AlertCircle, CheckCircle, Loader2, Wallet, Key } from "lucide-react"
import { cn } from "@/lib/utils"

interface TradingSetupProps {
  onComplete?: () => void
  autoSetup?: boolean
}

export function TradingSetup({ onComplete, autoSetup = false }: TradingSetupProps) {
  const {
    isWalletConnected,
    walletAddress,
    hasCredentials,
    isReadyToTrade,
    isLoading,
    error,
    currentStep,
    isCorrectChain,
    requiredChainId,
    completeSetup,
    clearError,
  } = useTradingSetup()

  const [setupAttempted, setSetupAttempted] = useState(false)

  const handleSetup = async () => {
    setSetupAttempted(true)
    clearError()

    try {
      await completeSetup()
      onComplete?.()
    } catch (err) {
      console.error('Setup failed:', err)
    }
  }

  // Auto-setup if requested and wallet is connected
  if (autoSetup && isWalletConnected && !hasCredentials && !setupAttempted && !isLoading) {
    handleSetup()
  }

  if (!isWalletConnected) {
    return (
      <div className="rounded-lg border border-border/40 p-6 bg-card/30">
        <div className="flex items-center gap-3 mb-4">
          <Wallet className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-lg font-semibold">Connect Wallet to Trade</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Please connect your wallet to start trading on Polymarket.
        </p>
      </div>
    )
  }

  if (!isCorrectChain) {
    return (
      <div className="rounded-lg border border-yellow-500/40 p-6 bg-yellow-500/10">
        <div className="flex items-center gap-3 mb-4">
          <AlertCircle className="h-5 w-5 text-yellow-500" />
          <h3 className="text-lg font-semibold text-yellow-500">Wrong Network</h3>
        </div>
        <p className="text-sm text-yellow-500/90">
          Please switch to Polygon network (Chain ID: {requiredChainId}) to trade.
        </p>
      </div>
    )
  }

  if (isReadyToTrade) {
    return (
      <div className="rounded-lg border border-green-500/40 p-6 bg-green-500/10">
        <div className="flex items-center gap-3">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <div>
            <h3 className="text-lg font-semibold text-green-500">Ready to Trade</h3>
            <p className="text-sm text-green-500/80">
              Your trading account is set up and ready!
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border/40 p-6 bg-card/30">
      <div className="flex items-center gap-3 mb-4">
        <Key className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Setup Trading</h3>
      </div>

      <div className="space-y-4">
        {/* Wallet Status */}
        <div className={cn(
          "flex items-center gap-3 p-3 rounded-lg",
          "bg-background/50 border border-border/30"
        )}>
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center",
            isWalletConnected ? "bg-green-500/20" : "bg-muted"
          )}>
            {isWalletConnected ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <Wallet className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Wallet Connected</p>
            {walletAddress && (
              <p className="text-xs text-muted-foreground">
                {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </p>
            )}
          </div>
        </div>

        {/* Credentials Status */}
        <div className={cn(
          "flex items-center gap-3 p-3 rounded-lg",
          "bg-background/50 border border-border/30"
        )}>
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center",
            hasCredentials ? "bg-green-500/20" : "bg-muted"
          )}>
            {hasCredentials ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <Key className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Trading Credentials</p>
            <p className="text-xs text-muted-foreground">
              {hasCredentials ? 'Generated' : 'Not generated'}
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="rounded-lg border border-red-500/40 p-3 bg-red-500/10">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-red-500 mt-0.5" />
              <p className="text-sm text-red-500">{error}</p>
            </div>
          </div>
        )}

        {/* Setup Button */}
        <button
          onClick={handleSetup}
          disabled={isLoading || isReadyToTrade}
          className={cn(
            "w-full py-3 px-4 rounded-lg font-semibold text-sm transition-all",
            "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500",
            "text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              {currentStep === 'generating-credentials' ? 'Generating credentials...' : 'Setting up...'}
            </span>
          ) : hasCredentials ? (
            'Initialize Trading'
          ) : (
            'Setup Trading Account'
          )}
        </button>

        <p className="text-xs text-muted-foreground text-center">
          {hasCredentials
            ? 'Click to initialize your trading client'
            : 'You will be asked to sign a message to generate your trading credentials'}
        </p>
      </div>
    </div>
  )
}
