"use client"

import * as React from "react"
import {
  ShieldAlertIcon,
  ShieldCheckIcon,
  ShieldXIcon,
  WrenchIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

type ToolAccess = "allowed" | "ask" | "denied"

type Tool = {
  id: string
  name: string
  access: ToolAccess
  description?: string
}

const accessConfig: Record<
  ToolAccess,
  {
    label: string
    variant: React.ComponentProps<typeof Badge>["variant"]
    className: string
    icon: React.ReactNode
  }
> = {
  allowed: {
    label: "Permitido",
    variant: "secondary",
    className: "bg-success/10 text-success",
    icon: <ShieldCheckIcon />,
  },
  ask: {
    label: "Perguntar",
    variant: "secondary",
    className: "bg-warning/10 text-warning",
    icon: <ShieldAlertIcon />,
  },
  denied: {
    label: "Negado",
    variant: "destructive",
    className: "",
    icon: <ShieldXIcon />,
  },
}

function ToolAccessMap({
  tools,
  className,
  ...props
}: Omit<React.ComponentProps<"div">, "children"> & {
  tools: Tool[]
}) {
  const summary = React.useMemo(() => {
    return tools.reduce(
      (acc, tool) => {
        acc[tool.access] += 1
        return acc
      },
      { allowed: 0, ask: 0, denied: 0 } as Record<ToolAccess, number>
    )
  }, [tools])

  return (
    <div
      data-slot="tool-access-map"
      className={cn(
        "flex flex-col gap-3 rounded-lg border border-border bg-card p-3 text-card-foreground",
        className
      )}
      {...props}
    >
      <div
        data-slot="tool-access-map-legend"
        className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground"
      >
        {(Object.keys(accessConfig) as ToolAccess[]).map((access) => (
          <span key={access} className="inline-flex items-center gap-1">
            <Badge
              variant={accessConfig[access].variant}
              className={cn("gap-1", accessConfig[access].className)}
            >
              {accessConfig[access].icon}
              {accessConfig[access].label}
            </Badge>
            <span className="tabular-nums">{summary[access]}</span>
          </span>
        ))}
      </div>

      <ul data-slot="tool-access-map-list" className="flex flex-col gap-1">
        {tools.map((tool) => {
          const config = accessConfig[tool.access]
          return (
            <li
              key={tool.id}
              data-slot="tool-access-map-item"
              data-access={tool.access}
              className="flex items-center gap-3 rounded-md px-2 py-1.5 transition-colors hover:bg-muted/50"
            >
              <span className="flex size-5 shrink-0 items-center justify-center text-muted-foreground [&_svg]:size-4">
                <WrenchIcon />
              </span>
              <div className="grid min-w-0 flex-1 gap-0.5">
                <span className="truncate font-mono text-sm font-medium">
                  {tool.name}
                </span>
                {tool.description ? (
                  <span className="truncate text-xs text-muted-foreground">
                    {tool.description}
                  </span>
                ) : null}
              </div>
              <Badge
                variant={config.variant}
                className={cn("gap-1", config.className)}
              >
                {config.icon}
                {config.label}
              </Badge>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export { ToolAccessMap }
export type { Tool as ToolAccessMapTool, ToolAccess as ToolAccessLevel }
