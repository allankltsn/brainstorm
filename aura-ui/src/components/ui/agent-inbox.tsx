"use client"

import * as React from "react"
import { CheckCircle2, HelpCircle, ShieldCheck, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty-state"

export type AgentInboxItem = {
  id: string
  /** Name of the agent asking for input */
  agent: string
  /** What needs a human – shown prominent */
  title: string
  /** Short context under the title */
  detail?: string
  /** Shapes the small label badge and icon */
  kind?: "approval" | "question" | "handoff"
}

export type AgentInboxProps = React.ComponentProps<"div"> & {
  items: AgentInboxItem[]
  /** Called with the item id and the chosen action */
  onResolve?: (id: string, action: "accept" | "dismiss") => void
  /** Shown when there are no items */
  emptyMessage?: string
}

const KIND_META: Record<
  NonNullable<AgentInboxItem["kind"]>,
  { label: string; Icon: typeof ShieldCheck }
> = {
  approval: { label: "Aprovação", Icon: ShieldCheck },
  question: { label: "Pergunta", Icon: HelpCircle },
  handoff: { label: "Transferência", Icon: Users },
}

// "Agente de Vendas" → "AV"
function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "?"
  const first = parts[0][0] ?? ""
  const last = parts.length > 1 ? parts[parts.length - 1][0] ?? "" : ""
  return (first + last).toUpperCase()
}

function AgentInbox({
  items,
  onResolve,
  emptyMessage = "Nada aguardando você.",
  className,
  ...props
}: AgentInboxProps) {
  if (items.length === 0) {
    return (
      <div
        data-slot="agent-inbox"
        className={cn("w-full max-w-[440px]", className)}
        {...props}
      >
        <Empty data-slot="agent-inbox-empty">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <CheckCircle2 />
            </EmptyMedia>
            <EmptyTitle>{emptyMessage}</EmptyTitle>
          </EmptyHeader>
        </Empty>
      </div>
    )
  }

  return (
    <div
      data-slot="agent-inbox"
      className={cn("w-full max-w-[440px]", className)}
      {...props}
    >
      <Card className="gap-0 divide-y divide-border py-0">
        {items.map((item) => {
          const meta = KIND_META[item.kind ?? "question"]
          const KindIcon = meta.Icon
          return (
            <div
              key={item.id}
              data-slot="agent-inbox-row"
              className="flex gap-3 px-5 py-4"
            >
              <Avatar size="sm">
                <AvatarFallback>{initials(item.agent)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate text-[0.8rem] text-muted-foreground">
                    {item.agent}
                  </span>
                  <Badge variant="secondary" className="shrink-0">
                    <KindIcon />
                    <span>{meta.label}</span>
                  </Badge>
                </div>
                <p
                  dir="auto"
                  className="mt-1 text-sm leading-5 font-medium text-foreground [overflow-wrap:anywhere]"
                >
                  {item.title}
                </p>
                {item.detail ? (
                  <p
                    dir="auto"
                    className="mt-1 text-[0.8rem] leading-5 whitespace-pre-line text-muted-foreground [overflow-wrap:anywhere]"
                  >
                    {item.detail}
                  </p>
                ) : null}
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <Button size="sm" onClick={() => onResolve?.(item.id, "accept")}>
                    Responder
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onResolve?.(item.id, "dismiss")}
                  >
                    Dispensar
                  </Button>
                </div>
              </div>
            </div>
          )
        })}
      </Card>
    </div>
  )
}

export { AgentInbox }
