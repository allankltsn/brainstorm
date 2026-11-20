import * as React from "react"
import { cn } from "@/lib/utils"

function ThinkingState({
  label = "Pensando…",
  children,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  label?: React.ReactNode
}) {
  return (
    <div
      data-slot="thinking-state"
      role="status"
      aria-live="polite"
      className={cn("flex flex-col gap-1.5", className)}
      {...props}
    >
      <div className="flex items-center gap-2">
        <span
          data-slot="thinking-state-dots"
          aria-hidden="true"
          className="inline-flex items-center gap-1"
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="size-1.5 rounded-full bg-muted-foreground animate-bounce motion-reduce:animate-none"
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
        </span>
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      {children ? (
        <div
          data-slot="thinking-state-preview"
          className="text-sm text-muted-foreground"
        >
          {children}
        </div>
      ) : null}
    </div>
  )
}

export { ThinkingState }
