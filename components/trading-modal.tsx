"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAccount } from "wagmi"
import { useWeb3Modal } from "@web3modal/wagmi/react"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Drawer, DrawerContent } from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useTradingSetup } from "@/lib/hooks/useTradingSetup"
import { clobService } from "@/lib/services/clob.service"
import { TradingSetup } from "@/components/trading-setup"
import type { MarketEvent } from "./event-card"
import { AlertCircle, Loader2 } from "lucide-react"

interface TradingModalProps {
  isOpen: boolean
  onClose: () => void
  event: MarketEvent
  initialSide: "yes" | "no"
}

export function TradingModal({ isOpen, onClose, event, initialSide }: TradingModalProps) {
  const router = useRouter()
  const { isConnected } = useAccount()
  const { open } = useWeb3Modal()
  const { isReadyToTrade, isWalletConnected } = useTradingSetup()

  const [side, setSide] = useState<"yes" | "no">(initialSide)
  const [action, setAction] = useState<"buy" | "sell">("buy")
  const [amount, setAmount] = useState("")
  const [isExecuting, setIsExecuting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  useEffect(() => {
    setSide(initialSide)
  }, [initialSide])

  useEffect(() => {
    if (isOpen) {
      setError(null)
      setSuccess(false)
    }
  }, [isOpen])

  const price = side === "yes" ? event.yesPrice : event.noPrice

  const handleActionClick = async () => {
    console.log('Button clicked! isConnected:', isConnected)
    if (!isConnected) {
      // Close trading modal first, then open wallet modal
      console.log('Opening wallet modal...')
      onClose()
      // Small delay to ensure trading modal is closed before opening wallet modal
      setTimeout(() => {
        open()
      }, 100)
      return
    }

    if (!isReadyToTrade) {
      setError("Please complete trading setup first")
      return
    }

    const amountNum = parseFloat(amount)
    if (!amount || amountNum <= 0) {
      setError("Please enter a valid amount")
      return
    }

    setIsExecuting(true)
    setError(null)

    try {
      // Get token ID from event (you may need to add this to MarketEvent type)
      const tokenID = (event as any).tokenId || event.id

      // Calculate price in CLOB format (0.00 - 1.00)
      const clobPrice = price / 100

      // Calculate size (number of shares)
      const size = amountNum / clobPrice

      // Place order via CLOB
      await clobService.createOrder({
        tokenID,
        price: clobPrice,
        size,
        side: action.toUpperCase() as "BUY" | "SELL",
      })

      setSuccess(true)
      setAmount("")

      // Close modal after short delay
      setTimeout(() => {
        onClose()
        setSuccess(false)
      }, 2000)
    } catch (err: any) {
      console.error("Trade execution failed:", err)
      setError(err?.message || "Failed to execute trade. Please try again.")
    } finally {
      setIsExecuting(false)
    }
  }

  const shares = amount && parseFloat(amount) > 0 ? (parseFloat(amount) / (price / 100)).toFixed(2) : "0"
  const potentialReturn = amount && parseFloat(amount) > 0
    ? ((parseFloat(amount) / (price / 100)) * (1 - price / 100)).toFixed(2)
    : "0"

  const content = (
    <>
      {/* Header */}
      <div className="border-b border-border/50 p-4 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <h2 className="text-lg sm:text-xl font-bold mb-2 leading-tight">
              {event.title}
            </h2>
            <div className="flex items-center gap-2 text-sm">
              <span className={cn(
                "font-semibold",
                side === "yes" ? "text-purple-400" : "text-indigo-400"
              )}>
                {action === "buy" ? "Buy" : "Sell"} {side === "yes" ? "Yes" : "No"}
              </span>
              <span className="text-muted-foreground">·</span>
              <span className="text-muted-foreground">
                {price}¢
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6 space-y-6 overflow-y-auto">
        {/* Trading Setup (if not ready) */}
        {!isReadyToTrade && isWalletConnected && (
          <TradingSetup autoSetup />
        )}

        {/* Error Message */}
        {error && (
          <div className="rounded-lg border border-red-500/40 p-3 bg-red-500/10">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-red-500 mt-0.5" />
              <p className="text-sm text-red-500">{error}</p>
            </div>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="rounded-lg border border-green-500/40 p-3 bg-green-500/10">
            <p className="text-sm text-green-500 font-medium">✓ Order placed successfully!</p>
          </div>
        )}

        {/* Buy/Sell Toggle */}
        <div className="flex gap-2 p-1 bg-muted/30 rounded-lg">
          <button
            onClick={() => setAction("buy")}
            className={cn(
              "flex-1 py-2.5 px-4 rounded-md font-medium transition-all duration-200",
              action === "buy"
                ? "bg-background shadow-lg text-foreground scale-[1.02]"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Buy
          </button>
          <button
            onClick={() => setAction("sell")}
            className={cn(
              "flex-1 py-2.5 px-4 rounded-md font-medium transition-all duration-200",
              action === "sell"
                ? "bg-background shadow-lg text-foreground scale-[1.02]"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Sell
          </button>
        </div>

        {/* Yes/No Selection */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setSide("yes")}
            className={cn(
              "flex flex-col items-center justify-center gap-2 py-6 rounded-xl font-semibold transition-all duration-300",
              side === "yes"
                ? "bg-purple-500/20 border-2 border-purple-500 text-purple-400 shadow-lg shadow-purple-500/30 scale-[1.02]"
                : "bg-purple-500/5 border-2 border-purple-500/30 text-purple-400/70 hover:bg-purple-500/10 hover:border-purple-500/50"
            )}
          >
            <span className="text-xl">Yes</span>
            <span className="text-3xl font-bold">{event.yesPrice}¢</span>
          </button>

          <button
            onClick={() => setSide("no")}
            className={cn(
              "flex flex-col items-center justify-center gap-2 py-6 rounded-xl font-semibold transition-all duration-300",
              side === "no"
                ? "bg-indigo-500/20 border-2 border-indigo-500 text-indigo-400 shadow-lg shadow-indigo-500/30 scale-[1.02]"
                : "bg-indigo-500/5 border-2 border-indigo-500/30 text-indigo-400/70 hover:bg-indigo-500/10 hover:border-indigo-500/50"
            )}
          >
            <span className="text-xl">No</span>
            <span className="text-3xl font-bold">{event.noPrice}¢</span>
          </button>
        </div>

        {/* Amount Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Amount
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-muted-foreground z-10">
              $
            </span>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="w-full bg-background/50 rounded-xl py-4 pl-10 pr-4 text-2xl font-bold h-auto"
            />
          </div>
          <p className="text-sm text-green-400 font-medium">
            Earn 3.5% Interest
          </p>
        </div>

        {/* Potential Return */}
        {amount && parseFloat(amount) > 0 && (
          <div className="bg-muted/30 rounded-xl p-4 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Shares</span>
              <span className="font-semibold">{shares}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Avg price</span>
              <span className="font-semibold">{price}¢</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Potential return</span>
              <span className="font-semibold text-green-400">${potentialReturn}</span>
            </div>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={handleActionClick}
          disabled={isExecuting || success || (isConnected && !isReadyToTrade)}
          className={cn(
            "w-full py-4 rounded-xl font-semibold text-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]",
            "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
            side === "yes"
              ? "bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white shadow-lg shadow-purple-500/40"
              : "bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white shadow-lg shadow-indigo-500/40"
          )}
        >
          {isExecuting ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              Placing order...
            </span>
          ) : success ? (
            "Order Placed!"
          ) : !isConnected ? (
            "Connect Wallet"
          ) : !isReadyToTrade ? (
            "Complete Setup First"
          ) : amount && parseFloat(amount) > 0 ? (
            `${action === "buy" ? "Buy" : "Sell"} ${side === "yes" ? "Yes" : "No"} for $${amount}`
          ) : (
            "Enter amount"
          )}
        </button>
      </div>
    </>
  )

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-lg p-0 gap-0 glass">
          {content}
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="glass max-h-[85vh]">
        {content}
      </DrawerContent>
    </Drawer>
  )
}
