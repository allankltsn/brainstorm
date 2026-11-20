"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

type FanOutStatus = "pending" | "running" | "done" | "error"

type FanOutCell = {
  id: string
  label: string
  status: FanOutStatus
}

const DOT_CONFIG: Record<FanOutStatus, string> = {
  pending: "bg-muted-foreground/40 ring-muted-foreground/20",
  running: "bg-primary ring-primary/30 animate-pulse",
  done: "bg-success ring-success/30",
  error: "bg-destructive ring-destructive/30",
}

function FanOutGrid({
  cells,
  title,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  cells: FanOutCell[]
  title?: string
}) {
  const total = cells.length
  const doneCount = cells.filter((cell) => cell.status === "done").length

  return (
    <div
      data-slot="fan-out-grid"
      className={cn("flex flex-col gap-3", className)}
      {...props}
    >
      {(title != null || total > 0) && (
        <div className="flex items-center justify-between gap-2">
          {title != null && (
            <span className="truncate text-sm font-medium">{title}</span>
          )}
          {total > 0 && (
            <Badge variant="secondary" className="tabular-nums">
              {doneCount}/{total} prontos
            </Badge>
          )}
        </div>
      )}

      <div className="grid gap-2 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
        {cells.map((cell) => (
          <div
            key={cell.id}
            data-slot="fan-out-grid-cell"
            data-status={cell.status}
            className={cn(
              "flex aspect-square flex-col items-center justify-center gap-2",
              "overflow-hidden rounded-xl bg-card p-2 text-center",
              "text-card-foreground ring-1 ring-foreground/10"
            )}
          >
            <span
              data-slot="fan-out-grid-dot"
              className={cn(
                "size-2.5 shrink-0 rounded-full ring-4",
                DOT_CONFIG[cell.status]
              )}
            />
            <span className="w-full truncate text-xs font-medium">
              {cell.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export { FanOutGrid }
export type { FanOutCell, FanOutStatus }
