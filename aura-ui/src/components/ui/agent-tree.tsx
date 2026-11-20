"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

type AgentStatus = "idle" | "running" | "done" | "error"

type AgentNode = {
  id: string
  name: string
  role?: string
  status?: AgentStatus
  children?: AgentNode[]
}

const statusDotClass: Record<AgentStatus, string> = {
  idle: "bg-muted-foreground/40",
  running: "bg-primary animate-pulse",
  done: "bg-primary",
  error: "bg-destructive",
}

function StatusDot({ status }: { status: AgentStatus }) {
  return (
    <span
      data-slot="agent-tree-dot"
      data-status={status}
      aria-hidden
      className={cn(
        "size-2 shrink-0 rounded-full",
        statusDotClass[status]
      )}
    />
  )
}

function AgentTreeItem({ node, depth }: { node: AgentNode; depth: number }) {
  const isBranch = Array.isArray(node.children) && node.children.length > 0
  const status = node.status ?? "idle"

  return (
    <li role="none">
      <div
        role="treeitem"
        data-slot="agent-tree-item"
        data-status={status}
        style={{ paddingInlineStart: `${depth * 1 + 0.5}rem` }}
        className="flex h-8 items-center gap-2 rounded-md pr-2 text-sm text-foreground [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
      >
        {isBranch ? (
          <ChevronDownIcon className="text-muted-foreground" />
        ) : (
          <span className="size-4 shrink-0" aria-hidden />
        )}
        <StatusDot status={status} />
        <span className="truncate font-medium">{node.name}</span>
        {node.role != null && (
          <Badge variant="secondary" className="ml-1">
            {node.role}
          </Badge>
        )}
      </div>
      {isBranch ? (
        <ul role="group" className="relative flex flex-col">
          <span
            aria-hidden
            style={{ insetInlineStart: `${depth * 1 + 1}rem` }}
            className="absolute inset-y-0 w-px bg-border"
          />
          {node.children!.map((child) => (
            <AgentTreeItem key={child.id} node={child} depth={depth + 1} />
          ))}
        </ul>
      ) : null}
    </li>
  )
}

function AgentTree({
  root,
  className,
  ...props
}: React.ComponentProps<"div"> & { root: AgentNode }) {
  return (
    <div
      data-slot="agent-tree"
      className={cn("text-foreground", className)}
      {...props}
    >
      <ul role="tree" className="flex flex-col">
        <AgentTreeItem node={root} depth={0} />
      </ul>
    </div>
  )
}

export { AgentTree }
export type { AgentNode }
