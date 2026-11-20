"use client"

import * as React from "react"
import { CornerDownRightIcon, TargetIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

type CauseNode = {
  id: string
  label: string
  isRootCause?: boolean
  children?: CauseNode[]
}

function RootCauseTreeItem({
  node,
  depth,
}: {
  node: CauseNode
  depth: number
}) {
  const isBranch = Array.isArray(node.children) && node.children.length > 0
  const isRoot = node.isRootCause === true

  return (
    <li role="none">
      <div
        role="treeitem"
        data-slot="root-cause-tree-item"
        data-root-cause={isRoot || undefined}
        style={{ paddingInlineStart: `${depth * 1.25}rem` }}
        className="flex items-center gap-2 py-1 text-sm [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
      >
        {depth > 0 && (
          <span
            data-slot="root-cause-tree-connector"
            className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground"
          >
            <CornerDownRightIcon aria-hidden />
            <span>porque</span>
          </span>
        )}
        {isRoot && <TargetIcon className="text-destructive" aria-hidden />}
        <span
          className={cn(
            "truncate",
            isRoot
              ? "font-semibold text-destructive"
              : "font-medium text-foreground"
          )}
        >
          {node.label}
        </span>
        {isRoot && (
          <Badge variant="destructive" className="ml-1">
            Causa raiz
          </Badge>
        )}
      </div>
      {isBranch && (
        <ul role="group" className="flex flex-col">
          {node.children!.map((child) => (
            <RootCauseTreeItem
              key={child.id}
              node={child}
              depth={depth + 1}
            />
          ))}
        </ul>
      )}
    </li>
  )
}

function RootCauseTree({
  node,
  className,
  ...props
}: React.ComponentProps<"div"> & { node: CauseNode }) {
  return (
    <div
      data-slot="root-cause-tree"
      className={cn("text-foreground", className)}
      {...props}
    >
      <ul role="tree" className="flex flex-col">
        <RootCauseTreeItem node={node} depth={0} />
      </ul>
    </div>
  )
}

export { RootCauseTree }
export type { CauseNode }
