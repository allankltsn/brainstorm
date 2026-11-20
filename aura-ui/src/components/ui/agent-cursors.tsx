"use client"

import * as React from "react"
import { MousePointer2Icon } from "lucide-react"
import { cn } from "@/lib/utils"

type AgentCursor = {
  id: string
  name: string
  /** Horizontal position as a percentage (0-100) of the container width. */
  x: number
  /** Vertical position as a percentage (0-100) of the container height. */
  y: number
  /** Optional accent color used for the cursor icon and name label. */
  color?: string
}

function AgentCursors({
  cursors,
  className,
  ...props
}: React.ComponentProps<"div"> & { cursors: AgentCursor[] }) {
  return (
    <div
      data-slot="agent-cursors"
      className={cn(
        "relative min-h-48 w-full overflow-hidden rounded-xl border border-border bg-muted/20",
        className
      )}
      {...props}
    >
      {cursors.map((cursor) => {
        const hasColor = cursor.color != null && cursor.color !== ""
        return (
          <div
            key={cursor.id}
            data-slot="agent-cursor"
            className="pointer-events-none absolute flex items-start gap-1"
            style={{
              left: `${cursor.x}%`,
              top: `${cursor.y}%`,
            }}
          >
            <MousePointer2Icon
              className="size-4 shrink-0 drop-shadow-sm"
              style={hasColor ? { color: cursor.color } : undefined}
            />
            <span
              data-slot="agent-cursor-label"
              className={cn(
                "max-w-32 translate-y-1 truncate rounded-full px-2 py-0.5 text-xs leading-4 font-medium shadow-sm",
                !hasColor && "bg-primary text-primary-foreground"
              )}
              style={
                hasColor
                  ? { backgroundColor: cursor.color, color: "white" }
                  : undefined
              }
            >
              {cursor.name}
            </span>
          </div>
        )
      })}
    </div>
  )
}

export { AgentCursors }
export type { AgentCursor }
