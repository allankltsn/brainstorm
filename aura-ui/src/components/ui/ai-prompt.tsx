import * as React from "react"
import { SparklesIcon, ArrowUpIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

function AiPrompt({
  value,
  onValueChange,
  onSubmit,
  placeholder = "Peça algo à Aura…",
  suggestions,
  disabled = false,
  className,
  ...props
}: Omit<React.ComponentProps<"div">, "onSubmit"> & {
  value?: string
  onValueChange?: (v: string) => void
  onSubmit?: (text: string) => void
  placeholder?: string
  suggestions?: string[]
  disabled?: boolean
}) {
  const [internal, setInternal] = React.useState(value ?? "")
  const text = value ?? internal

  const setText = React.useCallback(
    (next: string) => {
      if (value === undefined) setInternal(next)
      onValueChange?.(next)
    },
    [value, onValueChange]
  )

  const submit = React.useCallback(
    (next: string) => {
      const trimmed = next.trim()
      if (!trimmed || disabled) return
      onSubmit?.(trimmed)
    },
    [disabled, onSubmit]
  )

  return (
    <div
      data-slot="ai-prompt"
      className={cn("flex w-full flex-col gap-2", className)}
      {...props}
    >
      <div
        data-slot="ai-prompt-field"
        className={cn(
          "flex items-center gap-2 rounded-xl border border-input bg-transparent px-2.5 transition-colors",
          "focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50",
          disabled && "pointer-events-none opacity-50"
        )}
      >
        <SparklesIcon className="size-4 shrink-0 text-muted-foreground" />
        <Input
          data-slot="ai-prompt-input"
          value={text}
          disabled={disabled}
          placeholder={placeholder}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              submit(text)
            }
          }}
          className="h-9 border-0 bg-transparent px-0 focus-visible:border-0 focus-visible:ring-0 dark:bg-transparent"
        />
        <Button
          type="button"
          size="icon-sm"
          aria-label="Enviar"
          disabled={disabled || text.trim().length === 0}
          onClick={() => submit(text)}
          className="rounded-full"
        >
          <ArrowUpIcon />
        </Button>
      </div>
      {suggestions && suggestions.length > 0 && (
        <div data-slot="ai-prompt-suggestions" className="flex flex-wrap gap-1.5">
          {suggestions.map((suggestion) => (
            <Button
              key={suggestion}
              type="button"
              variant="outline"
              size="sm"
              disabled={disabled}
              onClick={() => {
                setText(suggestion)
                submit(suggestion)
              }}
              className="rounded-full"
            >
              {suggestion}
            </Button>
          ))}
        </div>
      )}
    </div>
  )
}

export { AiPrompt }
