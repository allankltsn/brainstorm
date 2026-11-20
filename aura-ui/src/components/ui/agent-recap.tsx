"use client"

import * as React from "react"
import { CheckIcon, XIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export type AgentRecapStat = {
  label: string
  value: string | number
}

export type AgentRecapAction = {
  id: string
  label: string
  status?: "done" | "error"
}

export type AgentRecapProps = React.ComponentProps<"div"> & {
  title?: string
  summary: string
  stats?: AgentRecapStat[]
  actions?: AgentRecapAction[]
}

const STATUS_CLASS = {
  done: "text-primary",
  error: "text-destructive",
} as const

/* Recap de execução: resumo final de um agente — o que fez, números-chave e ações. */
function AgentRecap({
  title = "Resumo da execução",
  summary,
  stats,
  actions,
  className,
  ...props
}: AgentRecapProps) {
  const hasStats = stats && stats.length > 0
  const hasActions = actions && actions.length > 0

  return (
    <Card
      data-slot="agent-recap"
      className={cn("w-full max-w-120 gap-4", className)}
      {...props}
    >
      <CardHeader>
        <CardTitle dir="auto">{title}</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <p
          data-slot="agent-recap-summary"
          className="text-sm text-muted-foreground [overflow-wrap:anywhere]"
          dir="auto"
        >
          {summary}
        </p>

        {hasStats && (
          <dl
            data-slot="agent-recap-stats"
            className="grid grid-cols-2 gap-2 sm:grid-cols-3"
          >
            {stats.map((stat, i) => (
              <div
                key={`${i}-${stat.label}`}
                data-slot="agent-recap-stat"
                className="min-w-0 rounded-lg bg-muted/50 px-3 py-2"
              >
                <dt
                  className="truncate text-xs text-muted-foreground"
                  dir="auto"
                  title={stat.label}
                >
                  {stat.label}
                </dt>
                <dd className="mt-0.5 truncate text-sm font-medium tabular-nums">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        )}

        {hasActions && (
          <ul data-slot="agent-recap-actions" className="flex flex-col gap-1.5">
            {actions.map((action) => {
              const status = action.status === "error" ? "error" : "done"
              return (
                <li
                  key={action.id}
                  data-slot="agent-recap-action"
                  data-status={status}
                  className="flex items-center gap-2 text-sm"
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "flex size-5 shrink-0 items-center justify-center rounded-md bg-muted [&_svg]:size-3",
                      STATUS_CLASS[status]
                    )}
                  >
                    {status === "error" ? <XIcon /> : <CheckIcon />}
                  </span>
                  <span
                    className="min-w-0 flex-1 truncate"
                    dir="auto"
                    title={action.label}
                  >
                    {action.label}
                  </span>
                </li>
              )
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

export { AgentRecap }
