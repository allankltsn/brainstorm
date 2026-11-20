"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

type AutonomyLevel = "manual" | "supervised" | "autonomous" | (string & {})

type AutonomyLevelOption = {
  value: AutonomyLevel
  label: string
  description?: string
}

const defaultLevels: AutonomyLevelOption[] = [
  {
    value: "manual",
    label: "Manual",
    description: "Você aprova cada ação antes da execução.",
  },
  {
    value: "supervised",
    label: "Supervisionado",
    description: "O agente age sozinho, mas pede confirmação em etapas sensíveis.",
  },
  {
    value: "autonomous",
    label: "Autônomo",
    description: "O agente executa de ponta a ponta sem intervenção.",
  },
]

function AutonomyDial({
  value: valueProp,
  defaultValue,
  onValueChange,
  levels = defaultLevels,
  className,
  ...props
}: Omit<React.ComponentProps<"div">, "onChange" | "defaultValue"> & {
  value?: AutonomyLevel
  defaultValue?: AutonomyLevel
  onValueChange?: (value: AutonomyLevel) => void
  levels?: AutonomyLevelOption[]
}) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(
    defaultValue ?? levels[0]?.value
  )
  const isControlled = valueProp !== undefined
  const value = isControlled ? valueProp : uncontrolledValue

  const setValue = React.useCallback(
    (next: AutonomyLevel) => {
      if (!isControlled) {
        setUncontrolledValue(next)
      }
      onValueChange?.(next)
    },
    [isControlled, onValueChange]
  )

  const activeIndex = levels.findIndex((level) => level.value === value)
  const activeLevel = activeIndex >= 0 ? levels[activeIndex] : undefined

  return (
    <div
      data-slot="autonomy-dial"
      className={cn("flex w-full flex-col gap-2", className)}
      {...props}
    >
      <div
        role="radiogroup"
        aria-label="Nível de autonomia"
        className="relative flex items-center gap-1 rounded-full bg-muted p-1"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-4 top-1/2 h-0.5 -translate-y-1/2 rounded-full bg-border"
        />
        {levels.map((level, index) => {
          const isActive = level.value === value
          const isReached = activeIndex >= 0 && index <= activeIndex

          return (
            <button
              key={level.value}
              type="button"
              role="radio"
              data-slot="autonomy-dial-item"
              data-state={isActive ? "active" : "inactive"}
              aria-checked={isActive}
              onClick={() => setValue(level.value)}
              className={cn(
                "relative z-10 flex flex-1 items-center justify-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium whitespace-nowrap transition outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : isReached
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "size-1.5 shrink-0 rounded-full transition",
                  isActive ? "bg-primary-foreground" : "bg-muted-foreground/50"
                )}
              />
              {level.label}
            </button>
          )
        })}
      </div>
      {activeLevel?.description ? (
        <p
          data-slot="autonomy-dial-description"
          className="px-1 text-sm text-muted-foreground"
        >
          {activeLevel.description}
        </p>
      ) : null}
    </div>
  )
}

export { AutonomyDial, type AutonomyLevel }
