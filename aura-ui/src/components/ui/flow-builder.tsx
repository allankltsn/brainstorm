"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

type FlowNodeType = "trigger" | "action" | "condition" | "output"

type FlowNode = {
  id: string
  label: string
  type?: FlowNodeType
  x: number
  y: number
}

type FlowEdge = {
  from: string
  to: string
}

type FlowPaletteItem = {
  type: string
  label: string
}

const NODE_W = 144
const NODE_H = 52

const typeTone: Record<FlowNodeType, string> = {
  trigger: "border-l-primary",
  action: "border-l-success",
  condition: "border-l-warning",
  output: "border-l-destructive",
}

const typeBadge: Record<
  FlowNodeType,
  React.ComponentProps<typeof Badge>["variant"]
> = {
  trigger: "default",
  action: "secondary",
  condition: "outline",
  output: "destructive",
}

function FlowBuilder({
  nodes,
  edges,
  palette,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  nodes: FlowNode[]
  edges: FlowEdge[]
  palette?: FlowPaletteItem[]
}) {
  const byId = React.useMemo(
    () => new Map(nodes.map((n) => [n.id, n])),
    [nodes]
  )
  const width =
    Math.max(...nodes.map((n) => n.x + NODE_W), NODE_W) + 24
  const height =
    Math.max(...nodes.map((n) => n.y + NODE_H), NODE_H) + 24

  return (
    <div
      data-slot="flow-builder"
      className={cn("flex w-full gap-3", className)}
      {...props}
    >
      {palette && palette.length > 0 ? (
        <div
          data-slot="flow-builder-palette"
          className="flex w-36 shrink-0 flex-col gap-1.5"
        >
          <span className="px-1 text-xs font-medium text-muted-foreground">
            Nós
          </span>
          {palette.map((item) => (
            <div
              key={item.type}
              data-slot="flow-builder-palette-item"
              className="flex items-center gap-2 rounded-lg border border-border bg-card px-2.5 py-2 text-xs font-medium text-foreground"
            >
              <span
                aria-hidden
                className={cn(
                  "size-2 shrink-0 rounded-full border-l-2 bg-muted",
                  typeTone[item.type as FlowNodeType] ?? "border-l-border"
                )}
              />
              <span className="truncate">{item.label}</span>
            </div>
          ))}
        </div>
      ) : null}

      <div
        data-slot="flow-builder-canvas"
        className="relative min-h-64 flex-1 overflow-auto rounded-xl border border-border bg-muted/20"
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
          {nodes.map((n) => {
            const type = n.type ?? "action"
            return (
              <div
                key={n.id}
                data-slot="flow-builder-node"
                data-type={type}
                className={cn(
                  "absolute flex flex-col justify-center gap-1 rounded-lg border border-l-4 border-border bg-card px-3 py-2 shadow-sm",
                  typeTone[type]
                )}
                style={{ left: n.x, top: n.y, width: NODE_W, height: NODE_H }}
              >
                <span className="truncate text-xs font-medium text-foreground">
                  {n.label}
                </span>
                <Badge variant={typeBadge[type]} className="w-fit">
                  {type}
                </Badge>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export { FlowBuilder }
export type { FlowNode, FlowEdge, FlowPaletteItem, FlowNodeType }
