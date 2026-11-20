import * as React from "react"
import { CheckIcon, CopyIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

function CodeBlock({
  code,
  language,
  filename,
  showLineNumbers = false,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  code: string
  language?: string
  filename?: string
  showLineNumbers?: boolean
}) {
  const [copied, setCopied] = React.useState(false)
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  const copy = React.useCallback(() => {
    void navigator.clipboard.writeText(code)
    setCopied(true)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => setCopied(false), 2000)
  }, [code])

  const label = filename ?? language
  const lines = code.split("\n")

  return (
    <div
      data-slot="code-block"
      className={cn(
        "rounded-xl border border-border bg-card overflow-hidden",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between gap-2 bg-muted/50 px-3 py-1.5 text-xs text-muted-foreground">
        <span className="truncate font-mono">{label}</span>
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          onClick={copy}
          aria-label="Copiar código"
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
        </Button>
      </div>
      <pre className="overflow-x-auto p-3 font-mono text-sm text-foreground">
        <code>
          {showLineNumbers
            ? lines.map((line, i) => (
                <span key={i} className="grid grid-cols-[auto_1fr] gap-3">
                  <span className="select-none text-right text-muted-foreground">
                    {i + 1}
                  </span>
                  <span>{line}</span>
                </span>
              ))
            : code}
        </code>
      </pre>
    </div>
  )
}

export { CodeBlock }
