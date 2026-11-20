"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

type AgentNodeStatus = "idle" | "running" | "done" | "error"

type AgentNode = {
  id: string
  label: string
  status?: AgentNodeStatus
  col?: number
  row?: number
}

type AgentEdge = {
  from: string
  to: string
}

const NODE_W = 128
const NODE_H = 40
const COL_STEP = 184
const ROW_STEP = 64
const PAD = 16

const dotTone: Record<AgentNodeStatus, string> = {
  idle: "bg-muted-foreground/40",
  running: "bg-primary animate-pulse",
  done: "bg-success",
  error: "bg-destructive",
}

function layout(nodes: AgentNode[], edges: AgentEdge[]) {
  const incoming = new Map<string, number>()
  const adj = new Map<string, string[]>()
  for (const n of nodes) {
    incoming.set(n.id, 0)
    adj.set(n.id, [])
  }
  for (const e of edges) {
    if (!incoming.has(e.to) || !adj.has(e.from)) continue
    incoming.set(e.to, (incoming.get(e.to) ?? 0) + 1)
    adj.get(e.from)!.push(e.to)
  }

  // Auto columns via BFS depth from roots (nodes with no incoming edges).
  const depth = new Map<string, number>()
  const queue = nodes.filter((n) => (incoming.get(n.id) ?? 0) === 0).map((n) => n.id)
  for (const id of queue) depth.set(id, 0)
  while (queue.length) {
    const id = queue.shift()!
    const d = depth.get(id) ?? 0
    for (const next of adj.get(id) ?? []) {
      if ((depth.get(next) ?? -1) < d + 1) {
        depth.set(next, d + 1)
        queue.push(next)
      }
    }
  }

  const rowCursor = new Map<number, number>()
  return nodes.map((n, i) => {
    const col = n.col ?? depth.get(n.id) ?? 0
    let row = n.row
    if (row == null) {
      row = rowCursor.get(col) ?? 0
      rowCursor.set(col, row + 1)
    }
    return {
      ...n,
      status: n.status ?? "idle",
      x: PAD + col * COL_STEP,
      y: PAD + row * ROW_STEP,
      order: i,
    }
  })
}

function AgentGraph({
  nodes,
  edges,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  nodes: AgentNode[]
  edges: AgentEdge[]
}) {
  const placed = React.useMemo(() => layout(nodes, edges), [nodes, edges])
  const byId = React.useMemo(
    () => new Map(placed.map((n) => [n.id, n])),
    [placed]
  )
  const width = Math.max(...placed.map((n) => n.x + NODE_W), NODE_W) + PAD
  const height = Math.max(...placed.map((n) => n.y + NODE_H), NODE_H) + PAD

  return (
    <div
      data-slot="agent-graph"
      className={cn("relative w-full overflow-auto rounded-xl bg-card p-1", className)}
      {...props}
    >
      <div className="relative" style={{ width, height }}>
        <svg
          width={width}
          height={height}
          className="absolute inset-0"
          aria-hidden
        >
          {edges.map((e, i) => {
            const a = byId.get(e.from)
            const b = byId.get(e.to)
            if (!a || !b) return null
            return (
              <line
                key={`${e.from}-${e.to}-${i}`}
                x1={a.x + NODE_W}
                y1={a.y + NODE_H / 2}
                x2={b.x}
                y2={b.y + NODE_H / 2}
                className="stroke-border"
                strokeWidth={1.5}
              />
            )
          })}
        </svg>
        {placed.map((n) => (
          <div
            key={n.id}
            data-slot="agent-graph-node"
            data-status={n.status}
            className="absolute flex items-center gap-2 rounded-lg border border-border bg-muted px-2.5 text-xs font-medium text-foreground shadow-sm"
            style={{ left: n.x, top: n.y, width: NODE_W, height: NODE_H }}
          >
            <span
              aria-hidden
              className={cn("size-2 shrink-0 rounded-full", dotTone[n.status])}
            />
            <span className="truncate">{n.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export { AgentGraph }
export type { AgentNode, AgentEdge, AgentNodeStatus }
