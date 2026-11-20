"use client"

import * as React from "react"
import { CheckIcon, CircleIcon, LoaderIcon } from "lucide-react"
import { cn } from "@/lib/utils"

type PlanStepStatus = "pending" | "active" | "done" | "skipped"

type PlanStep = {
  id: string
  label: string
  status?: PlanStepStatus
  detail?: React.ReactNode
  substeps?: PlanStep[]
}

function StepMarker({ status = "pending" }: { status?: PlanStepStatus }) {
  if (status === "done") {
    return (
      <span className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-primary">
        <CheckIcon className="size-3.5" />
      </span>
    )
  }
  if (status === "active") {
    return (
      <span className="flex size-6 items-center justify-center rounded-full border border-primary/30 bg-background text-primary">
        <LoaderIcon className="size-3.5 animate-spin" />
      </span>
    )
  }
  if (status === "skipped") {
    return (
      <span className="flex size-6 items-center justify-center rounded-full border border-dashed border-border bg-background text-muted-foreground/40">
        <CircleIcon className="size-2 fill-current" />
      </span>
    )
  }
  return (
    <span className="flex size-6 items-center justify-center rounded-full border border-border bg-background text-muted-foreground/40">
      <CircleIcon className="size-2 fill-current" />
    </span>
  )
}

function PlanList({ steps }: { steps: PlanStep[] }) {
  return (
    <ol className="flex flex-col">
      {steps.map((step, index) => {
        const status = step.status ?? "pending"
        const isLast = index === steps.length - 1
        const hasSubsteps = step.substeps != null && step.substeps.length > 0
        return (
          <li
            key={step.id}
            data-slot="agent-plan-item"
            data-status={status}
            className="flex gap-3"
          >
            <div className="flex flex-col items-center">
              <StepMarker status={status} />
              {(!isLast || hasSubsteps) && (
                <span
                  aria-hidden
                  className="w-px flex-1 border-l border-border"
                />
              )}
            </div>
            <div className={cn("flex-1 pb-6", isLast && !hasSubsteps && "pb-0")}>
              <p
                className={cn(
                  "text-sm leading-6",
                  status === "active" && "font-medium",
                  status === "pending" && "text-muted-foreground",
                  status === "skipped" &&
                    "text-muted-foreground line-through"
                )}
              >
                {step.label}
              </p>
              {step.detail != null && (
                <div className="mt-0.5 text-xs text-muted-foreground">
                  {step.detail}
                </div>
              )}
              {hasSubsteps && (
                <div className="mt-2">
                  <PlanList steps={step.substeps!} />
                </div>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}

function AgentPlan({
  steps,
  title,
  className,
  ...props
}: React.ComponentProps<"div"> & { steps: PlanStep[]; title?: string }) {
  return (
    <div
      data-slot="agent-plan"
      className={cn("flex flex-col gap-3", className)}
      {...props}
    >
      {title != null && (
        <h3 className="text-sm font-medium tracking-tight">{title}</h3>
      )}
      <PlanList steps={steps} />
    </div>
  )
}

export { AgentPlan }
export type { PlanStep }
