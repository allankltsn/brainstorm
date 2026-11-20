"use client"

import * as React from "react"
import { BookmarkIcon, GitCommitIcon, RotateCcwIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type AgentCheckpoint = {
  id: string
  label: string
  at?: string
  current?: boolean
}

function CheckpointNode({ current }: { current?: boolean }) {
  if (current) {
    return (
      <span className="flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
        <BookmarkIcon className="size-3.5 fill-current" />
      </span>
    )
  }
  return (
    <span className="flex size-6 items-center justify-center rounded-full border border-border bg-background text-muted-foreground">
      <GitCommitIcon className="size-3.5" />
    </span>
  )
}

function AgentCheckpoints({
  checkpoints,
  onRestore,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  checkpoints: AgentCheckpoint[]
  onRestore?: (id: string) => void
}) {
  return (
    <div
      data-slot="agent-checkpoints"
      className={cn("flex flex-col", className)}
      {...props}
    >
      {checkpoints.map((checkpoint, index) => {
        const isLast = index === checkpoints.length - 1
        return (
          <div
            key={checkpoint.id}
            data-slot="agent-checkpoints-item"
            data-current={checkpoint.current || undefined}
            className="flex gap-3"
          >
            <div className="flex flex-col items-center">
              <CheckpointNode current={checkpoint.current} />
              {!isLast && (
                <span
                  aria-hidden
                  className="w-px flex-1 border-l border-border"
                />
              )}
            </div>
            <div
              className={cn(
                "flex flex-1 items-start justify-between gap-3 pb-6",
                isLast && "pb-0"
              )}
            >
              <div className="min-w-0">
                <p
                  className={cn(
                    "text-sm leading-6 font-medium",
                    checkpoint.current && "text-primary"
                  )}
                >
                  {checkpoint.label}
                </p>
                {checkpoint.at != null && (
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {checkpoint.at}
                  </p>
                )}
              </div>
              {!checkpoint.current && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRestore?.(checkpoint.id)}
                >
                  <RotateCcwIcon />
                  Restaurar
                </Button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export { AgentCheckpoints }
export type { AgentCheckpoint }
