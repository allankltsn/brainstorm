import * as React from "react"
import { CheckIcon, CircleIcon, XIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Spinner } from "@/components/ui/spinner"

type AgentStepStatus = "done" | "active" | "pending" | "error"

type AgentStep = {
  id: string
  label: string
  status: AgentStepStatus
  detail?: React.ReactNode
}

function StepMarker({ status }: { status: AgentStepStatus }) {
  if (status === "done") {
    return (
      <span className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-primary">
        <CheckIcon className="size-3.5" />
      </span>
    )
  }
  if (status === "error") {
    return (
      <span className="flex size-6 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <XIcon className="size-3.5" />
      </span>
    )
  }
  if (status === "active") {
    return (
      <span className="flex size-6 items-center justify-center rounded-full border border-primary/30 bg-background text-primary">
        <Spinner className="size-3.5 text-primary" />
      </span>
    )
  }
  return (
    <span className="flex size-6 items-center justify-center rounded-full border border-border bg-background text-muted-foreground/40">
      <CircleIcon className="size-2 fill-current" />
    </span>
  )
}

function AgentTrail({
  steps,
  className,
  ...props
}: React.ComponentProps<"ol"> & { steps: AgentStep[] }) {
  return (
    <ol
      data-slot="agent-trail"
      className={cn("flex flex-col", className)}
      {...props}
    >
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1
        return (
          <li
            key={step.id}
            data-slot="agent-trail-item"
            data-status={step.status}
            className="flex gap-3"
          >
            <div className="flex flex-col items-center">
              <StepMarker status={step.status} />
              {!isLast && (
                <span
                  aria-hidden
                  className="w-px flex-1 border-l border-border"
                />
              )}
            </div>
            <div className={cn("pb-6", isLast && "pb-0")}>
              <p
                className={cn(
                  "text-sm leading-6 font-medium",
                  step.status === "pending" && "text-muted-foreground"
                )}
              >
                {step.label}
              </p>
              {step.detail != null && (
                <div className="mt-0.5 text-xs text-muted-foreground">
                  {step.detail}
                </div>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}

export { AgentTrail }
export type { AgentStep }
