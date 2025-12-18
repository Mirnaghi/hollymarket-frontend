"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Clock, DollarSign } from "lucide-react"
import { cn } from "@/lib/utils"
import { TradingModal } from "./trading-modal"

export interface MarketEvent {
  id: string
  title: string
  category: string
  yesPrice: number
  noPrice: number
  volume: string
  endDate: string
  trending?: boolean
  change24h?: number
  icon?: string
  image?: string
  eventId?: string
}

interface EventCardProps {
  event: MarketEvent
  onClick?: (event: MarketEvent) => void
}

export function EventCard({ event, onClick }: EventCardProps) {
  const isPositive = (event.change24h ?? 0) >= 0
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedSide, setSelectedSide] = useState<"yes" | "no">("yes")

  const handleOpenModal = (side: "yes" | "no") => {
    setSelectedSide(side)
    setIsModalOpen(true)
  }

  return (
    <>
      <Card
        className="glow-hover cursor-pointer transition-all hover:border-primary/50"
        onClick={() => onClick?.(event)}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className="text-xs">
                  {event.category}
                </Badge>
                {event.trending && (
                  <Badge variant="success" className="text-xs gap-1">
                    <Flame className="h-3 w-3" />
                    Trending
                  </Badge>
                )}
              </div>
              <h3 className="text-sm sm:text-base font-semibold leading-tight line-clamp-2">
                {event.title}
              </h3>
            </div>
            {event.change24h !== undefined && (
              <div className={cn(
                "flex items-center gap-1 text-xs font-medium",
                isPositive ? "text-green-400" : "text-red-400"
              )}>
                {isPositive ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {Math.abs(event.change24h)}%
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <button
              className="flex flex-col items-center justify-center gap-1 py-3 px-4 rounded-lg border border-green-500/30 bg-green-500/10 hover:bg-green-500/20 text-green-400 transition-all hover:scale-[1.02]"
              onClick={(e) => {
                e.stopPropagation()
                handleOpenModal("yes")
              }}
            >
              <span className="text-xs font-medium uppercase tracking-wide">Yes</span>
              <span className="text-2xl font-bold">{event.yesPrice}¢</span>
            </button>

            <button
              className="flex flex-col items-center justify-center gap-1 py-3 px-4 rounded-lg border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all hover:scale-[1.02]"
              onClick={(e) => {
                e.stopPropagation()
                handleOpenModal("no")
              }}
            >
              <span className="text-xs font-medium uppercase tracking-wide">No</span>
              <span className="text-2xl font-bold">{event.noPrice}¢</span>
            </button>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <DollarSign className="h-3 w-3" />
              <span>{event.volume} vol</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{event.endDate}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <TradingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        event={event}
        initialSide={selectedSide}
      />
    </>
  )
}

function Flame({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
  )
}
