"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export type CompactBreakdownSegment = {
  id: string
  label: string
  value: number
}

/*
 * Breakdown compacto: uma barra empilhada fina + legenda inline com bolinhas.
 * Feito para viver dentro de um card. Cores via var(--chart-1..5).
 */
function CompactBreakdown({
  segments,
  label,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  segments: CompactBreakdownSegment[]
  label?: string
}) {
  const total = segments.reduce((sum, s) => sum + Math.max(0, s.value), 0)
  const color = (i: number) => `var(--chart-${(i % 5) + 1})`

  return (
    <div
      data-slot="compact-breakdown"
      className={cn("flex w-full flex-col gap-2", className)}
      {...props}
    >
      {label && (
        <span className="text-xs font-medium text-muted-foreground">
          {label}
        </span>
      )}

      <div className="flex h-2 w-full overflow-hidden rounded-full bg-muted">
        {segments.map((s, i) => {
          const pct = total > 0 ? (Math.max(0, s.value) / total) * 100 : 0
          if (pct <= 0) return null
          return (
            <div
              key={s.id}
              className="h-full first:rounded-l-full last:rounded-r-full"
              style={{ width: `${pct}%`, backgroundColor: color(i) }}
              aria-hidden="true"
            />
          )
        })}
      </div>

      <ul className="flex flex-wrap gap-x-3 gap-y-1">
        {segments.map((s, i) => (
          <li
            key={s.id}
            className="flex items-center gap-1.5 text-xs text-muted-foreground"
          >
            <span
              className="size-2 shrink-0 rounded-full"
              style={{ backgroundColor: color(i) }}
              aria-hidden="true"
            />
            <span className="truncate">{s.label}</span>
            <span className="font-medium tabular-nums text-foreground">
              {s.value}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export { CompactBreakdown }
