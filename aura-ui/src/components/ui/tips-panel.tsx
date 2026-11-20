"use client"

import * as React from "react"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"
import { Kbd } from "@/components/ui/kbd"

export type Tip = {
  id: string
  title: string
  /** Short explanation – may contain a <Kbd> */
  description: React.ReactNode
  /** Button text */
  action: string
  /** Text after the action was taken, e.g. "Enabled" */
  doneLabel?: string
  /** Shows the action as the primary button – use once for the most important tip */
  primary?: boolean
  onAction?: () => void
}

export type TipsPanelProps = {
  title?: string
  tips: Tip[]
  /** Shows the Close button in the footer */
  onClose?: () => void
  closeLabel?: string
  className?: string
}

const count = new Intl.NumberFormat("en")

function TipsPanel({
  title = "Dicas",
  tips,
  onClose,
  closeLabel = "Fechar",
  className,
}: TipsPanelProps) {
  const [done, setDone] = React.useState<Set<string>>(new Set())

  // Tips that share an id still get their own key, so marking one never marks the other
  const seen = new Map<string, number>()
  const keyed = tips.map((tip) => {
    const n = seen.get(tip.id) ?? 0
    seen.set(tip.id, n + 1)
    return { tip, key: n ? `${tip.id}#${n}` : tip.id }
  })
  // Only tips that are still in the list count
  const doneCount = keyed.filter((k) => done.has(k.key)).length

  return (
    <section
      data-slot="tips-panel"
      aria-label={title}
      className={cn(
        "flex w-full max-w-[760px] flex-col gap-3 rounded-xl bg-muted/50 p-1.5 ring-1 ring-foreground/10",
        className
      )}
    >
      <header className="flex items-baseline justify-between gap-3 px-3.5 pt-2.5 pb-1">
        <h3
          dir="auto"
          className="min-w-0 font-heading text-base leading-snug font-medium break-words"
        >
          {title}
        </h3>
        <span
          aria-live="polite"
          className="flex-none text-sm tabular-nums text-muted-foreground"
        >
          {count.format(doneCount)}/{count.format(tips.length)} feitas
        </span>
      </header>

      <div className="@container/tips max-h-[420px] overflow-y-auto rounded-xl bg-card ring-1 ring-border">
        <ul className="m-0 grid list-none grid-cols-3 gap-3 p-3.5 @max-[560px]/tips:grid-cols-2 @max-[380px]/tips:grid-cols-1">
          {keyed.map(({ tip, key }) => {
            const isDone = done.has(key)
            return (
              <li
                key={key}
                data-slot="tips-panel-tip"
                data-done={isDone || undefined}
                className="flex flex-col items-start rounded-lg border border-border p-4 transition-colors data-[done]:bg-muted/60"
              >
                <p
                  dir="auto"
                  className="m-0 max-w-full text-sm leading-tight font-medium break-words"
                >
                  {tip.title}
                </p>
                <p
                  dir="auto"
                  className="mt-1.5 mb-3.5 max-w-full flex-1 text-[0.8rem] leading-relaxed whitespace-pre-line break-words text-muted-foreground"
                >
                  {tip.description}
                </p>
                {isDone ? (
                  <span
                    role="status"
                    className="inline-flex min-h-[30px] max-w-full items-center gap-1.5 text-[0.8rem] font-medium text-primary"
                  >
                    <Check className="size-4" aria-hidden="true" />
                    {tip.doneLabel ?? "Feito"}
                  </span>
                ) : (
                  <button
                    type="button"
                    data-slot="tips-panel-action"
                    data-variant={tip.primary ? "primary" : "default"}
                    onClick={() => {
                      setDone((d) => new Set(d).add(key))
                      tip.onAction?.()
                    }}
                    className={cn(
                      "inline-flex min-h-[30px] max-w-full items-center rounded-lg border px-3 py-1 text-[0.8rem] font-medium break-words transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:translate-y-px",
                      tip.primary
                        ? "border-transparent bg-primary text-primary-foreground hover:bg-primary/80"
                        : "border-border bg-background text-foreground hover:bg-muted"
                    )}
                  >
                    {tip.action}
                  </button>
                )}
              </li>
            )
          })}
        </ul>
      </div>

      {onClose && (
        <footer className="flex px-1.5 pb-1.5">
          <button
            type="button"
            data-slot="tips-panel-close"
            onClick={onClose}
            className="inline-flex min-h-[30px] items-center rounded-lg border border-border bg-background px-3 py-1 text-[0.8rem] font-medium text-foreground transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:translate-y-px hover:bg-muted"
          >
            {closeLabel}
          </button>
        </footer>
      )}
    </section>
  )
}

export { TipsPanel, Kbd }
