"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export type BreakdownSegment = { id: string; label: string; value: number }

function BreakdownChart({
  segments,
  title,
  format = (n: number) => n.toLocaleString("pt-BR"),
  className,
  ...props
}: React.ComponentProps<"div"> & {
  segments: BreakdownSegment[]
  title?: string
  format?: (n: number) => string
}) {
  const total = segments.reduce((sum, s) => sum + s.value, 0)
  const safeTotal = total || 1

  return (
    <div
      data-slot="breakdown-chart"
      className={cn("flex w-full flex-col gap-3", className)}
      {...props}
    >
      {title && (
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-sm font-medium">{title}</span>
          <span className="text-xs text-muted-foreground tabular-nums">
            {format(total)}
          </span>
        </div>
      )}

      <div
        role="img"
        aria-label={`${title ? `${title}: ` : ""}${segments
          .map((s) => `${s.label} ${format(s.value)}`)
          .join(", ")}`}
        className="flex h-3 w-full overflow-hidden rounded-full bg-muted"
      >
        {segments.map((s, i) => {
          const pct = (s.value / safeTotal) * 100
          return (
            <div
              key={s.id}
              className="h-full first:rounded-l-full last:rounded-r-full"
              style={{
                width: `${pct}%`,
                backgroundColor: `var(--chart-${(i % 5) + 1})`,
              }}
            />
          )
        })}
      </div>

      <ul className="grid gap-1.5">
        {segments.map((s, i) => {
          const pct = Math.round((s.value / safeTotal) * 100)
          return (
            <li
              key={s.id}
              className="flex items-center gap-2 text-sm"
            >
              <span
                aria-hidden
                className="size-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: `var(--chart-${(i % 5) + 1})` }}
              />
              <span className="min-w-0 flex-1 truncate text-muted-foreground">
                {s.label}
              </span>
              <span className="shrink-0 font-medium tabular-nums">
                {format(s.value)}
              </span>
              <span className="w-10 shrink-0 text-right text-xs text-muted-foreground tabular-nums">
                {pct}%
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export { BreakdownChart }
