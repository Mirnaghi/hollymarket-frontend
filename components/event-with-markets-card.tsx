"use client"

import { useState } from "react"
import { PolymarketEvent, PolymarketMarket } from "@/types/api"
import { Clock, DollarSign } from "lucide-react"
import { cn } from "@/lib/utils"
import { parseArrayField } from "@/lib/utils/parse-helpers"
import { TradingModal } from "./trading-modal"
import { MarketEvent } from "./event-card"

interface EventWithMarketsCardProps {
  event: PolymarketEvent
  onClick?: (event: PolymarketEvent) => void
}

export function EventWithMarketsCard({ event, onClick }: EventWithMarketsCardProps) {
  const [imageError, setImageError] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedMarket, setSelectedMarket] = useState<MarketEvent | null>(null)
  const [selectedSide, setSelectedSide] = useState<"yes" | "no">("yes")

  const getAvatarLetter = () => {
    return event.title.charAt(0).toUpperCase()
  }

  const formatVolume = (volume: number) => {
    if (volume >= 1000000) {
      return `$${(volume / 1000000).toFixed(1)}M`
    } else if (volume >= 1000) {
      return `$${(volume / 1000).toFixed(0)}K`
    }
    return `$${volume}`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()

    if (date < now) {
      return 'Ended'
    }

    const options: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric'
    }

    return date.toLocaleDateString('en-US', options)
  }

  const handleCardClick = () => {
    if (onClick) {
      onClick(event)
    }
  }

  const convertToMarketEvent = (market: PolymarketMarket): MarketEvent => {
    const outcomePrices = parseArrayField(market.outcomePrices)
    const yesPriceRaw = parseFloat(outcomePrices[0] || '0')
    const yesPrice = Math.round(yesPriceRaw * 100)
    const noPrice = outcomePrices.length > 1
      ? Math.round(parseFloat(outcomePrices[1]) * 100)
      : 100 - yesPrice

    const formatVolume = (volume: number) => {
      if (volume >= 1000000) {
        return `$${(volume / 1000000).toFixed(1)}M`
      } else if (volume >= 1000) {
        return `$${(volume / 1000).toFixed(0)}K`
      }
      return `$${volume}`
    }

    return {
      id: market.id,
      title: market.question,
      category: market.category || event.title,
      yesPrice,
      noPrice,
      volume: formatVolume(market.volume),
      endDate: formatDate(market.endDate),
      icon: event.icon,
      image: event.image,
      eventId: event.id,
    }
  }

  const handleMarketClick = (market: PolymarketMarket, side: "yes" | "no") => {
    const marketEvent = convertToMarketEvent(market)
    setSelectedMarket(marketEvent)
    setSelectedSide(side)
    setIsModalOpen(true)
  }

  return (
    <div
      onClick={handleCardClick}
      className={cn(
        "relative rounded-lg border border-border/40 bg-card/30 overflow-hidden transition-all hover:bg-card/50 hover:border-border/60",
        onClick && "cursor-pointer"
      )}
    >
      <div className="p-3 sm:p-4">
        {/* Event Header */}
        <div className="flex items-start gap-3 mb-3">
          {event.icon && !imageError ? (
            <div className="flex-shrink-0 w-10 h-10 rounded-full overflow-hidden border border-border/50 bg-muted/30">
              <img
                src={event.icon}
                alt={event.title}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            </div>
          ) : (
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/20 to-indigo-500/20 flex items-center justify-center border border-purple-500/30">
              <span className="text-sm font-bold text-purple-300">{getAvatarLetter()}</span>
            </div>
          )}

          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold line-clamp-2 mb-1">
              {event.title}
            </h3>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              {event.volume !== undefined && (
                <div className="flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  <span>{formatVolume(event.volume)}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{formatDate(event.endDate)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Markets List */}
        <div className="space-y-2 max-h-[300px] overflow-y-auto scrollbar-hide">
          {event.markets.map((market) => {
            const outcomePrices = parseArrayField(market.outcomePrices)
            const yesPriceRaw = parseFloat(outcomePrices[0] || '0')
            const yesPrice = Math.round(yesPriceRaw * 100)
            const noPrice = outcomePrices.length > 1
              ? Math.round(parseFloat(outcomePrices[1]) * 100)
              : 100 - yesPrice

            return (
              <div
                key={market.id}
                className="border border-border/30 rounded-md p-2 bg-background/50 hover:bg-background/80 transition-colors"
                onClick={(e) => {
                  e.stopPropagation()
                  // Handle individual market click if needed
                }}
              >
                <p className="text-xs sm:text-sm mb-2 line-clamp-2">{market.question}</p>

                {/* Yes/No Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      e.preventDefault()
                      handleMarketClick(market, "yes")
                    }}
                    className="flex items-center justify-between px-2 py-1.5 rounded bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 transition-colors"
                  >
                    <span className="text-xs font-medium text-green-400">Yes</span>
                    <span className="text-xs font-bold text-green-400">{yesPrice}¢</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      e.preventDefault()
                      handleMarketClick(market, "no")
                    }}
                    className="flex items-center justify-between px-2 py-1.5 rounded bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 transition-colors"
                  >
                    <span className="text-xs font-medium text-red-400">No</span>
                    <span className="text-xs font-bold text-red-400">{noPrice}¢</span>
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Markets Count */}
        {event.markets.length > 2 && (
          <div className="mt-2 text-xs text-muted-foreground text-center">
            {event.markets.length} markets
          </div>
        )}
      </div>

      {/* Trading Modal */}
      {selectedMarket && (
        <TradingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          event={selectedMarket}
          initialSide={selectedSide}
        />
      )}
    </div>
  )
}
