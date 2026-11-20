"use client"

import * as React from "react"
import { CheckIcon, CircleDotIcon, XIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

type AgentStatus = "running" | "paused" | "idle" | "done" | "error"
type ToolCallStatus = "running" | "done" | "error"

type AgentWorkbenchAgent = {
  name: string
  model?: string
  status: AgentStatus
}

type AgentWorkbenchToolCall = {
  id: string
  name: string
  status?: ToolCallStatus
}

const statusLabels: Record<AgentStatus, string> = {
  running: "Executando",
  paused: "Pausado",
  idle: "Ocioso",
  done: "Concluído",
  error: "Erro",
}

const statusVariants: Record<
  AgentStatus,
  React.ComponentProps<typeof Badge>["variant"]
> = {
  running: "default",
  paused: "secondary",
  idle: "outline",
  done: "secondary",
  error: "destructive",
}

function ToolCallDot({ status = "running" }: { status?: ToolCallStatus }) {
  if (status === "done") {
    return <CheckIcon data-slot="tool-call-dot" className="size-3.5 text-success" />
  }
  if (status === "error") {
    return <XIcon data-slot="tool-call-dot" className="size-3.5 text-destructive" />
  }
  return (
    <CircleDotIcon
      data-slot="tool-call-dot"
      className="size-3.5 animate-pulse text-primary"
    />
  )
}

function AgentWorkbench({
  agent,
  currentAction,
  toolCalls = [],
  onPause,
  onStop,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  agent: AgentWorkbenchAgent
  currentAction?: string
  toolCalls?: AgentWorkbenchToolCall[]
  onPause?: () => void
  onStop?: () => void
}) {
  const isRunning = agent.status === "running"

  return (
    <Card
      data-slot="agent-workbench"
      data-status={agent.status}
      className={cn("gap-0", className)}
      {...props}
    >
      <CardHeader className="flex flex-row items-center gap-2 pb-(--card-spacing)">
        <span className="min-w-0 flex-1 truncate font-medium">{agent.name}</span>
        {agent.model && (
          <Badge variant="outline" className="font-mono">
            {agent.model}
          </Badge>
        )}
        <Badge variant={statusVariants[agent.status]}>
          {isRunning && <Spinner className="text-current" />}
          {statusLabels[agent.status]}
        </Badge>
      </CardHeader>

      <CardContent className="flex flex-col gap-3 py-(--card-spacing)">
        {currentAction && (
          <div
            data-slot="agent-workbench-action"
            className="flex items-center gap-2 text-sm text-muted-foreground"
          >
            {isRunning && (
              <span className="size-2 shrink-0 animate-pulse rounded-full bg-primary" />
            )}
            <span className="min-w-0 flex-1 truncate">{currentAction}</span>
          </div>
        )}

        {toolCalls.length > 0 && (
          <ul data-slot="agent-workbench-tools" className="flex flex-col gap-1.5">
            {toolCalls.map((call) => (
              <li key={call.id} className="flex items-center gap-2 text-sm">
                <ToolCallDot status={call.status} />
                <code className="min-w-0 flex-1 truncate font-mono text-xs">
                  {call.name}
                </code>
              </li>
            ))}
          </ul>
        )}
      </CardContent>

      <CardFooter className="justify-end gap-2">
        <Button variant="outline" size="sm" onClick={onPause}>
          Pausar
        </Button>
        <Button variant="destructive" size="sm" onClick={onStop}>
          Parar
        </Button>
      </CardFooter>
    </Card>
  )
}

export { AgentWorkbench }
export type { AgentWorkbenchAgent, AgentWorkbenchToolCall }
