"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

export type PlanVsActualRow = {
  id: string
  label: string
  plan: number
  actual: number
}

/*
 * Compara planejado x realizado por linha (barras pareadas finas).
 * Cada linha mostra o rótulo, uma barra "Plano" (secundária) e uma barra
 * "Real" (primária) escaladas contra o máximo da linha (ou um máximo global),
 * os valores numéricos e um Badge de delta (Real - Plano).
 */
function PlanVsActual({
  rows,
  unit,
  max,
  format = (n: number) => n.toLocaleString("pt-BR"),
  className,
  ...props
}: React.ComponentProps<"div"> & {
  rows: PlanVsActualRow[]
  unit?: string
  max?: number
  format?: (n: number) => string
}) {
  const globalMax = max ?? Math.max(...rows.map((r) => Math.max(r.plan, r.actual)), 1)
  const suffix = unit ? ` ${unit}` : ""

  return (
    <div
      data-slot="plan-vs-actual"
      className={cn("flex w-full flex-col gap-4", className)}
      {...props}
    >
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-secondary" aria-hidden />
          Plano
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-primary" aria-hidden />
          Real
        </span>
      </div>

      <ol className="grid gap-3">
        {rows.map((r) => {
          const top = max ?? Math.max(r.plan, r.actual, globalMax, 1)
          const planPct = Math.min(100, Math.round((r.plan / top) * 100))
          const actualPct = Math.min(100, Math.round((r.actual / top) * 100))
          const delta = r.actual - r.plan
          const over = delta > 0
          const deltaLabel = `${over ? "+" : ""}${format(delta)}${suffix}`

          return (
            <li key={r.id} className="grid gap-1.5">
              <div className="flex items-baseline justify-between gap-3 text-sm">
                <span className="min-w-0 truncate font-medium">{r.label}</span>
                <Badge
                  variant={over ? "destructive" : "secondary"}
                  className={cn(
                    over
                      ? "bg-warning-soft text-warning"
                      : "bg-success-soft text-success",
                  )}
                >
                  {deltaLabel}
                </Badge>
              </div>

              <div className="grid gap-1">
                <div className="flex items-center gap-2">
                  <div
                    role="meter"
                    aria-valuemin={0}
                    aria-valuemax={top}
                    aria-valuenow={r.plan}
                    aria-label={`${r.label} · Plano: ${format(r.plan)}${suffix}`}
                    className="h-1.5 flex-1 rounded-full bg-muted"
                  >
                    <div
                      className="h-full rounded-full bg-secondary"
                      style={{ width: `${planPct}%` }}
                    />
                  </div>
                  <span className="w-20 shrink-0 text-right text-xs text-muted-foreground tabular-nums">
                    {format(r.plan)}
                    {suffix}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div
                    role="meter"
                    aria-valuemin={0}
                    aria-valuemax={top}
                    aria-valuenow={r.actual}
                    aria-label={`${r.label} · Real: ${format(r.actual)}${suffix}`}
                    className="h-1.5 flex-1 rounded-full bg-muted"
                  >
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${actualPct}%` }}
                    />
                  </div>
                  <span className="w-20 shrink-0 text-right text-xs font-medium tabular-nums">
                    {format(r.actual)}
                    {suffix}
                  </span>
                </div>
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

export { PlanVsActual }
