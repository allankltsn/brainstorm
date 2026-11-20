"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

function pad(value: number) {
  return value.toString().padStart(2, "0")
}

function parseTime(value: string | undefined) {
  const [hour = "09", minute = "00"] = (value ?? "").split(":")
  return { hour, minute }
}

function TimePicker({
  value: valueProp,
  defaultValue = "09:00",
  onValueChange,
  minuteStep = 5,
  disabled,
  className,
  ...props
}: Omit<React.ComponentProps<"div">, "onChange" | "defaultValue"> & {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  minuteStep?: number
  disabled?: boolean
}) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue)
  const isControlled = valueProp !== undefined
  const value = isControlled ? valueProp : uncontrolledValue

  const setValue = React.useCallback(
    (next: string) => {
      if (!isControlled) {
        setUncontrolledValue(next)
      }
      onValueChange?.(next)
    },
    [isControlled, onValueChange]
  )

  const { hour, minute } = parseTime(value)

  const hours = React.useMemo(
    () => Array.from({ length: 24 }, (_, i) => pad(i)),
    []
  )
  const minutes = React.useMemo(
    () =>
      Array.from(
        { length: Math.ceil(60 / minuteStep) },
        (_, i) => pad(i * minuteStep)
      ),
    [minuteStep]
  )

  return (
    <div
      data-slot="time-picker"
      className={cn("inline-flex items-center gap-1.5", className)}
      {...props}
    >
      <Select
        value={hour}
        disabled={disabled}
        onValueChange={(next) => setValue(`${next}:${minute}`)}
      >
        <SelectTrigger aria-label="Horas">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {hours.map((h) => (
            <SelectItem key={h} value={h}>
              {h}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <span aria-hidden className="text-sm text-muted-foreground">
        :
      </span>
      <Select
        value={minute}
        disabled={disabled}
        onValueChange={(next) => setValue(`${hour}:${next}`)}
      >
        <SelectTrigger aria-label="Minutos">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {minutes.map((m) => (
            <SelectItem key={m} value={m}>
              {m}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export { TimePicker }
