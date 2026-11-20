"use client"

import * as React from "react"
import { CalendarIcon, ClockIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"

type ScheduledRun = {
  id: string
  label: string
  schedule: string
  nextRun?: string
  enabled?: boolean
}

function ScheduledRuns({
  runs,
  onToggle,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  runs: ScheduledRun[]
  onToggle?: (id: string, enabled: boolean) => void
}) {
  return (
    <div
      data-slot="scheduled-runs"
      className={cn("flex flex-col divide-y divide-border", className)}
      {...props}
    >
      {runs.map((run) => {
        const enabled = run.enabled ?? false
        return (
          <div
            key={run.id}
            data-slot="scheduled-runs-item"
            data-enabled={enabled}
            className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
          >
            <span
              aria-hidden
              className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-full",
                enabled
                  ? "bg-primary/10 text-primary"
                  : "bg-muted text-muted-foreground"
              )}
            >
              <ClockIcon className="size-4" />
            </span>

            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <p className="truncate text-sm leading-none font-medium">
                {run.label}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="font-mono">
                  {run.schedule}
                </Badge>
                {run.nextRun != null && (
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <CalendarIcon className="size-3" />
                    Próxima: {run.nextRun}
                  </span>
                )}
              </div>
            </div>

            <Switch
              checked={enabled}
              aria-label={`Alternar ${run.label}`}
              onCheckedChange={(checked) => onToggle?.(run.id, checked)}
            />
          </div>
        )
      })}
    </div>
  )
}

export { ScheduledRuns }
export type { ScheduledRun }
