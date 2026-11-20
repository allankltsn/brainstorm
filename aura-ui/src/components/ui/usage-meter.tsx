import * as React from "react"
import { cn } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"

function UsageMeter({
  value,
  max,
  label,
  unit,
  format = (n: number) => n.toLocaleString("pt-BR"),
  className,
  ...props
}: React.ComponentProps<"div"> & {
  value: number
  max: number
  label?: string
  unit?: string
  format?: (n: number) => string
}) {
  const pct = Math.min(100, Math.round((value / max) * 100))
  const state = pct >= 100 ? "full" : pct >= 90 ? "near" : "ok"

  return (
    <div
      data-slot="usage-meter"
      data-state={state}
      className={cn("flex w-full flex-col gap-1.5", className)}
      {...props}
    >
      <div className="flex items-baseline justify-between gap-2">
        {label && <span className="text-sm font-medium">{label}</span>}
        <span
          className={cn(
            "ml-auto text-xs text-muted-foreground tabular-nums",
            state === "near" && "text-warning",
            state === "full" && "text-destructive"
          )}
        >
          {format(value)} / {format(max)}
          {unit ? ` ${unit}` : null}
        </span>
      </div>
      <Progress value={pct} />
    </div>
  )
}

export { UsageMeter }
