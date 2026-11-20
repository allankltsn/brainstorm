"use client"

import * as React from "react"
import { BrainIcon, Trash2Icon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export type Memory = {
  id: string
  title: string
  type?: "user" | "project" | "feedback" | "reference"
  detail?: string
  at?: string
}

export type MemoryPanelProps = React.ComponentProps<"div"> & {
  memories: Memory[]
  onForget?: (id: string) => void
  title?: string
}

const typeLabels: Record<NonNullable<Memory["type"]>, string> = {
  user: "Usuário",
  project: "Projeto",
  feedback: "Feedback",
  reference: "Referência",
}

const typeVariants: Record<
  NonNullable<Memory["type"]>,
  React.ComponentProps<typeof Badge>["variant"]
> = {
  user: "default",
  project: "secondary",
  feedback: "outline",
  reference: "outline",
}

const count = new Intl.NumberFormat("en")

function MemoryPanel({
  memories,
  onForget,
  title = "Memória",
  className,
  ...props
}: MemoryPanelProps) {
  return (
    <div
      data-slot="memory-panel"
      className={cn(
        "flex w-full max-w-[560px] flex-col gap-3 rounded-xl bg-card p-1.5 ring-1 ring-foreground/10",
        className
      )}
      {...props}
    >
      <header className="flex items-center gap-2 px-3 pt-2 pb-0.5">
        <BrainIcon className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
        <h3 dir="auto" className="min-w-0 flex-1 font-heading text-base leading-snug font-medium break-words">
          {title}
        </h3>
        <span className="flex-none text-sm tabular-nums text-muted-foreground">
          {count.format(memories.length)}
        </span>
      </header>

      <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
        {memories.map((memory) => {
          const type = memory.type
          return (
            <li
              key={memory.id}
              data-slot="memory-panel-item"
              className="flex items-start gap-3 rounded-lg border border-border p-3"
            >
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <div className="flex flex-wrap items-center gap-2">
                  {type && (
                    <Badge variant={typeVariants[type]}>{typeLabels[type]}</Badge>
                  )}
                  <span dir="auto" className="min-w-0 text-sm font-medium break-words">
                    {memory.title}
                  </span>
                </div>
                {memory.detail && (
                  <p dir="auto" className="m-0 text-[0.8rem] leading-relaxed break-words text-muted-foreground">
                    {memory.detail}
                  </p>
                )}
                {memory.at && (
                  <span className="text-xs text-muted-foreground">{memory.at}</span>
                )}
              </div>
              {onForget && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  data-slot="memory-panel-forget"
                  aria-label={`Esquecer ${memory.title}`}
                  onClick={() => onForget(memory.id)}
                >
                  <Trash2Icon aria-hidden="true" />
                </Button>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export { MemoryPanel }
