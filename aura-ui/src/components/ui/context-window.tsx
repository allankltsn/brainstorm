import * as React from "react"
import { cn } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"

function ContextWindow({
  used,
  total,
  label = "Contexto",
  className,
  ...props
}: React.ComponentProps<"div"> & {
  used: number
  total: number
  label?: string
}) {
  const pct = Math.min(100, Math.round((used / total) * 100))
  const state = pct >= 100 ? "full" : pct >= 90 ? "near" : "ok"

  return (
    <div
      data-slot="context-window"
      data-state={state}
      className={cn("flex w-full flex-col gap-1.5", className)}
      {...props}
    >
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-sm font-medium">{label}</span>
        <span
          className={cn(
            "text-xs text-muted-foreground tabular-nums",
            state === "near" && "text-warning",
            state === "full" && "text-destructive"
          )}
        >
          {used.toLocaleString("pt-BR")} / {total.toLocaleString("pt-BR")} tokens
        </span>
      </div>
      <Progress value={pct} />
      {state === "near" && (
        <span className="text-xs text-warning">quase cheio</span>
      )}
      {state === "full" && (
        <span className="text-xs text-destructive">cheio</span>
      )}
    </div>
  )
}

export { ContextWindow }
