"use client"

import { cn } from "@/lib/utils"
import { Globe, Hash } from "lucide-react"
import { PolymarketTag } from "@/types/api"

interface CategoryTabsProps {
  activeCategory: string
  onCategoryChange: (category: string) => void
  tags: PolymarketTag[]
  loading?: boolean
}

export function CategoryTabs({ activeCategory, onCategoryChange, tags, loading }: CategoryTabsProps) {
  // Create categories array with All and dynamic tags
  const allCategories = [
    { id: "all", label: "All", icon: Globe, eventCount: undefined },
    ...tags.map(tag => ({
      id: tag.id, // Use tag ID instead of slug
      label: tag.label || tag.name, // Use label if available, fallback to name
      icon: Hash, // Use hashtag icon for all tags
      eventCount: tag.eventCount
    }))
  ]

  if (loading) {
    return (
      <div className="sticky top-16 z-40 w-full border-b border-border/40 backdrop-blur-xl bg-background/80 supports-[backdrop-filter]:bg-background/60">
        <div className="w-full overflow-x-auto scrollbar-hide">
          <div className="flex items-center gap-1 px-4 sm:px-6 lg:px-8 py-2 min-w-max">
            {/* Skeleton loading */}
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-8 w-24 bg-muted/50 rounded-md animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="sticky top-16 z-40 w-full border-b border-border/40 backdrop-blur-xl bg-background/80 supports-[backdrop-filter]:bg-background/60">
      <div className="w-full overflow-x-auto scrollbar-hide">
        <div className="flex items-center gap-1 px-4 sm:px-6 lg:px-8 py-2 min-w-max">
          {allCategories.map((category) => {
            const Icon = category.icon
            const isActive = activeCategory === category.id

            return (
              <button
                key={category.id}
                onClick={() => onCategoryChange(category.id)}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap",
                  isActive
                    ? "bg-primary/20 text-primary border border-primary/30"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{category.label}</span>
                {category.eventCount !== undefined && category.eventCount > 0 && (
                  <span className="ml-1 text-xs opacity-60">({category.eventCount})</span>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
