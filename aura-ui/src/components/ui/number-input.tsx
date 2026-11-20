import * as React from "react"
import { MinusIcon, PlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

function clamp(value: number, min?: number, max?: number) {
  let next = value
  if (typeof min === "number") next = Math.max(next, min)
  if (typeof max === "number") next = Math.min(next, max)
  return next
}

function NumberInput({
  className,
  value,
  defaultValue,
  min,
  max,
  step = 1,
  onValueChange,
  disabled,
  id,
  name,
  placeholder,
  ...props
}: Omit<
  React.ComponentProps<"div">,
  "defaultValue" | "onChange" | "value"
> & {
  value?: number
  defaultValue?: number
  min?: number
  max?: number
  step?: number
  onValueChange?: (value: number) => void
  disabled?: boolean
  id?: string
  name?: string
  placeholder?: string
}) {
  const isControlled = value !== undefined
  const [internalValue, setInternalValue] = React.useState<number>(
    defaultValue ?? 0
  )
  const currentValue = isControlled ? (value as number) : internalValue

  const setValue = React.useCallback(
    (next: number) => {
      const clamped = clamp(next, min, max)
      if (!isControlled) setInternalValue(clamped)
      onValueChange?.(clamped)
    },
    [isControlled, min, max, onValueChange]
  )

  const decrement = () => setValue(currentValue - step)
  const increment = () => setValue(currentValue + step)

  const atMin = typeof min === "number" && currentValue <= min
  const atMax = typeof max === "number" && currentValue >= max

  return (
    <div
      data-slot="number-input"
      className={cn("flex items-center gap-1.5", className)}
      {...props}
    >
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        aria-label="Diminuir"
        disabled={disabled || atMin}
        onClick={decrement}
      >
        <MinusIcon />
      </Button>
      <Input
        type="number"
        id={id}
        name={name}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        value={Number.isNaN(currentValue) ? "" : currentValue}
        onChange={(event) => {
          const parsed = event.target.valueAsNumber
          if (Number.isNaN(parsed)) return
          setValue(parsed)
        }}
        className="text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        aria-label="Aumentar"
        disabled={disabled || atMax}
        onClick={increment}
      >
        <PlusIcon />
      </Button>
    </div>
  )
}

export { NumberInput }
