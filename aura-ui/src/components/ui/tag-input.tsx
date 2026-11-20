import * as React from "react"
import { XIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

function TagInput({
  value,
  defaultValue = [],
  onValueChange,
  placeholder = "Adicionar…",
  disabled = false,
  className,
}: {
  value?: string[]
  defaultValue?: string[]
  onValueChange?: (tags: string[]) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}) {
  const [internalTags, setInternalTags] = React.useState<string[]>(defaultValue)
  const [draft, setDraft] = React.useState("")

  const isControlled = value !== undefined
  const tags = isControlled ? value : internalTags

  const commit = React.useCallback(
    (next: string[]) => {
      if (!isControlled) setInternalTags(next)
      onValueChange?.(next)
    },
    [isControlled, onValueChange]
  )

  function addTag(raw: string) {
    const trimmed = raw.trim()
    if (!trimmed || tags.includes(trimmed)) return
    commit([...tags, trimmed])
  }

  function removeTag(tag: string) {
    commit(tags.filter((t) => t !== tag))
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault()
      addTag(draft)
      setDraft("")
    } else if (event.key === "Backspace" && draft === "" && tags.length > 0) {
      event.preventDefault()
      removeTag(tags[tags.length - 1])
    }
  }

  return (
    <div
      data-slot="tag-input"
      data-disabled={disabled || undefined}
      className={cn(
        "flex flex-wrap items-center gap-1.5 rounded-lg border border-input bg-transparent px-2 py-1.5 focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 data-disabled:pointer-events-none data-disabled:opacity-50",
        className
      )}
    >
      {tags.map((tag) => (
        <Badge key={tag} variant="secondary">
          {tag}
          <button
            type="button"
            aria-label={`Remover ${tag}`}
            disabled={disabled}
            onClick={() => removeTag(tag)}
            className="-mr-0.5 inline-flex items-center justify-center rounded-sm text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50"
          >
            <XIcon />
          </button>
        </Badge>
      ))}
      <input
        data-slot="tag-input-field"
        type="text"
        value={draft}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={handleKeyDown}
        className="h-6 flex-1 basis-24 border-0 bg-transparent px-1 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
      />
    </div>
  )
}

export { TagInput }
