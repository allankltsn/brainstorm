"use client"

import * as React from "react"
import { BrainIcon, ChevronDownIcon } from "lucide-react"
import { cn } from "@/lib/utils"

type ReasoningStep = {
  id: string
  text: string
}

function ReasoningSummary({
  summary,
  steps,
  defaultOpen = false,
  duration,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  summary: string
  steps?: ReasoningStep[]
  defaultOpen?: boolean
  duration?: string
}) {
  const [open, setOpen] = React.useState(defaultOpen)

  return (
    <div
      data-slot="reasoning-summary"
      data-state={open ? "open" : "closed"}
      className={cn(
        "rounded-lg border border-border bg-card text-card-foreground",
        className
      )}
      {...props}
    >
      <button
        type="button"
        data-slot="reasoning-summary-trigger"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-foreground outline-none transition-colors hover:bg-muted/50 focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <BrainIcon className="size-4 shrink-0 text-muted-foreground" />
        <span>Raciocínio</span>
        {duration ? (
          <span
            data-slot="reasoning-summary-duration"
            className="text-xs font-normal text-muted-foreground"
          >
            {duration}
          </span>
        ) : null}
        <ChevronDownIcon
          aria-hidden
          className={cn(
            "ml-auto size-4 shrink-0 text-muted-foreground transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>

      {open ? (
        <div
          data-slot="reasoning-summary-content"
          className="flex flex-col gap-3 px-3 pb-3 pt-0"
        >
          <p
            data-slot="reasoning-summary-gist"
            className="text-sm leading-6 text-foreground"
          >
            {summary}
          </p>
          {steps && steps.length > 0 ? (
            <ol
              data-slot="reasoning-summary-steps"
              className="flex flex-col gap-2 border-l border-border pl-4"
            >
              {steps.map((step) => (
                <li
                  key={step.id}
                  data-slot="reasoning-summary-step"
                  className="text-sm leading-6 text-muted-foreground"
                >
                  {step.text}
                </li>
              ))}
            </ol>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

export { ReasoningSummary }
export type { ReasoningStep }
