"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

type TraceSpan = {
  id: string
  label: string
  /** início em ms, relativo ao começo do trace */
  start: number
  /** duração do span em ms */
  duration: number
  /** nível de aninhamento (indentação do rótulo) */
  depth?: number
  status?: "ok" | "error"
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
 * TraceWaterfall: cascata de um trace distribuído. Cada span é uma linha:
 * rótulo à esquerda (indentado por depth), uma trilha com uma barra posicionada
 * e dimensionada proporcionalmente ao trace, e a duração ao fim da barra.
 * As barras são coloridas por profundidade via var(--chart-N) (dado visual);
 * spans com erro usam o token destructive.
 */
function TraceWaterfall({
  spans,
  className,
  ...props
}: React.ComponentProps<"div"> & { spans: TraceSpan[] }) {
  const traceStart = spans.length
    ? Math.min(...spans.map((s) => s.start))
    : 0
  const traceEnd = spans.length
    ? Math.max(...spans.map((s) => s.start + s.duration))
    : 0
  const total = traceEnd - traceStart > 0 ? traceEnd - traceStart : 1

  return (
    <div
      data-slot="trace-waterfall"
      className={cn("flex w-full flex-col gap-1.5", className)}
      {...props}
    >
      <ol className="flex flex-col gap-1.5">
        {spans.map((span) => {
          const depth = span.depth ?? 0
          const isError = span.status === "error"
          const left = ((span.start - traceStart) / total) * 100
          const width = (span.duration / total) * 100
          const color = isError
            ? "var(--destructive)"
            : `var(--chart-${(depth % 5) + 1})`
          return (
            <li
              key={span.id}
              data-slot="trace-waterfall-span"
              className="grid grid-cols-[10rem_1fr] items-center gap-3 text-sm"
            >
              <span
                className="flex min-w-0 items-center gap-1.5 truncate text-muted-foreground"
                style={{ paddingLeft: `${depth * 12}px` }}
              >
                <span className="truncate">{span.label}</span>
                {isError && (
                  <Badge variant="destructive" className="shrink-0">
                    erro
                  </Badge>
                )}
              </span>
              <div
                role="meter"
                aria-valuemin={0}
                aria-valuemax={traceEnd}
                aria-valuenow={span.start + span.duration}
                aria-label={`${span.label}: ${formatMs(span.duration)}`}
                className="relative h-5 w-full"
              >
                <div
                  className="absolute top-1/2 flex h-2 min-w-0.5 -translate-y-1/2 items-center rounded-full"
                  style={{
                    left: `${left}%`,
                    width: `${width}%`,
                    backgroundColor: color,
                  }}
                />
                <span
                  className="absolute top-1/2 -translate-y-1/2 pl-1 text-xs tabular-nums text-muted-foreground"
                  style={{ left: `${Math.min(left + width, 100)}%` }}
                >
                  {formatMs(span.duration)}
                </span>
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

export { TraceWaterfall, formatMs }
export type { TraceSpan }
