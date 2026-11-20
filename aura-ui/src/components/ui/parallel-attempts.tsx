"use client"

import * as React from "react"
import { CheckIcon, LoaderIcon, TriangleAlertIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

type ParallelAttemptStatus = "running" | "done" | "error"

type ParallelAttempt = {
  id: string
  label: string
  status: ParallelAttemptStatus
  best?: boolean
  result?: string
}

type StatusConfig = {
  label: string
  variant: React.ComponentProps<typeof Badge>["variant"]
  icon: React.ComponentType<{ className?: string }>
  dot: string
}

const STATUS_CONFIG: Record<ParallelAttemptStatus, StatusConfig> = {
  running: {
    label: "Em execução",
    variant: "default",
    icon: LoaderIcon,
    dot: "bg-primary",
  },
  done: {
    label: "Concluído",
    variant: "secondary",
    icon: CheckIcon,
    dot: "bg-success",
  },
  error: {
    label: "Erro",
    variant: "destructive",
    icon: TriangleAlertIcon,
    dot: "bg-destructive",
  },
}

function ParallelAttempts({
  attempts,
  title,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  attempts: ParallelAttempt[]
  title?: string
}) {
  return (
    <div
      data-slot="parallel-attempts"
      className={cn("flex flex-col gap-3", className)}
      {...props}
    >
      {title != null && (
        <h3 className="text-sm font-medium text-foreground">{title}</h3>
      )}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {attempts.map((attempt) => {
          const status = STATUS_CONFIG[attempt.status]
          const StatusIcon = status.icon
          return (
            <div
              key={attempt.id}
              data-slot="parallel-attempts-item"
              data-status={attempt.status}
              data-best={attempt.best ? "" : undefined}
              className={cn(
                "flex flex-col gap-3 overflow-hidden rounded-xl bg-card p-4 text-sm text-card-foreground ring-1 ring-foreground/10",
                attempt.best && "ring-2 ring-primary"
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2">
                  <span
                    aria-hidden="true"
                    className={cn(
                      "size-2 shrink-0 rounded-full",
                      status.dot,
                      attempt.status === "running" && "animate-pulse"
                    )}
                  />
                  <span className="truncate font-medium">{attempt.label}</span>
                </div>
                {attempt.best ? (
                  <Badge>Melhor</Badge>
                ) : (
                  <Badge variant={status.variant}>
                    <StatusIcon
                      className={cn(
                        attempt.status === "running" && "animate-spin"
                      )}
                    />
                    {status.label}
                  </Badge>
                )}
              </div>
              {attempt.result != null && (
                <p className="truncate text-xs text-muted-foreground">
                  {attempt.result}
                </p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export { ParallelAttempts }
export type { ParallelAttempt, ParallelAttemptStatus }
