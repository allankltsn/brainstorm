"use client"

import * as React from "react"
import { FileText, FileCode2, MessageSquare, Cog, Wrench } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

export type ContextMapItem = {
  id: string
  label: string
  tokens: number
  kind?: "file" | "doc" | "message" | "system" | "tool"
}

const kindMeta: Record<
  NonNullable<ContextMapItem["kind"]>,
  { label: string; icon: React.ComponentType<{ className?: string }> }
> = {
  file: { label: "arquivo", icon: FileCode2 },
  doc: { label: "doc", icon: FileText },
  message: { label: "mensagem", icon: MessageSquare },
  system: { label: "sistema", icon: Cog },
  tool: { label: "ferramenta", icon: Wrench },
}

function ContextMap({
  items,
  capTokens,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  items: ContextMapItem[]
  capTokens?: number
}) {
  const used = items.reduce((sum, it) => sum + it.tokens, 0)
  const cap = capTokens ?? used
  const safeCap = cap || 1
  const safeUsed = used || 1

  const fmt = (n: number) => n.toLocaleString("pt-BR")

  return (
    <div
      data-slot="context-map"
      className={cn("flex w-full flex-col gap-3", className)}
      {...props}
    >
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-sm font-medium">Mapa do contexto</span>
        <span className="text-xs text-muted-foreground tabular-nums">
          {fmt(used)} / {fmt(cap)} tokens
        </span>
      </div>

      <div
        role="img"
        aria-label={items
          .map((it) => `${it.label} ${fmt(it.tokens)}`)
          .join(", ")}
        className="flex h-3 w-full overflow-hidden rounded-full bg-muted"
      >
        {items.map((it, i) => {
          const pct = (it.tokens / safeCap) * 100
          return (
            <div
              key={it.id}
              className="h-full first:rounded-l-full last:rounded-r-full"
              style={{
                width: `${pct}%`,
                backgroundColor: `var(--chart-${(i % 5) + 1})`,
              }}
            />
          )
        })}
      </div>

      <ul className="grid gap-1.5">
        {items.map((it, i) => {
          const pct = Math.round((it.tokens / safeUsed) * 100)
          const meta = kindMeta[it.kind ?? "file"]
          const Icon = meta.icon
          return (
            <li key={it.id} className="flex items-center gap-2 text-sm">
              <span
                aria-hidden
                className="size-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: `var(--chart-${(i % 5) + 1})` }}
              />
              <Badge variant="secondary">
                <Icon className="shrink-0" />
                {meta.label}
              </Badge>
              <span className="min-w-0 flex-1 truncate">{it.label}</span>
              <span className="shrink-0 font-medium tabular-nums">
                {fmt(it.tokens)}
              </span>
              <span className="w-10 shrink-0 text-right text-xs text-muted-foreground tabular-nums">
                {pct}%
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export { ContextMap }
