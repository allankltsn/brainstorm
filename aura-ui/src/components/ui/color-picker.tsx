"use client"

import * as React from "react"
import { CheckIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const DEFAULT_PRESETS = [
  "#000000",
  "#64748b",
  "#ef4444",
  "#f97316",
  "#f59e0b",
  "#eab308",
  "#22c55e",
  "#10b981",
  "#06b6d4",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
]

function ColorPicker({
  value,
  defaultValue = "#000000",
  onValueChange,
  presets = DEFAULT_PRESETS,
  className,
  ...props
}: React.ComponentProps<"button"> & {
  value?: string
  defaultValue?: string
  onValueChange?: (hex: string) => void
  presets?: string[]
}) {
  const [internalValue, setInternalValue] = React.useState(defaultValue)

  const isControlled = value !== undefined
  const selectedValue = isControlled ? value : internalValue

  function handleChange(next: string) {
    if (!isControlled) {
      setInternalValue(next)
    }
    onValueChange?.(next)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          data-slot="color-picker"
          className={cn("justify-start gap-2 font-normal", className)}
          {...props}
        >
          <span
            data-slot="color-picker-swatch"
            className="size-4 rounded-md border border-border"
            style={{ background: selectedValue }}
          />
          <span className="font-mono text-sm">{selectedValue}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56" align="start">
        <div className="grid grid-cols-6 gap-2">
          {presets.map((preset) => {
            const isSelected =
              preset.toLowerCase() === (selectedValue ?? "").toLowerCase()
            return (
              <button
                key={preset}
                type="button"
                aria-label={preset}
                aria-pressed={isSelected}
                onClick={() => handleChange(preset)}
                className={cn(
                  "flex size-7 items-center justify-center rounded-md border border-border outline-none transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-ring",
                  isSelected && "ring-2 ring-ring"
                )}
                style={{ background: preset }}
              >
                {isSelected && (
                  <CheckIcon className="size-3.5 text-background mix-blend-difference" />
                )}
              </button>
            )
          })}
        </div>
        <Input
          aria-label="Valor hexadecimal"
          value={selectedValue}
          onChange={(event) => handleChange(event.target.value)}
          placeholder="#1e90ff"
          className="mt-3 font-mono"
        />
      </PopoverContent>
    </Popover>
  )
}

export { ColorPicker }
