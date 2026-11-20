"use client"

import * as React from "react"
import { CheckIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export type ModelOption = {
  id: string
  name: string
  /** Routing fit, 0–100 */
  score: number
  /** Relative cost, e.g. "$$" or "US$ 3/M" */
  cost?: string
  /** Expected latency, e.g. "~1.2s" */
  latency?: string
  /** Marks the model the request was routed to */
  selected?: boolean
}

export type ModelRouterProps = React.ComponentProps<"div"> & {
  /** The incoming request, shown as a muted quote above the ranking */
  request?: string
  models: ModelOption[]
}

/** Clamp any input to an integer 0–100; non-numbers read as 0 */
const toScore = (s: unknown): number => {
  const n = Math.round(Number(s))
  return Number.isFinite(n) ? Math.min(100, Math.max(0, n)) : 0
}

function ModelRouter({
  request,
  models,
  className,
  ...props
}: ModelRouterProps) {
  // Highest fit first; stable for equal scores
  const ranked = React.useMemo(
    () =>
      models
        .map((m, i) => ({ m, i }))
        .sort((a, b) => toScore(b.m.score) - toScore(a.m.score) || a.i - b.i)
        .map(({ m }) => m),
    [models]
  )

  return (
    <div
      data-slot="model-router"
      className={cn("flex w-full max-w-[440px] flex-col gap-3", className)}
      {...props}
    >
      {request ? (
        <blockquote
          dir="auto"
          className="border-l-2 border-border pl-3 text-sm text-muted-foreground italic"
        >
          {request}
        </blockquote>
      ) : null}

      <ul className="flex flex-col gap-2">
        {ranked.map((model) => {
          const score = toScore(model.score)
          const selected = model.selected === true
          return (
            <li
              key={model.id}
              data-selected={selected || undefined}
              className={cn(
                "flex flex-col gap-2 rounded-lg border border-border p-3 transition-colors",
                selected && "border-primary bg-primary/5 ring-1 ring-primary/40"
              )}
            >
              <div className="flex items-center gap-2">
                {selected ? (
                  <CheckIcon className="size-4 shrink-0 text-primary" />
                ) : null}
                <span
                  dir="auto"
                  title={model.name}
                  className={cn(
                    "min-w-0 flex-1 truncate text-sm font-medium text-foreground",
                    selected && "text-primary"
                  )}
                >
                  {model.name}
                </span>
                {selected ? <Badge>Escolhido</Badge> : null}
                <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                  {score}
                </span>
              </div>

              <Progress
                value={score}
                aria-label={`Afinidade de ${model.name}`}
                className={cn(!selected && "opacity-70")}
              />

              {model.cost || model.latency ? (
                <div className="flex flex-wrap items-center gap-1.5">
                  {model.cost ? (
                    <span className="rounded-md bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
                      {model.cost}
                    </span>
                  ) : null}
                  {model.latency ? (
                    <span className="rounded-md bg-muted px-1.5 py-0.5 text-xs tabular-nums text-muted-foreground">
                      {model.latency}
                    </span>
                  ) : null}
                </div>
              ) : null}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export { ModelRouter }
