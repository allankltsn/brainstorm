"use client"

import * as React from "react"
import { CheckIcon, SparklesIcon, XIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export type WritingSuggestion = {
  id: string
  type: "tom" | "gramática" | "clareza" | "concisão"
  /** The original text, shown struck through */
  before: string
  /** The proposed replacement */
  after: string
  /** Optional one-line explanation */
  note?: string
}

export type WritingAssistantProps = React.ComponentProps<"div"> & {
  suggestions: WritingSuggestion[]
  onApply?: (id: string) => void
  onDismiss?: (id: string) => void
}

/* Assistente de escrita: sugestões para melhorar um texto, uma por cartão. */
function WritingAssistant({
  suggestions,
  onApply,
  onDismiss,
  className,
  ...props
}: WritingAssistantProps) {
  const count = suggestions.length

  return (
    <div
      data-slot="writing-assistant"
      className={cn(
        "flex w-full max-w-120 flex-col gap-3 rounded-2xl border bg-card p-3 text-card-foreground",
        className
      )}
      {...props}
    >
      <header className="flex items-center gap-2 px-1">
        <SparklesIcon className="size-4 shrink-0 text-brand-text" aria-hidden="true" />
        <span className="min-w-0 flex-1 truncate font-heading text-sm font-medium text-foreground">
          Assistente de escrita
        </span>
        <Badge variant="secondary" className="shrink-0 tabular-nums">
          {count}
        </Badge>
      </header>

      {count > 0 && (
        <ul className="flex flex-col gap-2.5">
          {suggestions.map((s) => (
            <li
              key={s.id}
              data-slot="writing-assistant-item"
              className="flex flex-col gap-2 rounded-xl border bg-background p-3"
            >
              <Badge variant="outline" className="capitalize">
                {s.type}
              </Badge>

              <div className="flex flex-col gap-1 text-sm leading-relaxed">
                <p
                  dir="auto"
                  className="rounded-md bg-destructive/10 px-2 py-1 text-destructive line-through [overflow-wrap:anywhere]"
                >
                  {s.before}
                </p>
                <p
                  dir="auto"
                  className="rounded-md bg-success/10 px-2 py-1 text-success [overflow-wrap:anywhere]"
                >
                  {s.after}
                </p>
              </div>

              {s.note && (
                <p
                  dir="auto"
                  className="text-xs leading-relaxed text-muted-foreground [overflow-wrap:anywhere]"
                >
                  {s.note}
                </p>
              )}

              <div className="flex flex-wrap justify-end gap-1.5">
                <Button
                  type="button"
                  size="sm"
                  onClick={() => onApply?.(s.id)}
                >
                  <CheckIcon aria-hidden="true" />
                  Aplicar
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onDismiss?.(s.id)}
                >
                  <XIcon aria-hidden="true" />
                  Ignorar
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export { WritingAssistant }
