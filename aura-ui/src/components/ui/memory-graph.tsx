"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

type MemoryKind = "fact" | "entity" | "preference" | "event"

type MemoryNode = {
  id: string
  label: string
  kind?: MemoryKind
  x?: number
  y?: number
}

type MemoryEdge = {
  from: string
  to: string
  label?: string
}

const NODE_W = 144
const NODE_H = 44
const COL_STEP = 200
const ROW_STEP = 72
const PAD = 16

const kindTone: Record<MemoryKind, string> = {
  fact: "border-primary/30 bg-primary/10 text-foreground",
  entity: "border-border bg-muted text-foreground",
  preference: "border-success/30 bg-success/10 text-foreground",
  event: "border-destructive/30 bg-destructive/10 text-foreground",
}

const kindDot: Record<MemoryKind, string> = {
  fact: "bg-primary",
  entity: "bg-muted-foreground/60",
  preference: "bg-success",
  event: "bg-destructive",
}

function layout(nodes: MemoryNode[], edges: MemoryEdge[]) {
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
  const queue = nodes
    .filter((n) => (incoming.get(n.id) ?? 0) === 0)
    .map((n) => n.id)
  // Fallback: if every node has an incoming edge (a cycle), seed from the first.
  if (queue.length === 0 && nodes.length) queue.push(nodes[0].id)
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
    let x = n.x
    let y = n.y
    if (x == null) {
      const c = depth.get(n.id) ?? 0
      const row = rowCursor.get(c) ?? 0
      rowCursor.set(c, row + 1)
      x = PAD + c * COL_STEP
      if (y == null) y = PAD + row * ROW_STEP
    }
    if (y == null) y = PAD
    return {
      ...n,
      kind: n.kind ?? "entity",
      x,
      y,
      order: i,
    }
  })
}

function MemoryGraph({
  nodes,
  edges,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  nodes: MemoryNode[]
  edges: MemoryEdge[]
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
      data-slot="memory-graph"
      className={cn(
        "relative w-full overflow-auto rounded-xl bg-card p-1",
        className
      )}
      {...props}
    >
      <div className="relative" style={{ width, height }}>
        <svg width={width} height={height} className="absolute inset-0" aria-hidden>
          {edges.map((e, i) => {
            const a = byId.get(e.from)
            const b = byId.get(e.to)
            if (!a || !b) return null
            const x1 = a.x + NODE_W / 2
            const y1 = a.y + NODE_H / 2
            const x2 = b.x + NODE_W / 2
            const y2 = b.y + NODE_H / 2
            const mx = (x1 + x2) / 2
            const my = (y1 + y2) / 2
            return (
              <g key={`${e.from}-${e.to}-${i}`}>
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  className="stroke-border"
                  strokeWidth={1.5}
                />
                {e.label ? (
                  <text
                    x={mx}
                    y={my}
                    dy="-0.2em"
                    textAnchor="middle"
                    className="fill-muted-foreground text-[10px]"
                  >
                    {e.label}
                  </text>
                ) : null}
              </g>
            )
          })}
        </svg>
        {placed.map((n) => (
          <div
            key={n.id}
            data-slot="memory-graph-node"
            data-kind={n.kind}
            className={cn(
              "absolute flex flex-col justify-center gap-1 rounded-lg border px-2.5 py-1 shadow-sm",
              kindTone[n.kind]
            )}
            style={{ left: n.x, top: n.y, width: NODE_W, minHeight: NODE_H }}
          >
            <div className="flex items-center gap-2">
              <span
                aria-hidden
                className={cn("size-2 shrink-0 rounded-full", kindDot[n.kind])}
              />
              <span className="truncate text-xs font-medium text-foreground">
                {n.label}
              </span>
            </div>
            <Badge variant="outline" className="h-4 self-start px-1.5 text-[10px]">
              {n.kind}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  )
}

export { MemoryGraph }
export type { MemoryNode, MemoryEdge, MemoryKind }
