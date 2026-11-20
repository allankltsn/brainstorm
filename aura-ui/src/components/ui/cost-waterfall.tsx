"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

type CostWaterfallStep = {
  id: string
  label: string
  amount: number
}

/*
 * Formata um valor monetário: prefixo da unidade + duas casas decimais.
 * Negativos viram "-$0.42" (sinal antes da unidade).
 */
function formatAmount(amount: number, unit: string): string {
  const sign = amount < 0 ? "-" : ""
  return `${sign}${unit}${Math.abs(amount).toFixed(2)}`
}

/*
 * CostWaterfall: gráfico em cascata das contribuições de custo que se somam
 * até um total. Cada passo vira uma linha com uma barra "flutuante": a barra
 * começa no acumulado corrente e sua largura é proporcional ao `amount` (sobre
 * o total final), então as barras "sobem em degraus". Rótulo à esquerda, valor
 * à direita. A linha final "Total" mostra uma barra cheia + o total (negrito).
 * Positivos usam a cor primária/chart; se algum valor for negativo, aquela
 * barra usa destructive e desce.
 */
function CostWaterfall({
  steps,
  unit = "$",
  className,
  ...props
}: React.ComponentProps<"div"> & {
  steps: CostWaterfallStep[]
  unit?: string
}) {
  const total = steps.reduce((sum, step) => sum + step.amount, 0)
  const span = Math.abs(total) > 0 ? Math.abs(total) : 1

  // Acumulado corrente antes de cada passo, para posicionar o início da barra.
  let running = 0

  return (
    <div
      data-slot="cost-waterfall"
      className={cn("flex w-full flex-col gap-2", className)}
      {...props}
    >
      <ol className="flex flex-col gap-2">
        {steps.map((step) => {
          const negative = step.amount < 0
          const magnitude = Math.abs(step.amount)
          const widthPct = Math.min(100, Math.round((magnitude / span) * 100))

          // A barra ocupa o intervalo entre o acumulado antes e depois do passo.
          const before = running
          const after = running + step.amount
          running = after
          const startPct = Math.max(
            0,
            Math.min(100, Math.round((Math.min(before, after) / span) * 100))
          )

          return (
            <li
              key={step.id}
              data-slot="cost-waterfall-step"
              className="grid grid-cols-[8rem_1fr_auto] items-center gap-3 text-sm"
            >
              <span className="min-w-0 truncate text-muted-foreground">
                {step.label}
              </span>
              <div
                role="meter"
                aria-valuemin={0}
                aria-valuemax={span}
                aria-valuenow={magnitude}
                aria-label={`${step.label}: ${formatAmount(step.amount, unit)}`}
                className="relative h-2 w-full overflow-hidden rounded-full bg-muted"
              >
                <div
                  className={cn(
                    "absolute inset-y-0 rounded-full",
                    negative ? "bg-destructive" : "bg-chart-1"
                  )}
                  style={{ left: `${startPct}%`, width: `${widthPct}%` }}
                />
              </div>
              <span
                className={cn(
                  "shrink-0 font-medium tabular-nums",
                  negative && "text-destructive"
                )}
              >
                {formatAmount(step.amount, unit)}
              </span>
            </li>
          )
        })}
      </ol>
      <div
        data-slot="cost-waterfall-total"
        className="grid grid-cols-[8rem_1fr_auto] items-center gap-3 border-t border-border pt-2 text-sm"
      >
        <span className="font-semibold">Total</span>
        <div
          aria-hidden
          className="h-2 w-full overflow-hidden rounded-full bg-muted"
        >
          <div className="h-full w-full rounded-full bg-primary" />
        </div>
        <span className="shrink-0 font-semibold tabular-nums">
          {formatAmount(total, unit)}
        </span>
      </div>
    </div>
  )
}

export { CostWaterfall, formatAmount }
export type { CostWaterfallStep }
