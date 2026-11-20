"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

export type InlineDiffLine = {
  type: "add" | "del" | "context"
  text: string
  oldNo?: number
  newNo?: number
}

const MARKER = {
  add: "+",
  del: "-",
  context: " ",
} as const

const ROW_CLASS = {
  add: "bg-success/10 text-foreground",
  del: "bg-destructive/10 text-foreground",
  context: "text-foreground",
} as const

const MARKER_CLASS = {
  add: "text-success",
  del: "text-destructive",
  context: "text-muted-foreground",
} as const

/* Diff unificado: linhas adicionadas, removidas e de contexto, com numeração. */
function InlineDiff({
  lines,
  filename,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  lines: InlineDiffLine[]
  filename?: string
}) {
  const added = lines.filter((l) => l.type === "add").length
  const removed = lines.filter((l) => l.type === "del").length

  return (
    <div
      data-slot="inline-diff"
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-card",
        className
      )}
      {...props}
    >
      {(filename || added > 0 || removed > 0) && (
        <div className="flex items-center justify-between gap-2 border-b border-border bg-muted/50 px-3 py-1.5 text-xs text-muted-foreground">
          <span className="truncate font-mono">{filename}</span>
          <span className="flex shrink-0 items-center gap-1.5">
            <Badge variant="outline" className="text-success">
              +{added}
            </Badge>
            <Badge variant="outline" className="text-destructive">
              -{removed}
            </Badge>
          </span>
        </div>
      )}
      <pre className="overflow-x-auto font-mono text-sm leading-relaxed">
        <code className="block">
          {lines.map((line, i) => (
            <span
              key={i}
              data-slot="inline-diff-line"
              data-type={line.type}
              className={cn(
                "grid grid-cols-[auto_auto_1fr] items-start",
                ROW_CLASS[line.type]
              )}
            >
              <span className="select-none px-2 text-right text-muted-foreground tabular-nums">
                {line.oldNo ?? ""}
              </span>
              <span className="select-none border-r border-border px-2 text-right text-muted-foreground tabular-nums">
                {line.newNo ?? ""}
              </span>
              <span className="flex min-w-0 gap-2 pr-3 pl-2">
                <span
                  aria-hidden="true"
                  className={cn(
                    "select-none",
                    MARKER_CLASS[line.type]
                  )}
                >
                  {MARKER[line.type]}
                </span>
                <span className="whitespace-pre-wrap [overflow-wrap:anywhere]">
                  {line.text}
                </span>
              </span>
            </span>
          ))}
        </code>
      </pre>
    </div>
  )
}

export { InlineDiff }
