"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { CategoryTabs } from "@/components/category-tabs"
import { EventWithMarketsCard } from "@/components/event-with-markets-card"
import { CompactMarketSkeletonGrid } from "@/components/compact-market-skeleton"
import { Input } from "@/components/ui/input"
import { Search, SlidersHorizontal } from "lucide-react"
import { useInfiniteEvents } from "@/lib/hooks/useInfiniteEvents"
import { useIntersectionObserver } from "@/lib/hooks/useIntersectionObserver"
import { useTags } from "@/lib/hooks/useTags"
import { PolymarketEvent } from "@/types/api"

export default function Home() {
  const router = useRouter()
  const [activeCategory, setActiveCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  // Fetch tags
  const { tags, loading: tagsLoading } = useTags()

  // Determine the tag filter based on active category
  const tagFilter = activeCategory === "all" ? undefined : activeCategory

  // Fetch events with infinite scroll and tag filtering
  const { events, loading, error, hasMore, loadMore, refresh } = useInfiniteEvents({
    active: true,
    limit: 20,
    autoFetch: true,
    tag_id: tagFilter
  })

  // Refresh events when category changes
  useEffect(() => {
    if (activeCategory) {
      refresh()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory])

  // Intersection observer for infinite scroll
  const loadMoreRef = useIntersectionObserver({
    onIntersect: loadMore,
    enabled: hasMore && !loading
  })

  // Filter events by search only (category filtering is now done by API)
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      // Search filter
      const matchesSearch =
        !searchQuery ||
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchQuery.toLowerCase())

      return matchesSearch
    })
  }, [events, searchQuery])

  const handleEventClick = (event: PolymarketEvent) => {
    // Navigate to event detail page
    router.push(`/event/${event.id}`)
  }

  // Get category title from tags or use default
  const categoryTitle = useMemo(() => {
    if (activeCategory === "all") {
      return "All Events"
    }
    const selectedTag = tags.find(tag => tag.id === activeCategory)
    return selectedTag ? `${selectedTag.label || selectedTag.name} Events` : "Events"
  }, [activeCategory, tags])

  return (
    <div className="min-h-screen">
      <Header />
      <CategoryTabs
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        tags={tags}
        loading={tagsLoading}
      />

      <main className="container px-4 sm:px-6 lg:px-8 py-4 sm:py-6 max-w-[1400px]">
        {/* Search and Filter Bar */}
        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search events and markets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg bg-background/50 pl-10 pr-4 h-10 border-border/50"
            />
          </div>
          <button className="flex items-center gap-2 px-4 h-10 rounded-lg border border-border/50 bg-background/50 hover:bg-muted/50 transition-colors text-sm font-medium">
            <SlidersHorizontal className="h-4 w-4" />
            <span className="hidden sm:inline">Filters</span>
          </button>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-semibold">
            {categoryTitle}
          </h2>
          {!loading && (
            <p className="text-sm text-muted-foreground">
              {filteredEvents.length} {filteredEvents.length === 1 ? "event" : "events"}
            </p>
          )}
        </div>

        {/* Error State */}
        {error && !loading && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-red-400 mb-2">Failed to load events</p>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        )}

        {/* Initial Loading State with Skeletons */}
        {loading && events.length === 0 && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            <CompactMarketSkeletonGrid count={12} />
          </div>
        )}

        {/* Events Grid */}
        {!error && filteredEvents.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
              {filteredEvents.map((event) => (
                <EventWithMarketsCard
                  key={event.id}
                  event={event}
                  onClick={handleEventClick}
                />
              ))}
            </div>

            {/* Load More Trigger with Skeleton */}
            {hasMore && (
              <div ref={loadMoreRef} className="py-4">
                {loading && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                    <CompactMarketSkeletonGrid count={4} />
                  </div>
                )}
              </div>
            )}

            {!hasMore && filteredEvents.length > 0 && (
              <div className="flex items-center justify-center py-8">
                <p className="text-sm text-muted-foreground">No more events to load</p>
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {!loading && !error && filteredEvents.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground mb-2">No events found</p>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search or category filter
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
