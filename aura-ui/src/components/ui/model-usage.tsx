"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

type ModelUsageItem = {
  id: string
  name: string
  tokens: number
  cost?: string
}

/*
 * Formata uma contagem de tokens de forma compacta para leitura humana:
 * abaixo de mil → número cru; milhares → "N.Nk"; milhões → "N.NM".
 * Ex.: 1234 → "1.2k"; 1_100_000 → "1.1M".
 */
function formatCompact(n: number): string {
  if (n < 1000) {
    return `${Math.round(n)}`
  }
  if (n < 1_000_000) {
    return `${(n / 1000).toFixed(1)}k`
  }
  return `${(n / 1_000_000).toFixed(1)}M`
}

/*
 * ModelUsage: quebra de uso por modelo (tokens e custo). Cada modelo vira uma
 * linha: nome à esquerda, uma barra proporcional (largura = tokens / maxTokens),
 * a contagem de tokens formatada e o custo opcional (esmaecido) à direita.
 * As barras são coloridas por índice via var(--chart-N) (dado visual).
 * Fecha com uma linha de totais (soma de tokens e soma de custo quando simples).
 */
function ModelUsage({
  models,
  className,
  ...props
}: React.ComponentProps<"div"> & { models: ModelUsageItem[] }) {
  const maxTokens = Math.max(...models.map((m) => m.tokens), 1)
  const totalTokens = models.reduce((sum, m) => sum + m.tokens, 0)

  // Soma custos apenas quando todos seguem o padrão "$N.NN"; caso contrário,
  // usa o último custo informado (fallback simples, sem parsing frágil).
  const costs = models.map((m) => m.cost).filter((c): c is string => Boolean(c))
  const parsed = costs.map((c) => Number(c.replace(/[^0-9.-]/g, "")))
  const allParsable = costs.length > 0 && parsed.every((n) => Number.isFinite(n))
  const totalCost = allParsable
    ? `$${parsed.reduce((sum, n) => sum + n, 0).toFixed(2)}`
    : costs.length > 0
      ? costs[costs.length - 1]
      : undefined

  return (
    <div
      data-slot="model-usage"
      className={cn("flex w-full flex-col gap-2", className)}
      {...props}
    >
      <ol className="flex flex-col gap-2">
        {models.map((model, index) => {
          const pct = Math.round((model.tokens / maxTokens) * 100)
          const color = `var(--chart-${(index % 5) + 1})`
          return (
            <li
              key={model.id}
              data-slot="model-usage-item"
              className="grid grid-cols-[8rem_1fr_auto] items-center gap-3 text-sm"
            >
              <span className="min-w-0 truncate text-muted-foreground">
                {model.name}
              </span>
              <div
                role="meter"
                aria-valuemin={0}
                aria-valuemax={maxTokens}
                aria-valuenow={model.tokens}
                aria-label={`${model.name}: ${formatCompact(model.tokens)} tokens`}
                className="h-2 w-full overflow-hidden rounded-full bg-muted"
              >
                <div
                  className="h-full rounded-full"
                  style={{ width: `${pct}%`, backgroundColor: color }}
                />
              </div>
              <span className="flex shrink-0 items-baseline gap-2">
                <span className="font-medium tabular-nums">
                  {formatCompact(model.tokens)}
                </span>
                {model.cost && (
                  <span className="text-xs text-muted-foreground tabular-nums">
                    {model.cost}
                  </span>
                )}
              </span>
            </li>
          )
        })}
      </ol>
      <div className="flex items-baseline justify-between gap-3 border-t border-border pt-2 text-sm">
        <span className="font-medium">Total</span>
        <span className="flex items-baseline gap-2">
          <span className="font-medium tabular-nums">
            {formatCompact(totalTokens)}
          </span>
          {totalCost && (
            <span className="text-xs text-muted-foreground tabular-nums">
              {totalCost}
            </span>
          )}
        </span>
      </div>
    </div>
  )
}

export { ModelUsage, formatCompact }
export type { ModelUsageItem }
