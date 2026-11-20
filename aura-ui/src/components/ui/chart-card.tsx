import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

export type Delta = { text: string; tone?: "good" | "bad" | "neutral" }

const DELTA_CLASS = {
  good: "bg-success-soft text-success",
  bad: "bg-destructive/10 text-destructive",
  neutral: "bg-muted text-muted-foreground",
} as const

/*
 * Moldura única de gráfico e de relatório: rótulo discreto, número grande com a variação ao lado,
 * o gráfico e, se fizer sentido, uma linha de rodapé dizendo o que se compara.
 */
export function ChartCard({
  label,
  value,
  delta,
  hint,
  action,
  footer,
  children,
  className,
}: {
  label: string
  value?: ReactNode
  delta?: Delta
  hint?: ReactNode
  action?: ReactNode
  footer?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <section
      data-slot="chart-card"
      className={cn("flex min-w-0 flex-col rounded-xl border bg-card", className)}
    >
      <header className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2 px-5 pt-4">
        <div className="min-w-0">
          <h2 className="text-sm text-muted-foreground">{label}</h2>
          {value !== undefined && (
            <p className="mt-1.5 flex flex-wrap items-center gap-2">
              <span className="text-2xl font-semibold tracking-tight tabular-nums">{value}</span>
              {delta && (
                <span
                  className={cn(
                    "inline-flex h-5 items-center rounded-full px-2 text-xs font-medium",
                    DELTA_CLASS[delta.tone ?? "good"],
                  )}
                >
                  {delta.text}
                </span>
              )}
            </p>
          )}
          {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
        </div>
        {action}
      </header>
      <div className="flex-1 px-5 pt-4 pb-5">{children}</div>
      {footer && (
        <footer className="border-t px-5 py-3 text-xs text-muted-foreground">{footer}</footer>
      )}
    </section>
  )
}
