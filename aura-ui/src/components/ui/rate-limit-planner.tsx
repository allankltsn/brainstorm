"use client"

import * as React from "react"
import { AlertTriangle, Ban } from "lucide-react"
import { cn } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

type RateLimit = {
  id: string
  label: string
  used: number
  cap: number
  unit?: string
}

function format(n: number) {
  return n.toLocaleString("pt-BR")
}

function RateLimitPlanner({
  limits,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  limits: RateLimit[]
}) {
  return (
    <div
      data-slot="rate-limit-planner"
      className={cn("flex w-full flex-col gap-4", className)}
      {...props}
    >
      {limits.map((limit) => {
        const pct = Math.min(100, Math.round((limit.used / limit.cap) * 100))
        const state = pct >= 100 ? "over" : pct >= 80 ? "near" : "ok"

        return (
          <div
            key={limit.id}
            data-slot="rate-limit-item"
            data-state={state}
            className="flex w-full flex-col gap-1.5"
          >
            <div className="flex items-baseline justify-between gap-2">
              <span className="flex items-center gap-1.5 text-sm font-medium">
                {limit.label}
                {state === "near" && (
                  <Badge variant="outline" className="text-warning">
                    <AlertTriangle />
                    Atenção
                  </Badge>
                )}
                {state === "over" && (
                  <Badge variant="destructive">
                    <Ban />
                    Estourado
                  </Badge>
                )}
              </span>
              <span
                className={cn(
                  "ml-auto text-xs text-muted-foreground tabular-nums",
                  state === "near" && "text-warning",
                  state === "over" && "text-destructive"
                )}
              >
                {format(limit.used)} / {format(limit.cap)}
                {limit.unit ? ` ${limit.unit}` : null}
              </span>
            </div>
            <Progress
              value={pct}
              className={cn(
                state === "near" && "[&>[data-slot=progress-indicator]]:bg-warning",
                state === "over" &&
                  "[&>[data-slot=progress-indicator]]:bg-destructive"
              )}
            />
          </div>
        )
      })}
    </div>
  )
}

export { RateLimitPlanner, type RateLimit }
