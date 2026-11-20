"use client"

import * as React from "react"
import { CheckIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export type StepperFormStep = {
  id: string
  label: string
  content?: React.ReactNode
}

export type StepperFormProps = Omit<React.ComponentProps<"div">, "onChange"> & {
  steps: StepperFormStep[]
  /** Controlled current step (0-based) */
  current?: number
  /** Initial step for the uncontrolled case (0-based) */
  defaultCurrent?: number
  onStepChange?: (index: number) => void
  onFinish?: () => void
}

function StepperForm({
  steps,
  current: currentProp,
  defaultCurrent = 0,
  onStepChange,
  onFinish,
  className,
  ...props
}: StepperFormProps) {
  const [uncontrolledCurrent, setUncontrolledCurrent] =
    React.useState(defaultCurrent)
  const isControlled = currentProp !== undefined
  const current = isControlled ? currentProp : uncontrolledCurrent

  const total = steps.length
  const clamped = Math.min(Math.max(current, 0), Math.max(total - 1, 0))
  const isFirst = clamped <= 0
  const isLast = clamped >= total - 1

  const setCurrent = React.useCallback(
    (next: number) => {
      if (!isControlled) {
        setUncontrolledCurrent(next)
      }
      onStepChange?.(next)
    },
    [isControlled, onStepChange]
  )

  const handleBack = () => {
    if (isFirst) return
    setCurrent(clamped - 1)
  }

  const handleNext = () => {
    if (isLast) {
      onFinish?.()
      return
    }
    setCurrent(clamped + 1)
  }

  const activeStep = steps[clamped]

  return (
    <div
      data-slot="stepper-form"
      className={cn(
        "flex w-full max-w-md flex-col gap-5 rounded-xl border border-border bg-card p-5 text-card-foreground shadow-sm",
        className
      )}
      {...props}
    >
      <ol className="flex items-center gap-1">
        {steps.map((step, index) => {
          const isDone = index < clamped
          const isCurrent = index === clamped
          const state = isDone ? "done" : isCurrent ? "current" : "upcoming"
          return (
            <li
              key={step.id}
              data-state={state}
              className="flex min-w-0 flex-1 items-center gap-1 last:flex-none"
            >
              <div className="flex min-w-0 items-center gap-2">
                <span
                  aria-hidden="true"
                  className={cn(
                    "flex size-6 shrink-0 items-center justify-center rounded-full border text-xs font-medium tabular-nums transition-colors",
                    isDone && "border-transparent bg-success-soft text-success",
                    isCurrent &&
                      "border-transparent bg-primary text-primary-foreground",
                    !isDone &&
                      !isCurrent &&
                      "border-border bg-background text-muted-foreground"
                  )}
                >
                  {isDone ? <CheckIcon className="size-3.5" /> : index + 1}
                </span>
                <span
                  dir="auto"
                  title={step.label || undefined}
                  className={cn(
                    "min-w-0 truncate text-sm font-medium",
                    isCurrent ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {step.label}
                </span>
              </div>
              {index < total - 1 && (
                <span
                  aria-hidden="true"
                  className={cn(
                    "h-px min-w-3 flex-1",
                    isDone ? "bg-success" : "bg-border"
                  )}
                />
              )}
            </li>
          )
        })}
      </ol>

      <div data-slot="stepper-form-body" className="min-h-24 text-sm">
        {activeStep?.content}
      </div>

      <div
        data-slot="stepper-form-footer"
        className="flex items-center justify-between gap-2"
      >
        <Button
          type="button"
          variant="outline"
          onClick={handleBack}
          disabled={isFirst}
        >
          <ChevronLeftIcon data-icon="inline-start" />
          Voltar
        </Button>
        <Button type="button" onClick={handleNext}>
          {isLast ? (
            <>
              Concluir
              <CheckIcon data-icon="inline-end" />
            </>
          ) : (
            <>
              Avançar
              <ChevronRightIcon data-icon="inline-end" />
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

export { StepperForm }
