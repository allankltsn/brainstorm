"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

type MeteringDatum = { label: string; value: number }

function MeteringChart({
  data,
  cap,
  unit,
  format = (n: number) => n.toLocaleString("pt-BR"),
  className,
  ...props
}: React.ComponentProps<"div"> & {
  data: MeteringDatum[]
  cap?: number
  unit?: string
  format?: (n: number) => string
}) {
  const values = data.map((d) => d.value)
  const max = Math.max(...values, cap ?? 0, 1)
  const latest = data.length ? data[data.length - 1].value : 0
  const over = cap != null && latest >= cap
  const capPct = cap != null ? Math.min(100, (cap / max) * 100) : 0

  return (
    <div
      data-slot="metering-chart"
      data-state={over ? "over" : "ok"}
      className={cn("flex w-full flex-col gap-3", className)}
      {...props}
    >
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-sm text-muted-foreground">Atual</span>
        <span
          className={cn(
            "text-lg font-semibold tabular-nums",
            over && "text-destructive"
          )}
        >
          {format(latest)}
          {unit ? ` ${unit}` : null}
        </span>
      </div>

      <div className="relative h-32 w-full">
        {cap != null && (
          <div
            data-slot="metering-cap"
            className="pointer-events-none absolute inset-x-0 z-10 flex items-center"
            style={{ bottom: `${capPct}%` }}
          >
            <div className="h-0 w-full border-t border-dashed border-destructive/60" />
            <span className="absolute right-0 -top-4 rounded bg-destructive/10 px-1 text-[10px] font-medium text-destructive tabular-nums">
              Limite {format(cap)}
            </span>
          </div>
        )}

        <div className="flex h-full w-full items-end gap-1.5">
          {data.map((d, i) => {
            const barOver = cap != null && d.value >= cap
            const height = `${Math.max(2, (d.value / max) * 100)}%`
            return (
              <div
                key={`${d.label}-${i}`}
                className="flex h-full min-w-0 flex-1 items-end"
                title={`${d.label}: ${format(d.value)}${unit ? ` ${unit}` : ""}`}
              >
                <div
                  data-slot="metering-bar"
                  data-over={barOver || undefined}
                  className={cn(
                    "w-full rounded-t-sm",
                    barOver ? "bg-destructive" : "bg-primary"
                  )}
                  style={{ height }}
                />
              </div>
            )
          })}
        </div>
      </div>

      <div className="flex w-full gap-1.5">
        {data.map((d, i) => (
          <span
            key={`${d.label}-${i}`}
            className="min-w-0 flex-1 truncate text-center text-[11px] text-muted-foreground"
          >
            {d.label}
          </span>
        ))}
      </div>
    </div>
  )
}

export { MeteringChart }
export type { MeteringDatum }
