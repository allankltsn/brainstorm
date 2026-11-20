"use client"

import * as React from "react"
import { CheckIcon, LoaderIcon, MinusIcon, TriangleAlertIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

type AgentFleetStatus = "idle" | "running" | "done" | "error"

type FleetAgent = {
  id: string
  name: string
  status: AgentFleetStatus
  task?: string
  progress?: number
}

type StatusConfig = {
  label: string
  variant: React.ComponentProps<typeof Badge>["variant"]
  icon: React.ComponentType<{ className?: string }>
}

const STATUS_CONFIG: Record<AgentFleetStatus, StatusConfig> = {
  idle: { label: "Ocioso", variant: "outline", icon: MinusIcon },
  running: { label: "Em execução", variant: "default", icon: LoaderIcon },
  done: { label: "Concluído", variant: "secondary", icon: CheckIcon },
  error: { label: "Erro", variant: "destructive", icon: TriangleAlertIcon },
}

function AgentFleet({
  agents,
  className,
  ...props
}: React.ComponentProps<"div"> & { agents: FleetAgent[] }) {
  return (
    <div
      data-slot="agent-fleet"
      className={cn("grid gap-3 sm:grid-cols-2 lg:grid-cols-3", className)}
      {...props}
    >
      {agents.map((agent) => {
        const status = STATUS_CONFIG[agent.status]
        const StatusIcon = status.icon
        const hasProgress = typeof agent.progress === "number"
        return (
          <div
            key={agent.id}
            data-slot="agent-fleet-item"
            data-status={agent.status}
            className="flex flex-col gap-3 overflow-hidden rounded-xl bg-card p-4 text-sm text-card-foreground ring-1 ring-foreground/10"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="truncate font-medium">{agent.name}</span>
              <Badge variant={status.variant}>
                <StatusIcon
                  className={cn(agent.status === "running" && "animate-spin")}
                />
                {status.label}
              </Badge>
            </div>
            {agent.task != null && (
              <p className="truncate text-xs text-muted-foreground">
                {agent.task}
              </p>
            )}
            {hasProgress && (
              <div className="flex flex-col gap-1">
                <Progress value={agent.progress} />
                <span className="text-xs text-muted-foreground tabular-nums">
                  {Math.round(agent.progress as number)}%
                </span>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export { AgentFleet }
export type { FleetAgent, AgentFleetStatus }
