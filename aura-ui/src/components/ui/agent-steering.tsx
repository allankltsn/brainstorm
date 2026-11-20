"use client"

import * as React from "react"
import { SendIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

function AgentSteering({
  onSteer,
  suggestions,
  placeholder = "Oriente o agente…",
  className,
  ...props
}: React.ComponentProps<"div"> & {
  onSteer?: (text: string) => void
  suggestions?: string[]
  placeholder?: string
}) {
  const [value, setValue] = React.useState("")

  function steer(text: string) {
    const trimmed = text.trim()
    if (!trimmed) return
    onSteer?.(trimmed)
  }

  function handleSend() {
    const trimmed = value.trim()
    if (!trimmed) return
    onSteer?.(trimmed)
    setValue("")
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      handleSend()
    }
  }

  const canSend = value.trim().length > 0

  return (
    <div
      data-slot="agent-steering"
      className={cn(
        "flex flex-col gap-2 rounded-xl border border-input bg-card p-2",
        className
      )}
      {...props}
    >
      {suggestions && suggestions.length > 0 ? (
        <div
          data-slot="agent-steering-suggestions"
          className="flex flex-wrap items-center gap-1"
        >
          {suggestions.map((suggestion) => (
            <Button
              key={suggestion}
              type="button"
              variant="outline"
              size="xs"
              onClick={() => steer(suggestion)}
            >
              {suggestion}
            </Button>
          ))}
        </div>
      ) : null}
      <Textarea
        data-slot="agent-steering-input"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        rows={2}
        className="min-h-9 resize-none border-none bg-transparent px-1.5 py-1 shadow-none focus-visible:border-none focus-visible:ring-0 dark:bg-transparent"
      />
      <div className="flex items-center justify-end">
        <Button
          type="button"
          size="sm"
          disabled={!canSend}
          onClick={handleSend}
        >
          <SendIcon />
          Enviar
        </Button>
      </div>
    </div>
  )
}

export { AgentSteering }
