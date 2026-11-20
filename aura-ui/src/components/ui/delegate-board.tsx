"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

type DelegateStatus = "todo" | "doing" | "done" | "blocked"

type DelegateTask = {
  id: string
  title: string
  assignee?: string
  status?: DelegateStatus
}

const statusConfig: Record<
  DelegateStatus,
  { label: string; variant: React.ComponentProps<typeof Badge>["variant"]; className?: string }
> = {
  todo: { label: "A fazer", variant: "secondary", className: "bg-muted text-muted-foreground" },
  doing: { label: "Em andamento", variant: "default" },
  done: {
    label: "Concluído",
    variant: "secondary",
    className: "bg-success-soft text-success",
  },
  blocked: { label: "Bloqueado", variant: "destructive" },
}

const UNASSIGNED = "__unassigned__"

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "?"
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function StatusBadge({ status }: { status?: DelegateStatus }) {
  const config = statusConfig[status ?? "todo"]
  return (
    <Badge
      variant={config.variant}
      className={config.className}
      data-slot="delegate-board-status"
    >
      {config.label}
    </Badge>
  )
}

function DelegateBoard({
  tasks,
  className,
  ...props
}: React.ComponentProps<"div"> & { tasks: DelegateTask[] }) {
  const groups = React.useMemo(() => {
    const map = new Map<string, { assignee?: string; tasks: DelegateTask[] }>()
    for (const task of tasks) {
      const key = task.assignee?.trim() ? task.assignee : UNASSIGNED
      if (!map.has(key)) {
        map.set(key, { assignee: key === UNASSIGNED ? undefined : key, tasks: [] })
      }
      map.get(key)!.tasks.push(task)
    }
    return Array.from(map.values())
  }, [tasks])

  return (
    <div
      data-slot="delegate-board"
      className={cn("flex flex-col gap-4", className)}
      {...props}
    >
      {groups.map((group) => {
        const name = group.assignee ?? "Sem responsável"
        return (
          <section
            key={group.assignee ?? UNASSIGNED}
            data-slot="delegate-board-group"
            className="flex flex-col gap-2"
          >
            <header className="flex items-center gap-2">
              <Avatar size="sm">
                <AvatarFallback>
                  {group.assignee ? getInitials(group.assignee) : "--"}
                </AvatarFallback>
              </Avatar>
              <span
                className={cn(
                  "font-heading text-sm font-medium",
                  group.assignee ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {name}
              </span>
              <Badge variant="secondary">{group.tasks.length}</Badge>
            </header>

            <ul className="flex flex-col gap-2">
              {group.tasks.map((task) => (
                <li
                  key={task.id}
                  data-slot="delegate-board-task"
                  className="flex items-center justify-between gap-3 rounded-lg bg-card p-3 text-sm text-card-foreground ring-1 ring-foreground/10"
                >
                  <span className="min-w-0 flex-1 truncate font-medium">
                    {task.title}
                  </span>
                  <StatusBadge status={task.status} />
                </li>
              ))}
            </ul>
          </section>
        )
      })}
    </div>
  )
}

export { DelegateBoard }
export type { DelegateTask, DelegateStatus }
