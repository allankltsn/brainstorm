"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

type AgentMonitorStatus = "running" | "idle" | "done" | "error"

type AgentMonitorMetrics = {
  active: number
  queued: number
  done: number
  errors: number
}

type AgentMonitorAgent = {
  id: string
  name: string
  status: AgentMonitorStatus
}

const STATUS_DOT: Record<AgentMonitorStatus, string> = {
  running: "bg-primary",
  idle: "bg-muted-foreground/50",
  done: "bg-success",
  error: "bg-destructive",
}

const STATUS_LABEL: Record<AgentMonitorStatus, string> = {
  running: "Rodando",
  idle: "Ocioso",
  done: "Concluído",
  error: "Erro",
}

const STATUS_TEXT: Record<AgentMonitorStatus, string> = {
  running: "text-primary",
  idle: "text-muted-foreground",
  done: "text-success",
  error: "text-destructive",
}

function MetricTile({
  label,
  value,
  emphasized,
}: {
  label: string
  value: number
  emphasized?: boolean
}) {
  return (
    <div
      data-slot="agent-monitor-tile"
      data-emphasized={emphasized ? "" : undefined}
      className={cn(
        "flex flex-col gap-0.5 rounded-lg border bg-card p-3",
        emphasized && "border-destructive/30 bg-destructive/5"
      )}
    >
      <span className="text-xs text-muted-foreground">{label}</span>
      <span
        className={cn(
          "text-xl font-semibold tracking-tight tabular-nums",
          emphasized && "text-destructive"
        )}
      >
        {value}
      </span>
    </div>
  )
}

/* Painel compacto ao vivo da atividade dos agentes: tiles de métricas + lista. */
function AgentMonitor({
  metrics,
  agents,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  metrics: AgentMonitorMetrics
  agents?: AgentMonitorAgent[]
}) {
  return (
    <div
      data-slot="agent-monitor"
      className={cn("flex flex-col gap-3", className)}
      {...props}
    >
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <MetricTile label="Ativos" value={metrics.active} />
        <MetricTile label="Na fila" value={metrics.queued} />
        <MetricTile label="Concluídos" value={metrics.done} />
        <MetricTile
          label="Erros"
          value={metrics.errors}
          emphasized={metrics.errors > 0}
        />
      </div>

      {agents && agents.length > 0 && (
        <ul data-slot="agent-monitor-list" className="flex flex-col gap-1">
          {agents.map((agent) => (
            <li
              key={agent.id}
              data-slot="agent-monitor-item"
              data-status={agent.status}
              className="flex items-center gap-2 rounded-lg border bg-card px-3 py-2"
            >
              <span
                aria-hidden
                className={cn(
                  "size-2 shrink-0 rounded-full",
                  STATUS_DOT[agent.status]
                )}
              />
              <span className="min-w-0 flex-1 truncate text-sm font-medium">
                {agent.name}
              </span>
              <span
                className={cn(
                  "shrink-0 text-xs font-medium",
                  STATUS_TEXT[agent.status]
                )}
              >
                {STATUS_LABEL[agent.status]}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export { AgentMonitor }
export type { AgentMonitorMetrics, AgentMonitorAgent, AgentMonitorStatus }
