"use client"

import * as React from "react"
import { GitCommitIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

type Commit = {
  id: string
  /** Full commit hash; a short prefix is shown */
  hash: string
  /** Commit message / subject line */
  message: string
  /** Who authored the commit */
  author?: string
  /** When the commit happened, in words, e.g. "2h ago" or "14:32" */
  at?: string
  /** Lines added */
  added?: number
  /** Lines removed */
  removed?: number
}

function CommitTrail({
  commits,
  className,
  ...props
}: React.ComponentProps<"div"> & { commits: Commit[] }) {
  return (
    <div
      data-slot="commit-trail"
      className={cn("flex flex-col", className)}
      {...props}
    >
      {commits.map((commit, index) => {
        const isLast = index === commits.length - 1
        const hasAdded = typeof commit.added === "number"
        const hasRemoved = typeof commit.removed === "number"
        const hasMeta =
          (commit.author != null && commit.author.length > 0) ||
          (commit.at != null && commit.at.length > 0)
        const shortHash = commit.hash.slice(0, 7)

        return (
          <div
            key={commit.id}
            data-slot="commit-trail-item"
            className="flex gap-3"
          >
            <div className="flex flex-col items-center">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-border bg-background text-muted-foreground">
                <GitCommitIcon className="size-3.5" />
              </span>
              {!isLast && (
                <span
                  aria-hidden
                  className="w-px flex-1 border-l border-border"
                />
              )}
            </div>

            <div className={cn("flex min-w-0 flex-col gap-1 pb-6", isLast && "pb-0")}>
              <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
                <p
                  className="min-w-0 truncate text-sm leading-6 font-medium"
                  dir="auto"
                >
                  {commit.message}
                </p>
                <Badge
                  variant="outline"
                  className="shrink-0 font-mono text-[0.6875rem]"
                >
                  {shortHash}
                </Badge>
                {(hasAdded || hasRemoved) && (
                  <span
                    data-slot="commit-trail-stat"
                    className="flex items-center gap-1 font-mono text-xs"
                  >
                    {hasAdded && (
                      <span className="text-success">{`+${commit.added}`}</span>
                    )}
                    {hasAdded && hasRemoved && (
                      <span aria-hidden className="text-muted-foreground/60">
                        /
                      </span>
                    )}
                    {hasRemoved && (
                      <span className="text-destructive">{`-${commit.removed}`}</span>
                    )}
                  </span>
                )}
              </div>

              {hasMeta && (
                <p className="text-xs text-muted-foreground">
                  {commit.author != null && commit.author.length > 0 && (
                    <span dir="auto">{commit.author}</span>
                  )}
                  {commit.author != null &&
                    commit.author.length > 0 &&
                    commit.at != null &&
                    commit.at.length > 0 && <span aria-hidden> · </span>}
                  {commit.at != null && commit.at.length > 0 && (
                    <span dir="auto">{commit.at}</span>
                  )}
                </p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export { CommitTrail }
export type { Commit }
