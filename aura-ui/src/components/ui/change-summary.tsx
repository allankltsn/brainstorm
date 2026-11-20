import type { ReactNode } from "react"
import { ActivityIcon, ArrowDownIcon, ArrowUpIcon, MinusIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export type MetricChange = {
  label: string
  /** What happened, in words, e.g. "Up 6.1% to 18.2K" */
  change: string
  /** good: green arrow · bad: red arrow · neutral: gray dash */
  tone?: "good" | "bad" | "neutral"
  /** Direction of the arrow – defaults to up for good, down for bad */
  direction?: "up" | "down"
}

export type ChangeSummaryProps = {
  title?: string
  /** Small text on the right of the heading, e.g. "This week" */
  period?: string
  icon?: ReactNode
  changes: MetricChange[]
  className?: string
}

const TONE_CLASS = {
  good: "text-success",
  bad: "text-destructive",
  neutral: "text-muted-foreground",
} as const

/* Resumo de mudanças: o que mudou desde a última vez, uma métrica por linha. */
export function ChangeSummary({
  title = "O que mudou",
  period,
  icon,
  changes,
  className,
}: ChangeSummaryProps) {
  return (
    <section
      data-slot="change-summary"
      aria-label={title}
      className={cn("w-full max-w-120 rounded-2xl bg-muted/50 p-1.5", className)}
    >
      <header className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm">
        <span className="flex min-w-0 items-center gap-2 font-medium text-foreground">
          <span className="flex size-4 shrink-0 items-center justify-center [&_svg]:size-4">
            {icon ?? <ActivityIcon aria-hidden="true" />}
          </span>
          <span className="truncate" dir="auto" title={title}>
            {title}
          </span>
        </span>
        {period && (
          <span
            className="min-w-0 max-w-[50%] shrink truncate text-xs text-muted-foreground"
            dir="auto"
            title={period}
          >
            {period}
          </span>
        )}
      </header>

      {changes.length > 0 && (
        <dl
          data-slot="change-summary-list"
          className="overflow-hidden rounded-xl bg-card text-card-foreground ring-1 ring-foreground/10"
        >
          {changes.map((c, i) => {
            const tone = c.tone === "good" || c.tone === "bad" ? c.tone : "neutral"
            const direction = c.direction ?? (tone === "bad" ? "down" : "up")
            return (
              <div
                key={`${i}-${c.label}`}
                data-slot="change-summary-row"
                className="grid min-h-13 grid-cols-1 items-center gap-1 px-5 py-2.5 transition-colors not-first:border-t hover:bg-muted/50 sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] sm:gap-4"
              >
                <dt
                  className="truncate text-sm font-medium"
                  dir="auto"
                  title={c.label}
                >
                  {c.label}
                </dt>
                <dd className="flex min-w-0 items-center gap-2 text-sm text-muted-foreground">
                  <span
                    data-slot="change-summary-trend"
                    data-tone={tone}
                    aria-hidden="true"
                    className={cn(
                      "flex size-5 shrink-0 items-center justify-center rounded-md bg-muted [&_svg]:size-3",
                      TONE_CLASS[tone]
                    )}
                  >
                    {tone === "neutral" ? (
                      <MinusIcon />
                    ) : direction === "down" ? (
                      <ArrowDownIcon />
                    ) : (
                      <ArrowUpIcon />
                    )}
                  </span>
                  <span className="min-w-0 whitespace-pre-line [overflow-wrap:anywhere]" dir="auto" title={c.change}>
                    {c.change}
                  </span>
                </dd>
              </div>
            )
          })}
        </dl>
      )}
    </section>
  )
}
