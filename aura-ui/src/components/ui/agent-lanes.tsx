"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

type AgentLaneItem = {
  id: string
  label: string
  agent?: string
}

type AgentLane = {
  id: string
  title: string
  items: AgentLaneItem[]
}

function AgentLanes({
  lanes,
  className,
  ...props
}: React.ComponentProps<"div"> & { lanes: AgentLane[] }) {
  return (
    <div
      data-slot="agent-lanes"
      className={cn("flex gap-3 overflow-x-auto pb-2", className)}
      {...props}
    >
      {lanes.map((lane) => (
        <div
          key={lane.id}
          data-slot="agent-lane"
          className="flex w-64 shrink-0 flex-col gap-3 rounded-xl bg-muted/40 p-3 ring-1 ring-foreground/10"
        >
          <div
            data-slot="agent-lane-header"
            className="flex items-center justify-between gap-2"
          >
            <span className="font-heading text-sm font-medium text-foreground">
              {lane.title}
            </span>
            <Badge variant="secondary">{lane.items.length}</Badge>
          </div>
          <div className="flex flex-col gap-2">
            {lane.items.length === 0 ? (
              <p
                data-slot="agent-lane-empty"
                className="rounded-lg border border-dashed border-border px-3 py-6 text-center text-xs text-muted-foreground"
              >
                Vazio
              </p>
            ) : (
              lane.items.map((item) => (
                <div
                  key={item.id}
                  data-slot="agent-lane-item"
                  className="flex flex-col gap-0.5 rounded-lg bg-card p-3 text-sm text-card-foreground ring-1 ring-foreground/10"
                >
                  <span className="font-medium">{item.label}</span>
                  {item.agent != null && (
                    <span className="text-xs text-muted-foreground">
                      {item.agent}
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export { AgentLanes }
export type { AgentLane, AgentLaneItem }
