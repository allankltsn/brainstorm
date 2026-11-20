"use client"

import * as React from "react"
import { CheckIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export type AgentCandidate = {
  id: string
  name: string
  /** Routing fit, 0–100 */
  score: number
  /** Marks the agent the request was routed to */
  selected?: boolean
  /** One line on why this agent ranked where it did */
  reason?: string
}

export type AgentRouterProps = React.ComponentProps<"div"> & {
  /** The incoming request, shown as a muted quote above the ranking */
  request?: string
  candidates: AgentCandidate[]
}

/** Clamp any input to an integer 0–100; non-numbers read as 0 */
const toScore = (s: unknown): number => {
  const n = Math.round(Number(s))
  return Number.isFinite(n) ? Math.min(100, Math.max(0, n)) : 0
}

function AgentRouter({
  request,
  candidates,
  className,
  ...props
}: AgentRouterProps) {
  // Highest fit first; stable for equal scores
  const ranked = React.useMemo(
    () =>
      candidates
        .map((c, i) => ({ c, i }))
        .sort((a, b) => toScore(b.c.score) - toScore(a.c.score) || a.i - b.i)
        .map(({ c }) => c),
    [candidates]
  )

  return (
    <div
      data-slot="agent-router"
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
        {ranked.map((candidate) => {
          const score = toScore(candidate.score)
          const selected = candidate.selected === true
          return (
            <li
              key={candidate.id}
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
                  title={candidate.name}
                  className={cn(
                    "min-w-0 flex-1 truncate text-sm font-medium text-foreground",
                    selected && "text-primary"
                  )}
                >
                  {candidate.name}
                </span>
                {selected ? <Badge>Escolhido</Badge> : null}
                <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                  {score}
                </span>
              </div>

              <Progress
                value={score}
                aria-label={`Afinidade de ${candidate.name}`}
                className={cn(!selected && "opacity-70")}
              />

              {candidate.reason ? (
                <p
                  dir="auto"
                  className="text-xs leading-relaxed text-muted-foreground"
                >
                  {candidate.reason}
                </p>
              ) : null}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export { AgentRouter }
