"use client"

import type { ComponentProps } from "react"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { Sparkline } from "@/components/ui/sparkline"

export type KpiTrend = "up" | "down" | "flat"

export type KpiChartProps = ComponentProps<"div"> & {
  /** Rótulo curto do indicador (ex.: "Receita"). */
  label: string
  /** Valor principal, já formatado (ex.: "R$ 48k"). */
  value: string | number
  /** Variação em relação ao período anterior (ex.: "+12%"). */
  delta?: string
  /** Direção da variação — define a cor e a seta do delta. */
  trend?: KpiTrend
  /** Pontos para a linha de tendência ao pé do tile. */
  data?: number[]
}

/* Tendência → cor semântica + seta + tom do Sparkline. */
const TREND = {
  up: { text: "text-success", arrow: "↑", tone: "good" },
  down: { text: "text-destructive", arrow: "↓", tone: "bad" },
  flat: { text: "text-muted-foreground", arrow: "→", tone: "neutral" },
} as const

/**
 * KpiChart: tile de indicador — valor grande, rótulo, variação e uma
 * linha de tendência (Sparkline) ao pé. Montado sobre o Card do kit.
 */
export function KpiChart({
  label,
  value,
  delta,
  trend = "flat",
  data,
  className,
  ...props
}: KpiChartProps) {
  const t = TREND[trend]

  return (
    <Card
      data-slot="kpi-chart"
      className={cn("gap-2 px-(--card-spacing)", className)}
      {...props}
    >
      <p className="text-sm text-muted-foreground">{label}</p>

      <p className="text-2xl font-semibold tracking-tight tabular-nums sm:text-3xl">
        {value}
      </p>

      {delta && (
        <p className={cn("flex items-center gap-1 text-xs font-medium", t.text)}>
          <span aria-hidden="true">{t.arrow}</span>
          <span>{delta}</span>
        </p>
      )}

      {data && data.length > 0 && (
        <Sparkline data={data} tone={t.tone} className="mt-2 h-8 w-full" />
      )}
    </Card>
  )
}
