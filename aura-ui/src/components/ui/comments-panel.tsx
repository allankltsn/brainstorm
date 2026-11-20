"use client"

import * as React from "react"
import { CheckIcon, MessageSquareIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export type PanelComment = {
  id: string
  author: string
  text: string
  at?: string
  resolved?: boolean
}

export type CommentsPanelProps = React.ComponentProps<"div"> & {
  comments: PanelComment[]
  onResolve?: (id: string) => void
  title?: string
}

/** Two initials from whole letters – skips emoji and stray spaces, so "🦊 Fox" gives "F" */
const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((w) => Array.from(w).find((c) => /[\p{L}\p{N}]/u.test(c)))
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase()

export function CommentsPanel({
  comments,
  onResolve,
  title = "Comentários",
  className,
  ...props
}: CommentsPanelProps) {
  const open = comments.filter((c) => !c.resolved).length

  return (
    <div
      data-slot="comments-panel"
      className={cn(
        "flex w-full max-w-sm flex-col overflow-hidden rounded-xl border border-border bg-card",
        className
      )}
      {...props}
    >
      <header className="flex min-h-11 items-center gap-2.5 border-b border-border px-4 py-2">
        <MessageSquareIcon className="size-4 shrink-0 text-muted-foreground" />
        <h3
          dir="auto"
          title={title}
          className="min-w-0 flex-1 truncate text-sm font-medium text-foreground"
        >
          {title}
        </h3>
        <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
          {open}/{comments.length}
        </span>
      </header>

      <div className="grid content-start gap-3 overflow-y-auto p-3">
        {comments.map((c) => (
          <article
            key={c.id}
            data-resolved={c.resolved ? "" : undefined}
            className={cn(
              "min-w-0 rounded-lg border border-border bg-background p-3 transition-opacity",
              c.resolved && "opacity-60"
            )}
          >
            <div className="flex items-center gap-2">
              <Avatar size="sm" className="shrink-0">
                <AvatarFallback>{initials(c.author)}</AvatarFallback>
              </Avatar>
              <span
                dir="auto"
                title={c.author}
                className="min-w-0 truncate text-sm font-medium text-foreground"
              >
                {c.author}
              </span>
              {c.at && (
                <span className="ml-auto shrink-0 text-xs text-muted-foreground tabular-nums">
                  {c.at}
                </span>
              )}
            </div>

            <p
              dir="auto"
              className="mt-2 text-sm leading-relaxed text-foreground whitespace-pre-line [overflow-wrap:anywhere]"
            >
              {c.text}
            </p>

            <div className="mt-2 flex items-center justify-end">
              {c.resolved ? (
                <Badge variant="secondary">
                  <CheckIcon />
                  Resolvido
                </Badge>
              ) : (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  aria-label={`Resolver comentário de ${c.author}`}
                  onClick={() => onResolve?.(c.id)}
                >
                  <CheckIcon />
                  Resolver
                </Button>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
