import * as React from "react"
import { cn } from "@/lib/utils"

type SegmentedControlContextValue = {
  value: string | undefined
  setValue: (value: string) => void
}

const SegmentedControlContext =
  React.createContext<SegmentedControlContextValue | null>(null)

function useSegmentedControl() {
  const context = React.useContext(SegmentedControlContext)
  if (!context) {
    throw new Error(
      "SegmentedControlItem must be used within a SegmentedControl"
    )
  }
  return context
}

function SegmentedControl({
  value: valueProp,
  defaultValue,
  onValueChange,
  className,
  children,
  ...props
}: Omit<React.ComponentProps<"div">, "onChange"> & {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
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

  return (
    <SegmentedControlContext.Provider value={{ value, setValue }}>
      <div
        data-slot="segmented-control"
        role="group"
        className={cn(
          "inline-flex items-center gap-0.5 rounded-full bg-muted p-0.5",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </SegmentedControlContext.Provider>
  )
}

function SegmentedControlItem({
  value,
  className,
  children,
  disabled,
  ...props
}: Omit<React.ComponentProps<"button">, "value"> & {
  value: string
}) {
  const { value: selectedValue, setValue } = useSegmentedControl()
  const isActive = selectedValue === value

  return (
    <button
      type="button"
      data-slot="segmented-control-item"
      data-state={isActive ? "active" : "inactive"}
      role="button"
      aria-pressed={isActive}
      disabled={disabled}
      onClick={() => setValue(value)}
      className={cn(
        "rounded-full px-3 py-1 text-sm font-medium whitespace-nowrap transition outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50",
        isActive
          ? "bg-background text-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export { SegmentedControl, SegmentedControlItem }
