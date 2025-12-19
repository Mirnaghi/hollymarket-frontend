"use client"

import { Comment } from "@/types/api"
import { formatDistanceToNow } from "date-fns"
import { MessageSquare } from "lucide-react"

interface CommentsSectionProps {
  comments: Comment[]
  loading: boolean
  error: string | null
  count: number
}

export function CommentsSection({ comments, loading, error, count }: CommentsSectionProps) {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return formatDistanceToNow(date, { addSuffix: true })
    } catch {
      return dateString
    }
  }

  const getDisplayName = (comment: Comment) => {
    if (comment.profile.displayUsernamePublic && comment.profile.name) {
      return comment.profile.name
    }
    return comment.profile.pseudonym || 'Anonymous'
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="h-5 w-5" />
          <h2 className="text-xl font-semibold">Comments</h2>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border border-border/40 rounded-lg p-4 bg-card/30 animate-pulse">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-muted/50" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted/50 rounded w-24" />
                  <div className="h-3 bg-muted/50 rounded w-full" />
                  <div className="h-3 bg-muted/50 rounded w-3/4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="h-5 w-5" />
          <h2 className="text-xl font-semibold">Comments</h2>
        </div>
        <div className="border border-border/40 rounded-lg p-4 bg-card/30">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="h-5 w-5" />
        <h2 className="text-xl font-semibold">Comments</h2>
        <span className="text-sm text-muted-foreground">({count})</span>
      </div>

      {comments.length === 0 ? (
        <div className="border border-border/40 rounded-lg p-8 bg-card/30 text-center">
          <MessageSquare className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
          <p className="text-muted-foreground">No comments yet</p>
          <p className="text-sm text-muted-foreground/70 mt-1">Be the first to share your thoughts</p>
        </div>
      ) : (
        <div className="space-y-3">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="border border-border/40 rounded-lg p-4 bg-card/30 hover:bg-card/40 transition-colors"
            >
              <div className="flex items-start gap-3">
                {/* Avatar */}
                {comment.profile.profileImage ? (
                  <img
                    src={comment.profile.profileImage}
                    alt={getDisplayName(comment)}
                    className="w-10 h-10 rounded-full object-cover border border-border/50"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/20 to-indigo-500/20 flex items-center justify-center border border-purple-500/30">
                    <span className="text-sm font-bold text-purple-300">
                      {getDisplayName(comment).charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}

                {/* Comment Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm">{getDisplayName(comment)}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-foreground/90 whitespace-pre-wrap break-words">
                    {comment.body}
                  </p>

                  {/* Comment Stats */}
                  {(comment.reactionCount > 0 || comment.reportCount > 0) && (
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      {comment.reactionCount > 0 && (
                        <span>{comment.reactionCount} reactions</span>
                      )}
                      {comment.reportCount > 0 && (
                        <span>{comment.reportCount} reports</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
