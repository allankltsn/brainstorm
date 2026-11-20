"use client"

import * as React from "react"
import { CheckIcon } from "lucide-react"
import { cn } from "@/lib/utils"

type AgentSequenceStatus = "pending" | "active" | "done"

type AgentSequenceStep = {
  id: string
  agent: string
  action?: string
  status?: AgentSequenceStatus
}

function StepNode({
  step,
  index,
}: {
  step: AgentSequenceStep
  index: number
}) {
  const status = step.status ?? "pending"
  return (
    <div
      data-slot="agent-sequence-step"
      data-status={status}
      className="flex min-w-0 shrink-0 flex-col items-center gap-2 text-center"
    >
      <span
        aria-hidden="true"
        className={cn(
          "flex size-8 items-center justify-center rounded-full border text-xs font-medium tabular-nums transition-colors",
          status === "done" && "border-primary/30 bg-primary/10 text-primary",
          status === "active" &&
            "border-primary bg-primary text-primary-foreground",
          status === "pending" &&
            "border-border bg-background text-muted-foreground"
        )}
      >
        {status === "done" ? <CheckIcon className="size-4" /> : index + 1}
      </span>
      <div className="flex min-w-0 flex-col gap-0.5">
        <span
          dir="auto"
          title={step.agent}
          className={cn(
            "max-w-[7.5rem] truncate text-sm font-medium",
            status === "pending" && "text-muted-foreground"
          )}
        >
          {step.agent}
        </span>
        {step.action && (
          <span
            dir="auto"
            title={step.action}
            className="max-w-[7.5rem] truncate text-xs text-muted-foreground"
          >
            {step.action}
          </span>
        )}
      </div>
    </div>
  )
}

function AgentSequence({
  steps,
  className,
  ...props
}: React.ComponentProps<"div"> & { steps: AgentSequenceStep[] }) {
  return (
    <div
      data-slot="agent-sequence"
      className={cn("w-full overflow-x-auto", className)}
      {...props}
    >
      <div className="flex min-w-fit flex-wrap items-start gap-x-1 gap-y-4 sm:flex-nowrap">
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1
          const connectorDone = (step.status ?? "pending") === "done"
          return (
            <React.Fragment key={step.id}>
              <StepNode step={step} index={index} />
              {!isLast && (
                <span
                  aria-hidden="true"
                  className={cn(
                    "mt-4 h-px min-w-6 flex-1 self-start border-t",
                    connectorDone ? "border-primary/40" : "border-border"
                  )}
                />
              )}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}

export { AgentSequence }
export type { AgentSequenceStep }
