import * as React from "react"
import { CheckIcon, ChevronDownIcon, TerminalIcon, XIcon } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

type ToolCallStatus = "running" | "success" | "error"

function ToolCallStatusIndicator({ status }: { status: ToolCallStatus }) {
  if (status === "success") {
    return <CheckIcon data-slot="tool-call-status" className="size-4 text-success" />
  }
  if (status === "error") {
    return <XIcon data-slot="tool-call-status" className="size-4 text-destructive" />
  }
  return <Spinner />
}

function ToolCallCard({
  name,
  args,
  status = "running",
  result,
  defaultOpen = true,
  icon,
  className,
  ...props
}: Omit<React.ComponentProps<"div">, "children"> & {
  name: string
  args?: React.ReactNode
  status?: ToolCallStatus
  result?: React.ReactNode
  defaultOpen?: boolean
  icon?: React.ReactNode
}) {
  const [open, setOpen] = React.useState(defaultOpen)
  const hasBody = args != null || result != null

  return (
    <div
      data-slot="tool-call-card"
      data-status={status}
      className={cn(
        "flex flex-col gap-2 overflow-hidden rounded-lg border border-border bg-card p-3 text-sm text-card-foreground",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-2">
        <span className="flex size-4 shrink-0 items-center justify-center text-muted-foreground [&_svg]:size-4">
          {icon ?? <TerminalIcon className="size-4" />}
        </span>
        <code className="min-w-0 flex-1 truncate font-mono text-xs">{name}</code>
        <ToolCallStatusIndicator status={status} />
        {hasBody && (
          <button
            type="button"
            aria-expanded={open}
            aria-label={open ? "Recolher" : "Expandir"}
            onClick={() => setOpen((v) => !v)}
            className="flex size-5 shrink-0 items-center justify-center rounded text-muted-foreground transition-colors hover:text-foreground"
          >
            <ChevronDownIcon
              className={cn("size-4 transition-transform", open && "rotate-180")}
            />
          </button>
        )}
      </div>

      {hasBody && open && (
        <div data-slot="tool-call-body" className="flex flex-col gap-2">
          {args != null && (
            <code className="block overflow-x-auto rounded bg-muted px-2 py-1 font-mono text-xs">
              {args}
            </code>
          )}
          {result != null && (
            <div className="text-xs text-muted-foreground">{result}</div>
          )}
        </div>
      )}
    </div>
  )
}

export { ToolCallCard }
