"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

type ReviewStatus = "pending" | "approved" | "changes" | "rejected"

export type ReviewItem = {
  id: string
  title: string
  author: string
  status: ReviewStatus
  reviewer?: string
  at?: string
}

export type ReviewCenterProps = React.ComponentProps<"div"> & {
  items: ReviewItem[]
  onReview?: (id: string) => void
}

const STATUS: Record<
  ReviewStatus,
  { label: string; variant: React.ComponentProps<typeof Badge>["variant"] }
> = {
  pending: { label: "Pendente", variant: "secondary" },
  approved: { label: "Aprovado", variant: "default" },
  changes: { label: "Mudanças", variant: "outline" },
  rejected: { label: "Rejeitado", variant: "destructive" },
}

const ORDER: ReviewStatus[] = ["pending", "approved", "changes", "rejected"]

function initials(name: string) {
  return (
    name
      .trim()
      .split(/\s+/)
      .map((p) => p[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "?"
  )
}

function ReviewCenter({
  items,
  onReview,
  className,
  ...props
}: ReviewCenterProps) {
  const counts = React.useMemo(() => {
    const base: Record<ReviewStatus, number> = {
      pending: 0,
      approved: 0,
      changes: 0,
      rejected: 0,
    }
    for (const item of items) base[item.status]++
    return base
  }, [items])

  return (
    <div
      data-slot="review-center"
      className={cn(
        "w-full max-w-[560px] rounded-xl border border-border bg-card text-card-foreground",
        className
      )}
      {...props}
    >
      <header className="flex flex-wrap items-center gap-2 border-b border-border px-5 py-3">
        <span className="mr-auto text-sm font-medium text-foreground">
          Em revisão
        </span>
        {ORDER.filter((s) => counts[s] > 0).map((s) => (
          <Badge key={s} variant={STATUS[s].variant}>
            {STATUS[s].label}
            <span className="font-semibold">{counts[s]}</span>
          </Badge>
        ))}
      </header>

      <ul className="divide-y divide-border">
        {items.map((item) => (
          <li
            key={item.id}
            data-slot="review-center-row"
            className="flex flex-wrap items-center gap-3 px-5 py-3"
          >
            <div className="min-w-0 flex-1">
              <p
                dir="auto"
                className="truncate text-sm font-medium text-foreground"
              >
                {item.title}
              </p>
              <div className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                <Avatar size="sm">
                  <AvatarFallback>{initials(item.author)}</AvatarFallback>
                </Avatar>
                <span dir="auto" className="truncate">
                  {item.author}
                </span>
                {item.at ? (
                  <span className="shrink-0 before:mr-1.5 before:content-['·']">
                    {item.at}
                  </span>
                ) : null}
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <Badge variant={STATUS[item.status].variant}>
                {STATUS[item.status].label}
              </Badge>
              {item.reviewer ? (
                <span
                  dir="auto"
                  className="hidden text-xs text-muted-foreground sm:inline"
                >
                  {item.reviewer}
                </span>
              ) : null}
              {item.status === "pending" ? (
                <Button size="sm" onClick={() => onReview?.(item.id)}>
                  Revisar
                </Button>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export { ReviewCenter }
