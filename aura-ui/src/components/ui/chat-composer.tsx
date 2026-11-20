import * as React from "react"
import { SendIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

function ChatComposer({
  value,
  onValueChange,
  onSubmit,
  placeholder = "Pergunte à Aura…",
  disabled = false,
  actions,
  className,
}: {
  value?: string
  onValueChange?: (v: string) => void
  onSubmit?: (text: string) => void
  placeholder?: string
  disabled?: boolean
  actions?: React.ReactNode
  className?: string
}) {
  const isControlled = value !== undefined
  const [internalValue, setInternalValue] = React.useState("")
  const currentValue = isControlled ? value : internalValue

  function setValue(next: string) {
    if (!isControlled) setInternalValue(next)
    onValueChange?.(next)
  }

  function handleSubmit() {
    const text = currentValue.trim()
    if (!text || disabled) return
    onSubmit?.(text)
    if (!isControlled) setInternalValue("")
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      handleSubmit()
    }
  }

  const canSubmit = currentValue.trim().length > 0 && !disabled

  return (
    <div
      data-slot="chat-composer"
      className={cn(
        "flex flex-col gap-2 rounded-xl border border-input bg-card p-2 transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50",
        className
      )}
    >
      <Textarea
        data-slot="chat-composer-input"
        value={currentValue}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        rows={1}
        className="min-h-9 resize-none border-none bg-transparent px-1.5 py-1 shadow-none focus-visible:border-none focus-visible:ring-0 dark:bg-transparent"
      />
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1">{actions}</div>
        <Button
          type="button"
          size="icon-sm"
          aria-label="Enviar"
          disabled={!canSubmit}
          onClick={handleSubmit}
          className="rounded-full"
        >
          <SendIcon />
        </Button>
      </div>
    </div>
  )
}

export { ChatComposer }
