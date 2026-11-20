"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

type AgentTimingPhase = {
  id: string
  label: string
  ms: number
}

/*
 * Formata uma duração em ms para leitura humana:
 * abaixo de 1s → "Nms"; a partir de 1s → "N.Ns".
 */
function formatMs(ms: number): string {
  if (ms < 1000) {
    return `${Math.round(ms)}ms`
  }
  return `${(ms / 1000).toFixed(1)}s`
}

/*
 * AgentTiming: quebra de tempo (gantt/barra empilhada) das fases de uma
 * execução de agente. Cada fase vira uma linha: rótulo à esquerda, uma barra
 * proporcional (largura = ms / total) e a duração formatada à direita.
 * As barras são coloridas por índice via var(--chart-N) (dado visual).
 */
function AgentTiming({
  phases,
  className,
  ...props
}: React.ComponentProps<"div"> & { phases: AgentTimingPhase[] }) {
  const total = phases.reduce((sum, phase) => sum + phase.ms, 0)
  const safeTotal = total > 0 ? total : 1

  return (
    <div
      data-slot="agent-timing"
      className={cn("flex w-full flex-col gap-2", className)}
      {...props}
    >
      <ol className="flex flex-col gap-2">
        {phases.map((phase, index) => {
          const pct = Math.round((phase.ms / safeTotal) * 100)
          const color = `var(--chart-${(index % 5) + 1})`
          return (
            <li
              key={phase.id}
              data-slot="agent-timing-phase"
              className="grid grid-cols-[8rem_1fr_auto] items-center gap-3 text-sm"
            >
              <span className="min-w-0 truncate text-muted-foreground">
                {phase.label}
              </span>
              <div
                role="meter"
                aria-valuemin={0}
                aria-valuemax={safeTotal}
                aria-valuenow={phase.ms}
                aria-label={`${phase.label}: ${formatMs(phase.ms)}`}
                className="h-2 w-full overflow-hidden rounded-full bg-muted"
              >
                <div
                  className="h-full rounded-full"
                  style={{ width: `${pct}%`, backgroundColor: color }}
                />
              </div>
              <span className="shrink-0 font-medium tabular-nums">
                {formatMs(phase.ms)}
              </span>
            </li>
          )
        })}
      </ol>
      <div className="flex items-baseline justify-between gap-3 border-t border-border pt-2 text-sm">
        <span className="font-medium">Total</span>
        <span className="font-medium tabular-nums">{formatMs(total)}</span>
      </div>
    </div>
  )
}

export { AgentTiming, formatMs }
export type { AgentTimingPhase }
