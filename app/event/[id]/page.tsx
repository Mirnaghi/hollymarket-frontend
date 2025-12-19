"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Header } from "@/components/header"
import { apiClient } from "@/lib/api-client"
import { PolymarketEvent } from "@/types/api"
import { ArrowLeft, Share2, Bookmark, TrendingUp } from "lucide-react"
import { CompactMarketCard } from "@/components/compact-market-card"
import { transformEventMarketsToEvents } from "@/lib/utils/transform-api-data"
import { CommentsSection } from "@/components/comments-section"
import { useComments } from "@/lib/hooks/useComments"

export default function EventDetailPage() {
  const router = useRouter()
  const params = useParams()
  const eventId = params.id as string

  const [event, setEvent] = useState<PolymarketEvent | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load comments
  const { comments, loading: commentsLoading, error: commentsError, count } = useComments({
    parentEntityId: eventId,
    parentEntityType: 'Event'
  })

  useEffect(() => {
    const loadEventDetail = async () => {
      if (!eventId) return

      setLoading(true)
      setError(null)

      try {
        const response = await apiClient.getEventById(eventId)

        if (response.success && response.data) {
          setEvent(response.data)
        } else {
          setError(response.error?.message || "Failed to load event")
        }
      } catch (err: any) {
        const errorMessage = err.response?.data?.error?.message || "Failed to load event"
        setError(errorMessage)
        console.error("Error loading event:", err)
      } finally {
        setLoading(false)
      }
    }

    loadEventDetail()
  }, [eventId])

  const marketEvents = event ? transformEventMarketsToEvents(event) : []

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container px-4 sm:px-6 lg:px-8 py-4 sm:py-6 max-w-[1400px]">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading event...</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container px-4 sm:px-6 lg:px-8 py-4 sm:py-6 max-w-[1400px]">
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-red-400 mb-2">Failed to load event</p>
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            <button
              onClick={() => router.push("/")}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header />

      <main className="container px-4 sm:px-6 lg:px-8 py-4 sm:py-6 max-w-[1400px]">
        {/* Back Button */}
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm">Back to Markets</span>
        </button>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_500px] gap-6">
          {/* Left Column - Event Info */}
          <div>
            {/* Event Header */}
            <div className="mb-8">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-start gap-4">
                  {event.icon && (
                    <div className="w-16 h-16 rounded-full overflow-hidden border border-border/50 bg-muted/30 flex-shrink-0">
                      <img
                        src={event.icon}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold mb-2">{event.title}</h1>
                    {event.description && (
                      <p className="text-muted-foreground text-sm sm:text-base">
                        {event.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-lg border border-border/50 bg-background/50 hover:bg-muted/50 transition-colors">
                    <Share2 className="h-4 w-4" />
                  </button>
                  <button className="p-2 rounded-lg border border-border/50 bg-background/50 hover:bg-muted/50 transition-colors">
                    <Bookmark className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Event Stats */}
              <div className="flex flex-wrap items-center gap-4 text-sm">
                {event.tags && event.tags.length > 0 && (
                  <div className="flex items-center gap-2">
                    {event.tags.map((tag) => {
                      // Handle both string tags and tag objects
                      const tagLabel = typeof tag === 'string' ? tag : (tag.label || tag.name || tag.slug)
                      const tagKey = typeof tag === 'string' ? tag : tag.id
                      return (
                        <span
                          key={tagKey}
                          className="px-2 py-1 rounded-md bg-primary/10 text-primary text-xs"
                        >
                          {tagLabel}
                        </span>
                      )
                    })}
                  </div>
                )}
                {event.volume && (
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <TrendingUp className="h-4 w-4" />
                    <span>
                      Volume: $
                      {event.volume >= 1000000
                        ? `${(event.volume / 1000000).toFixed(1)}M`
                        : event.volume >= 1000
                        ? `${(event.volume / 1000).toFixed(0)}K`
                        : event.volume}
                    </span>
                  </div>
                )}
                {event.commentCount !== undefined && (
                  <span className="text-muted-foreground">
                    {event.commentCount} comments
                  </span>
                )}
              </div>
            </div>

            {/* Comments Section */}
            <div className="mt-8">
              <CommentsSection
                comments={comments}
                loading={commentsLoading}
                error={commentsError}
                count={count}
              />
            </div>
          </div>

          {/* Right Column - Markets */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Markets</h2>
              <p className="text-sm text-muted-foreground">
                {marketEvents.length} {marketEvents.length === 1 ? "market" : "markets"}
              </p>
            </div>

            {marketEvents.length > 0 ? (
              <div className="space-y-3 sm:space-y-4">
                {marketEvents.map((marketEvent) => (
                  <CompactMarketCard
                    key={marketEvent.id}
                    event={marketEvent}
                    onClick={() => {}}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center border border-border/40 rounded-lg bg-card/30">
                <p className="text-muted-foreground">No markets available</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
