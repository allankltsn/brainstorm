"use client"

import * as React from "react"
import { PauseIcon } from "lucide-react"
import { cn } from "@/lib/utils"

type RunningNowStatus = "running" | "paused"

function LiveDot({ status }: { status: RunningNowStatus }) {
  if (status === "paused") {
    return (
      <span
        data-slot="running-now-indicator"
        data-status="paused"
        aria-hidden="true"
        className="flex size-4 shrink-0 items-center justify-center text-muted-foreground"
      >
        <PauseIcon className="size-3 fill-current" />
      </span>
    )
  }
  return (
    <span
      data-slot="running-now-indicator"
      data-status="running"
      aria-hidden="true"
      className="relative flex size-2 shrink-0"
    >
      <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-75 motion-reduce:animate-none" />
      <span className="relative inline-flex size-2 rounded-full bg-primary" />
    </span>
  )
}

function RunningNow({
  agent,
  step,
  elapsed,
  status = "running",
  className,
  ...props
}: React.ComponentProps<"div"> & {
  agent: string
  step?: string
  elapsed?: string
  status?: RunningNowStatus
}) {
  const label = status === "paused" ? "Pausado" : "Executando agora"

  return (
    <div
      data-slot="running-now"
      data-status={status}
      role="status"
      aria-live="polite"
      className={cn(
        "flex h-8 w-fit max-w-full items-center gap-2 rounded-full border border-border bg-card px-3 text-sm",
        className
      )}
      {...props}
    >
      <span className="sr-only">{label}: </span>
      <LiveDot status={status} />
      <span
        data-slot="running-now-agent"
        className="shrink-0 font-medium text-foreground"
      >
        {agent}
      </span>
      {step ? (
        <span
          data-slot="running-now-step"
          className="min-w-0 flex-1 truncate text-muted-foreground"
        >
          {step}
        </span>
      ) : null}
      {elapsed ? (
        <span
          data-slot="running-now-elapsed"
          className="ml-auto shrink-0 font-mono text-xs tabular-nums text-muted-foreground"
        >
          {elapsed}
        </span>
      ) : null}
    </div>
  )
}

export { RunningNow }
