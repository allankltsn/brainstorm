"use client"

import * as React from "react"
import { ChevronRightIcon, FileIcon, FolderIcon } from "lucide-react"
import { cn } from "@/lib/utils"

type RepoNode = {
  id: string
  name: string
  kind?: "dir" | "file"
  change?: "added" | "modified" | "removed"
  lines?: number
  children?: RepoNode[]
}

const changeConfig: Record<
  NonNullable<RepoNode["change"]>,
  { letter: string; className: string; label: string }
> = {
  added: { letter: "A", className: "text-success", label: "added" },
  modified: { letter: "M", className: "text-warning", label: "modified" },
  removed: { letter: "D", className: "text-destructive", label: "removed" },
}

function isDir(node: RepoNode) {
  return node.kind === "dir" || (node.kind == null && Array.isArray(node.children))
}

function RepoMapItem({ node, depth }: { node: RepoNode; depth: number }) {
  const dir = isDir(node)
  const [open, setOpen] = React.useState(true)
  const change = node.change ? changeConfig[node.change] : null

  return (
    <li role="none">
      <div
        role="treeitem"
        data-slot="repo-map-item"
        aria-expanded={dir ? open : undefined}
        tabIndex={0}
        onClick={() => dir && setOpen((prev) => !prev)}
        onKeyDown={(event) => {
          if (dir && (event.key === "Enter" || event.key === " ")) {
            event.preventDefault()
            setOpen((prev) => !prev)
          }
        }}
        style={{ paddingInlineStart: `${depth * 1 + 0.5}rem` }}
        className={cn(
          "flex h-8 items-center gap-1.5 rounded-md pr-2 text-sm text-foreground outline-none transition-colors select-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
          dir && "cursor-pointer"
        )}
      >
        {dir ? (
          <ChevronRightIcon
            data-slot="repo-map-chevron"
            className={cn(
              "text-muted-foreground transition-transform duration-200",
              open && "rotate-90"
            )}
          />
        ) : (
          <span className="size-4 shrink-0" aria-hidden />
        )}
        {dir ? (
          <FolderIcon className="text-muted-foreground" />
        ) : (
          <FileIcon className="text-muted-foreground" />
        )}
        <span className="truncate">{node.name}</span>
        {!dir && change ? (
          <span
            data-slot="repo-map-change"
            data-change={node.change}
            aria-label={change.label}
            className={cn(
              "ml-1 inline-flex size-4 shrink-0 items-center justify-center rounded-sm text-xs font-semibold",
              change.className
            )}
          >
            {change.letter}
          </span>
        ) : null}
        {!dir && typeof node.lines === "number" ? (
          <span
            data-slot="repo-map-lines"
            className="ml-auto text-xs tabular-nums text-muted-foreground"
          >
            {node.lines}
          </span>
        ) : null}
      </div>
      {dir && open && node.children?.length ? (
        <ul role="group" className="flex flex-col">
          {node.children.map((child) => (
            <RepoMapItem key={child.id} node={child} depth={depth + 1} />
          ))}
        </ul>
      ) : null}
    </li>
  )
}

function RepoMap({
  root,
  className,
  ...props
}: { root: RepoNode } & React.ComponentProps<"div">) {
  return (
    <div
      data-slot="repo-map"
      className={cn("text-foreground", className)}
      {...props}
    >
      <ul role="tree" className="flex flex-col">
        <RepoMapItem node={root} depth={0} />
      </ul>
    </div>
  )
}

export { RepoMap, type RepoNode }
