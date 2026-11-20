"use client"

import type { ComponentProps } from "react"
import {
  AtSignIcon,
  GitCommitHorizontalIcon,
  MessageCircleIcon,
  MessageSquareIcon,
  SparklesIcon,
  type LucideIcon,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type AwayItemKind = "comment" | "commit" | "mention" | "review" | "message"

export type AwaySummaryItem = {
  id: string
  label: string
  count?: number
  kind?: AwayItemKind
}

export type AwaySummaryProps = ComponentProps<"div"> & {
  /** Short context, e.g. "desde ontem" */
  since?: string
  items: AwaySummaryItem[]
  title?: string
}

const KIND_ICON: Record<AwayItemKind, LucideIcon> = {
  comment: MessageSquareIcon,
  commit: GitCommitHorizontalIcon,
  mention: AtSignIcon,
  review: MessageCircleIcon,
  message: MessageSquareIcon,
}

/* Resumo "enquanto você esteve fora": recapitula a atividade perdida. */
export function AwaySummary({
  since,
  items,
  title = "Enquanto você esteve fora",
  className,
  ...props
}: AwaySummaryProps) {
  return (
    <Card
      data-slot="away-summary"
      className={cn("w-full max-w-120 gap-0", className)}
      {...props}
    >
      <div
        data-slot="away-summary-header"
        className="flex items-start gap-3 px-(--card-spacing)"
      >
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground [&_svg]:size-4">
          <SparklesIcon aria-hidden="true" />
        </span>
        <div className="flex min-w-0 flex-col">
          <span
            className="font-heading text-base leading-snug font-medium text-foreground"
            dir="auto"
            title={title}
          >
            {title}
          </span>
          {since && (
            <span
              className="truncate text-xs text-muted-foreground"
              dir="auto"
              title={since}
            >
              {since}
            </span>
          )}
        </div>
      </div>

      {items.length > 0 && (
        <ul
          data-slot="away-summary-list"
          className="mt-3 flex flex-col px-1.5"
        >
          {items.map((item) => {
            const Icon = KIND_ICON[item.kind ?? "message"] ?? MessageSquareIcon
            return (
              <li
                key={item.id}
                data-slot="away-summary-item"
                className="flex min-h-11 items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-muted/50"
              >
                <span className="flex size-5 shrink-0 items-center justify-center text-muted-foreground [&_svg]:size-4">
                  <Icon aria-hidden="true" />
                </span>
                <span
                  className="min-w-0 flex-1 truncate text-sm text-foreground"
                  dir="auto"
                  title={item.label}
                >
                  {item.label}
                </span>
                {typeof item.count === "number" && (
                  <Badge variant="secondary" className="shrink-0">
                    {item.count}
                  </Badge>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </Card>
  )
}
