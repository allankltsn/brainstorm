"use client"

import * as React from "react"
import { CircleIcon, CircleCheckIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"

export type SetupStep = {
  id: string
  label: string
  description?: string
  done?: boolean
  actionLabel?: string
}

export type SetupGuideProps = React.ComponentProps<"div"> & {
  steps: SetupStep[]
  onAction?: (id: string) => void
  title?: string
}

export function SetupGuide({
  steps,
  onAction,
  title = "Primeiros passos",
  className,
  ...props
}: SetupGuideProps) {
  const total = steps.length
  const count = steps.filter((s) => s.done).length
  const progress = total ? (count / total) * 100 : 0

  // The first still-open step is the one we nudge the user toward
  const activeId = steps.find((s) => !s.done)?.id

  return (
    <div
      data-slot="setup-guide"
      data-complete={total > 0 && count === total || undefined}
      className={cn(
        "w-full max-w-sm rounded-xl border border-border bg-card p-4 text-card-foreground shadow-sm",
        className
      )}
      {...props}
    >
      <div className="flex items-baseline justify-between gap-3 px-1">
        <h3
          dir="auto"
          title={title}
          className="min-w-0 truncate text-base font-medium tracking-tight"
        >
          {title}
        </h3>
        <span className="whitespace-nowrap text-sm tabular-nums text-muted-foreground">
          {count} de {total} concluídos
        </span>
      </div>

      <Progress
        value={progress}
        aria-label={title}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={count}
        aria-valuetext={`${count} de ${total} concluídos`}
        className="my-3"
      />

      <ul className="flex flex-col gap-0.5">
        {steps.map((step) => {
          const done = !!step.done
          const isActive = step.id === activeId
          return (
            <li
              key={step.id}
              className="flex items-start gap-3 rounded-lg px-1.5 py-2"
            >
              <span aria-hidden="true" className="flex shrink-0 pt-0.5">
                {done ? (
                  <CircleCheckIcon className="size-5 fill-success text-background" />
                ) : (
                  <CircleIcon className="size-5 text-muted-foreground/40" />
                )}
              </span>

              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span
                  dir="auto"
                  className={cn(
                    "text-sm",
                    done && "text-muted-foreground line-through"
                  )}
                >
                  {step.label}
                </span>
                {step.description && (
                  <span dir="auto" className="text-xs text-muted-foreground">
                    {step.description}
                  </span>
                )}
              </div>

              {isActive && (
                <Button
                  type="button"
                  size="sm"
                  className="shrink-0"
                  onClick={() => onAction?.(step.id)}
                >
                  {step.actionLabel ?? "Fazer"}
                </Button>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
