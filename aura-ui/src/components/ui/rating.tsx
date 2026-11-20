import * as React from "react"
import { StarIcon } from "lucide-react"
import { cn } from "@/lib/utils"

const sizes = {
  sm: "size-4",
  md: "size-5",
  lg: "size-6",
} as const

function Rating({
  value,
  defaultValue = 0,
  onValueChange,
  max = 5,
  readOnly = false,
  size = "md",
  className,
  ...props
}: Omit<React.ComponentProps<"div">, "onChange"> & {
  value?: number
  defaultValue?: number
  onValueChange?: (value: number) => void
  max?: number
  readOnly?: boolean
  size?: "sm" | "md" | "lg"
}) {
  const [internalValue, setInternalValue] = React.useState(defaultValue)
  const [hoverValue, setHoverValue] = React.useState<number | null>(null)

  const currentValue = value ?? internalValue
  const displayValue = hoverValue ?? currentValue

  function select(next: number) {
    if (readOnly) return
    if (value === undefined) setInternalValue(next)
    onValueChange?.(next)
  }

  return (
    <div
      data-slot="rating"
      role="radiogroup"
      aria-readonly={readOnly || undefined}
      className={cn(
        "inline-flex items-center gap-0.5",
        readOnly && "pointer-events-none",
        className
      )}
      {...props}
    >
      {Array.from({ length: max }, (_, index) => {
        const starValue = index + 1
        const filled = starValue <= displayValue
        return (
          <button
            key={starValue}
            type="button"
            role="radio"
            aria-checked={starValue === currentValue}
            aria-label={`${starValue} ${starValue === 1 ? "estrela" : "estrelas"}`}
            disabled={readOnly}
            tabIndex={readOnly ? -1 : 0}
            onClick={() => select(starValue)}
            onMouseEnter={() => !readOnly && setHoverValue(starValue)}
            onMouseLeave={() => !readOnly && setHoverValue(null)}
            className={cn(
              "inline-flex items-center justify-center rounded-sm outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-default",
              !readOnly && "cursor-pointer"
            )}
          >
            <StarIcon
              className={cn(
                sizes[size],
                filled
                  ? "fill-primary text-primary"
                  : "fill-transparent text-muted-foreground"
              )}
            />
          </button>
        )
      })}
    </div>
  )
}

export { Rating }
