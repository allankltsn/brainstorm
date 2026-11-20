"use client"

import * as React from "react"
import { GitCommitIcon } from "lucide-react"
import { cn } from "@/lib/utils"

type DiffTimelineEntry = {
  id: string
  /** When the change happened, in words, e.g. "2h ago" or "14:32" */
  at: string
  /** Short description of the change / commit message */
  label: string
  /** Lines added */
  added?: number
  /** Lines removed */
  removed?: number
  /** Who authored the change */
  author?: string
}

function DiffTimeline({
  entries,
  className,
  ...props
}: React.ComponentProps<"ol"> & { entries: DiffTimelineEntry[] }) {
  return (
    <ol
      data-slot="diff-timeline"
      className={cn("flex flex-col", className)}
      {...props}
    >
      {entries.map((entry, index) => {
        const isLast = index === entries.length - 1
        const hasAdded = typeof entry.added === "number"
        const hasRemoved = typeof entry.removed === "number"
        const hasMeta = entry.author != null || entry.at.length > 0

        return (
          <li
            key={entry.id}
            data-slot="diff-timeline-item"
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

            <div className={cn("flex flex-col gap-1 pb-6", isLast && "pb-0")}>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                <p className="text-sm leading-6 font-medium" dir="auto">
                  {entry.label}
                </p>
                {(hasAdded || hasRemoved) && (
                  <span
                    data-slot="diff-timeline-stat"
                    className="flex items-center gap-1 font-mono text-xs"
                  >
                    {hasAdded && (
                      <span className="text-success">{`+${entry.added}`}</span>
                    )}
                    {hasAdded && hasRemoved && (
                      <span aria-hidden className="text-muted-foreground/60">
                        /
                      </span>
                    )}
                    {hasRemoved && (
                      <span className="text-destructive">{`-${entry.removed}`}</span>
                    )}
                  </span>
                )}
              </div>

              {hasMeta && (
                <p className="text-xs text-muted-foreground">
                  {entry.author != null && (
                    <span dir="auto">{entry.author}</span>
                  )}
                  {entry.author != null && entry.at.length > 0 && (
                    <span aria-hidden> · </span>
                  )}
                  {entry.at.length > 0 && <span dir="auto">{entry.at}</span>}
                </p>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}

export { DiffTimeline }
export type { DiffTimelineEntry }
