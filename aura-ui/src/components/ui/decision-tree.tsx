"use client"

import * as React from "react"
import { GitBranchIcon, CircleCheckIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

type DecisionNode = {
  id: string
  label: string
  branchLabel?: string
  outcome?: boolean
  chosen?: boolean
  children?: DecisionNode[]
}

function BranchChip({ label, chosen }: { label: string; chosen?: boolean }) {
  return (
    <Badge
      data-slot="decision-tree-branch"
      variant={chosen ? "default" : "secondary"}
      className={cn(!chosen && "text-muted-foreground")}
    >
      {label}
    </Badge>
  )
}

function DecisionTreeNode({ node, depth }: { node: DecisionNode; depth: number }) {
  const isLeaf = !Array.isArray(node.children) || node.children.length === 0
  const isOutcome = isLeaf && node.outcome === true

  return (
    <li role="none" className="flex flex-col">
      <div
        role="treeitem"
        data-slot="decision-tree-node"
        data-chosen={node.chosen ? "" : undefined}
        data-outcome={isOutcome ? "" : undefined}
        className={cn(
          "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm",
          "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
          node.chosen ? "text-primary" : "text-foreground"
        )}
      >
        {node.branchLabel != null && (
          <BranchChip label={node.branchLabel} chosen={node.chosen} />
        )}
        {isOutcome ? (
          <CircleCheckIcon
            className={node.chosen ? "text-primary" : "text-accent-foreground"}
          />
        ) : (
          <GitBranchIcon
            className={node.chosen ? "text-primary" : "text-muted-foreground"}
          />
        )}
        <span
          className={cn(
            "truncate font-medium",
            isOutcome && !node.chosen && "text-accent-foreground"
          )}
        >
          {node.label}
        </span>
      </div>
      {!isLeaf ? (
        <ul
          role="group"
          style={{ paddingInlineStart: `${depth * 0.5 + 1}rem` }}
          className="relative flex flex-col gap-1 pt-1"
        >
          <span
            aria-hidden
            className={cn(
              "absolute inset-y-0 left-2 w-px",
              node.chosen ? "bg-primary/40" : "bg-border"
            )}
          />
          {node.children!.map((child) => (
            <DecisionTreeNode key={child.id} node={child} depth={depth + 1} />
          ))}
        </ul>
      ) : null}
    </li>
  )
}

function DecisionTree({
  node,
  className,
  ...props
}: React.ComponentProps<"div"> & { node: DecisionNode }) {
  return (
    <div
      data-slot="decision-tree"
      className={cn("text-foreground", className)}
      {...props}
    >
      <ul role="tree" className="flex flex-col gap-1">
        <DecisionTreeNode node={node} depth={0} />
      </ul>
    </div>
  )
}

export { DecisionTree }
export type { DecisionNode }
