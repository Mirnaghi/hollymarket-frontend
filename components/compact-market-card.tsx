"use client"

import { useState } from "react"
import { TrendingUp, TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { TradingModal } from "./trading-modal"
import { MarketEvent } from "./event-card"

interface CompactMarketCardProps {
  event: MarketEvent
  onClick?: (event: MarketEvent) => void
}

export function CompactMarketCard({ event, onClick }: CompactMarketCardProps) {
  const isPositive = (event.change24h ?? 0) >= 0
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedSide, setSelectedSide] = useState<"yes" | "no">("yes")
  const [imageError, setImageError] = useState(false)

  const handleOpenModal = (side: "yes" | "no") => {
    setSelectedSide(side)
    setIsModalOpen(true)
  }

  // Get first letter for avatar fallback
  const getAvatarLetter = () => {
    return event.category.charAt(0).toUpperCase()
  }

  return (
    <>
      <div
        className="group relative rounded-lg border border-border/40 bg-card/30 hover:bg-card/50 transition-all cursor-pointer overflow-hidden"
        onClick={() => onClick?.(event)}
      >
        <div className="p-3 sm:p-4">
          {/* Header with icon and category */}
          <div className="flex items-start gap-3 mb-3">
            {/* Avatar/Icon */}
            {event.icon && !imageError ? (
              <div className="flex-shrink-0 w-10 h-10 rounded-full overflow-hidden border border-border/50 bg-muted/30">
                <img
                  src={event.icon}
                  alt={event.category}
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                />
              </div>
            ) : (
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/20 to-indigo-500/20 flex items-center justify-center border border-purple-500/30">
                <span className="text-sm font-bold text-purple-300">
                  {getAvatarLetter()}
                </span>
              </div>
            )}

            {/* Title and category */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="text-sm font-medium leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                  {event.title}
                </h3>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{event.category}</span>
                <span>•</span>
                <span>{event.endDate}</span>
              </div>
            </div>
          </div>

          {/* Prices */}
          <div className="grid grid-cols-2 gap-2">
            <button
              className="flex flex-col items-start p-2 rounded border border-border/50 bg-background/30 hover:border-green-500/50 hover:bg-green-500/5 transition-all"
              onClick={(e) => {
                e.stopPropagation()
                handleOpenModal("yes")
              }}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span className="text-xs text-muted-foreground">Yes</span>
                {event.change24h !== undefined && isPositive && (
                  <div className="flex items-center gap-0.5 text-green-400">
                    <TrendingUp className="h-3 w-3" />
                    <span className="text-xs font-medium">{Math.abs(event.change24h)}%</span>
                  </div>
                )}
              </div>
              <div className="text-xl font-bold text-green-400">{event.yesPrice}¢</div>
            </button>

            <button
              className="flex flex-col items-start p-2 rounded border border-border/50 bg-background/30 hover:border-red-500/50 hover:bg-red-500/5 transition-all"
              onClick={(e) => {
                e.stopPropagation()
                handleOpenModal("no")
              }}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span className="text-xs text-muted-foreground">No</span>
                {event.change24h !== undefined && !isPositive && (
                  <div className="flex items-center gap-0.5 text-red-400">
                    <TrendingDown className="h-3 w-3" />
                    <span className="text-xs font-medium">{Math.abs(event.change24h)}%</span>
                  </div>
                )}
              </div>
              <div className="text-xl font-bold text-red-400">{event.noPrice}¢</div>
            </button>
          </div>

          {/* Volume */}
          <div className="mt-2 pt-2 border-t border-border/30">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{event.volume} vol</span>
              {event.trending && (
                <span className="text-purple-400 font-medium">🔥 Trending</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <TradingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        event={event}
        initialSide={selectedSide}
      />
    </>
  )
}
