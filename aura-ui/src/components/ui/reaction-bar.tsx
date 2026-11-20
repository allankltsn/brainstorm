"use client"

import * as React from "react"
import { PlusIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export type Reaction = {
  /** The emoji character shown on the pill */
  emoji: string
  /** How many people reacted with this emoji */
  count: number
  /** Whether the current user has reacted – highlights the pill */
  reacted?: boolean
}

export type ReactionBarProps = React.ComponentProps<"div"> & {
  /** Reactions to show, in order. Counts are controlled by props. */
  reactions: Reaction[]
  /** Called with the emoji of the pill (or add button) that was pressed */
  onReact?: (emoji: string) => void
  /** Show a trailing "+" button that calls onReact("") */
  showAdd?: boolean
  /** Accessible name of the add button */
  addLabel?: string
}

const fmt = (n: number) =>
  Number.isFinite(n) ? Math.max(0, Math.floor(n)).toLocaleString("en-US") : "0"

/** A horizontal row of emoji reaction pills with counts. */
export function ReactionBar({
  reactions,
  onReact,
  showAdd = false,
  addLabel = "Adicionar reação",
  className,
  ...props
}: ReactionBarProps) {
  const list = Array.isArray(reactions) ? reactions : []

  return (
    <div
      data-slot="reaction-bar"
      role="group"
      className={cn("flex flex-wrap items-center gap-1", className)}
      {...props}
    >
      {list.map(({ emoji, count, reacted }, i) => (
        <button
          key={`${emoji}-${i}`}
          type="button"
          data-slot="reaction"
          data-reacted={reacted ? "" : undefined}
          aria-pressed={Boolean(reacted)}
          aria-label={`${emoji} ${fmt(count)}`}
          title={emoji}
          onClick={() => onReact?.(emoji)}
          className={cn(
            "inline-flex h-7 shrink-0 items-center gap-1 rounded-full border px-2 text-xs font-medium whitespace-nowrap transition-colors outline-none select-none",
            "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
            reacted
              ? "border-primary bg-primary/10 text-primary"
              : "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <span aria-hidden className="text-sm leading-none">
            {emoji}
          </span>
          <span className="tabular-nums">{fmt(count)}</span>
        </button>
      ))}

      {showAdd && (
        <button
          type="button"
          data-slot="reaction-add"
          aria-label={addLabel}
          title={addLabel}
          onClick={() => onReact?.("")}
          className={cn(
            "inline-flex size-7 shrink-0 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors outline-none select-none",
            "hover:bg-muted hover:text-foreground",
            "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
            "[&_svg]:pointer-events-none [&_svg]:size-3.5 [&_svg]:shrink-0"
          )}
        >
          <PlusIcon />
        </button>
      )}
    </div>
  )
}
