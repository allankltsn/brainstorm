import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

export type StatDelta = { text: string; tone?: "good" | "bad" | "neutral" }

const DELTA_CLASS = {
  good: "text-success",
  bad: "text-destructive",
  neutral: "text-muted-foreground",
} as const

/* KPI compacto: rótulo, número grande, variação e um ícone opcional. */
export function StatCard({
  label,
  value,
  delta,
  icon,
  className,
}: {
  label: string
  value: ReactNode
  delta?: StatDelta
  icon?: ReactNode
  className?: string
}) {
  return (
    <div
      data-slot="stat-card"
      className={cn("flex items-start justify-between gap-3 rounded-xl border bg-card p-4", className)}
    >
      <div className="min-w-0">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="mt-1 text-2xl font-semibold tracking-tight tabular-nums">{value}</p>
        {delta && (
          <p className={cn("mt-1 text-xs font-medium", DELTA_CLASS[delta.tone ?? "good"])}>
            {delta.text}
          </p>
        )}
      </div>
      {icon && (
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground [&_svg]:size-4">
          {icon}
        </div>
      )}
    </div>
  )
}
