export function CompactMarketSkeleton() {
  return (
    <div className="relative rounded-lg border border-border/40 bg-card/30 overflow-hidden">
      <div className="p-3 sm:p-4">
        {/* Header with icon and category */}
        <div className="flex items-start gap-3 mb-3">
          {/* Avatar skeleton */}
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-muted/50 animate-pulse" />

          {/* Title and category skeleton */}
          <div className="flex-1 min-w-0 space-y-2">
            <div className="h-4 bg-muted/50 rounded animate-pulse w-3/4" />
            <div className="h-3 bg-muted/30 rounded animate-pulse w-1/2" />
          </div>
        </div>

        {/* Prices skeleton */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="flex flex-col items-start p-2 rounded border border-border/50 bg-background/30 space-y-2">
            <div className="h-3 bg-muted/30 rounded animate-pulse w-8" />
            <div className="h-6 bg-green-500/20 rounded animate-pulse w-12" />
          </div>

          <div className="flex flex-col items-start p-2 rounded border border-border/50 bg-background/30 space-y-2">
            <div className="h-3 bg-muted/30 rounded animate-pulse w-8" />
            <div className="h-6 bg-red-500/20 rounded animate-pulse w-12" />
          </div>
        </div>

        {/* Volume skeleton */}
        <div className="pt-2 border-t border-border/30">
          <div className="h-3 bg-muted/30 rounded animate-pulse w-20" />
        </div>
      </div>
    </div>
  )
}

export function CompactMarketSkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <CompactMarketSkeleton key={i} />
      ))}
    </>
  )
}
