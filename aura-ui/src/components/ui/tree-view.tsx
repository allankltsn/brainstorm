import * as React from "react"
import { ChevronRightIcon, FileIcon, FolderIcon } from "lucide-react"
import { cn } from "@/lib/utils"

type TreeNode = {
  id: string
  label: string
  icon?: React.ReactNode
  children?: TreeNode[]
  defaultOpen?: boolean
}

function TreeItem({
  node,
  depth,
  selectedId,
  onSelect,
}: {
  node: TreeNode
  depth: number
  selectedId: string | null
  onSelect: (node: TreeNode) => void
}) {
  const isBranch = Array.isArray(node.children) && node.children.length > 0
  const [open, setOpen] = React.useState(node.defaultOpen ?? false)
  const isSelected = selectedId === node.id

  function activate() {
    if (isBranch) {
      setOpen((prev) => !prev)
    } else {
      onSelect(node)
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      activate()
    }
  }

  return (
    <li role="none">
      <div
        role="treeitem"
        data-slot="tree-item"
        aria-expanded={isBranch ? open : undefined}
        aria-selected={!isBranch ? isSelected : undefined}
        tabIndex={0}
        onClick={activate}
        onKeyDown={handleKeyDown}
        style={{ paddingInlineStart: `${depth * 1 + 0.5}rem` }}
        className={cn(
          "flex h-8 cursor-pointer items-center gap-1.5 rounded-md pr-2 text-sm text-foreground outline-none transition-colors select-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
          isSelected && "bg-accent text-accent-foreground hover:bg-accent"
        )}
      >
        {isBranch ? (
          <ChevronRightIcon
            data-slot="tree-chevron"
            className={cn(
              "text-muted-foreground transition-transform duration-200",
              open && "rotate-90"
            )}
          />
        ) : (
          <span className="size-4 shrink-0" aria-hidden />
        )}
        {node.icon ??
          (isBranch ? (
            <FolderIcon className="text-muted-foreground" />
          ) : (
            <FileIcon className="text-muted-foreground" />
          ))}
        <span className="truncate">{node.label}</span>
      </div>
      {isBranch && open ? (
        <ul role="group" className="flex flex-col">
          {node.children!.map((child) => (
            <TreeItem
              key={child.id}
              node={child}
              depth={depth + 1}
              selectedId={selectedId}
              onSelect={onSelect}
            />
          ))}
        </ul>
      ) : null}
    </li>
  )
}

function TreeView({
  nodes,
  onSelect,
  className,
}: {
  nodes: TreeNode[]
  onSelect?: (node: TreeNode) => void
  className?: string
}) {
  const [selectedId, setSelectedId] = React.useState<string | null>(null)

  function handleSelect(node: TreeNode) {
    setSelectedId(node.id)
    onSelect?.(node)
  }

  return (
    <ul
      role="tree"
      data-slot="tree-view"
      className={cn("flex flex-col text-foreground", className)}
    >
      {nodes.map((node) => (
        <TreeItem
          key={node.id}
          node={node}
          depth={0}
          selectedId={selectedId}
          onSelect={handleSelect}
        />
      ))}
    </ul>
  )
}

export { TreeView, type TreeNode }
