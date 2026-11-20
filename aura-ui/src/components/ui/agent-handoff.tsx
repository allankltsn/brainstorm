"use client"

import * as React from "react"
import { ArrowRightIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

type Handoff = {
  id: string
  from: string
  to: string
  task?: string
  at?: string
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "?"
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function HandoffAgent({ name }: { name: string }) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <Avatar size="sm">
        <AvatarFallback>{getInitials(name)}</AvatarFallback>
      </Avatar>
      <span className="truncate text-sm font-medium text-foreground">
        {name}
      </span>
    </div>
  )
}

function AgentHandoff({
  handoffs,
  className,
  ...props
}: React.ComponentProps<"div"> & { handoffs: Handoff[] }) {
  return (
    <div
      data-slot="agent-handoff"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    >
      {handoffs.map((handoff) => (
        <div
          key={handoff.id}
          data-slot="agent-handoff-item"
          className="flex flex-col gap-1.5 rounded-lg border border-border bg-card p-3"
        >
          <div className="flex items-center gap-3">
            <HandoffAgent name={handoff.from} />
            <ArrowRightIcon
              aria-hidden
              className="size-4 shrink-0 text-muted-foreground"
            />
            <HandoffAgent name={handoff.to} />
            {handoff.at != null && (
              <span className="ml-auto shrink-0 text-xs text-muted-foreground">
                {handoff.at}
              </span>
            )}
          </div>
          {handoff.task != null && (
            <p className="text-sm text-muted-foreground">{handoff.task}</p>
          )}
        </div>
      ))}
    </div>
  )
}

export { AgentHandoff }
export type { Handoff }
