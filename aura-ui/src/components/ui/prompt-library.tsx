"use client"

import * as React from "react"
import { SearchIcon, CopyIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

type Prompt = {
  id: string
  title: string
  category?: string
  text: string
}

function PromptLibrary({
  prompts,
  onUse,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  prompts: Prompt[]
  onUse?: (id: string) => void
}) {
  const [query, setQuery] = React.useState("")

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return prompts
    return prompts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) || p.text.toLowerCase().includes(q)
    )
  }, [prompts, query])

  return (
    <div
      data-slot="prompt-library"
      className={cn("flex flex-col gap-3", className)}
      {...props}
    >
      <div className="relative">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar prompts..."
          aria-label="Buscar prompts"
          className="pl-8"
        />
      </div>

      {filtered.length === 0 ? (
        <div
          data-slot="prompt-library-empty"
          className="rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground"
        >
          Nenhum prompt encontrado.
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {filtered.map((prompt) => (
            <li
              key={prompt.id}
              data-slot="prompt-library-item"
              className="flex flex-col gap-2 rounded-xl border border-border bg-card p-3 text-card-foreground"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2">
                  <span className="truncate font-medium">{prompt.title}</span>
                  {prompt.category ? (
                    <Badge variant="secondary">{prompt.category}</Badge>
                  ) : null}
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => onUse?.(prompt.id)}
                >
                  <CopyIcon />
                  Usar
                </Button>
              </div>
              <p className="line-clamp-2 font-mono text-xs text-muted-foreground">
                {prompt.text}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export { PromptLibrary }
export type { Prompt }
