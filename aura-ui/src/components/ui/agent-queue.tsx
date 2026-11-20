"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

type AgentQueueItem = {
  id: string
  label: string
  priority?: "low" | "normal" | "high"
  eta?: string
  status?: "queued" | "running" | "done"
}

const priorityVariant = {
  high: "destructive",
  normal: "secondary",
  low: "outline",
} as const

const priorityLabel = {
  high: "Alta",
  normal: "Normal",
  low: "Baixa",
} as const

function AgentQueue({
  items,
  className,
  ...props
}: React.ComponentProps<"div"> & { items: AgentQueueItem[] }) {
  return (
    <div
      data-slot="agent-queue"
      className={cn(
        "flex flex-col divide-y divide-border rounded-xl border border-border",
        className
      )}
      {...props}
    >
      {items.map((item, index) => {
        const priority = item.priority ?? "normal"
        const isRunning = item.status === "running"
        return (
          <div
            key={item.id}
            data-slot="agent-queue-item"
            data-status={item.status ?? "queued"}
            data-priority={priority}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5",
              isRunning && "bg-muted/50"
            )}
          >
            <span className="w-5 shrink-0 text-right font-mono text-xs text-muted-foreground">
              {index + 1}
            </span>
            <div className="flex min-w-0 flex-1 items-center gap-2">
              {isRunning && (
                <span
                  aria-hidden
                  className="size-2 shrink-0 animate-pulse rounded-full bg-primary"
                />
              )}
              <span
                className={cn(
                  "truncate text-sm font-medium",
                  item.status === "done" && "text-muted-foreground line-through"
                )}
              >
                {item.label}
              </span>
            </div>
            <Badge variant={priorityVariant[priority]}>
              {priorityLabel[priority]}
            </Badge>
            {item.eta != null && (
              <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
                {item.eta}
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}

export { AgentQueue }
export type { AgentQueueItem }
