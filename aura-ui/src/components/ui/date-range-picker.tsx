"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { type DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

function DateRangePicker({
  value,
  defaultValue,
  onValueChange,
  placeholder = "Selecione o período",
  className,
  disabled,
}: {
  value?: DateRange
  defaultValue?: DateRange
  onValueChange?: (range: DateRange | undefined) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}) {
  const [open, setOpen] = React.useState(false)
  const [internalRange, setInternalRange] = React.useState<
    DateRange | undefined
  >(defaultValue)

  const isControlled = value !== undefined
  const range = isControlled ? value : internalRange

  const handleSelect = (next: DateRange | undefined) => {
    if (!isControlled) {
      setInternalRange(next)
    }
    onValueChange?.(next)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          data-slot="date-range-picker"
          className={cn(
            "justify-start text-left font-normal",
            !range?.from && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon />
          {range?.from ? (
            range.to ? (
              <>
                {format(range.from, "dd/MM/yyyy")} –{" "}
                {format(range.to, "dd/MM/yyyy")}
              </>
            ) : (
              format(range.from, "dd/MM/yyyy")
            )
          ) : (
            placeholder
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          numberOfMonths={2}
          selected={range}
          onSelect={handleSelect}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  )
}

export { DateRangePicker }
