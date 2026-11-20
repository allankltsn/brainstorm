import * as React from "react"
import { SparklesIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"

type Citation = {
  id: string | number
  label: string
  href?: string
}

function AiAnswer({
  children,
  citations,
  title,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  children: React.ReactNode
  citations?: Citation[]
  title?: React.ReactNode
}) {
  return (
    <div
      data-slot="ai-answer"
      className={cn(
        "flex flex-col gap-3 rounded-lg border border-border bg-card p-4 text-card-foreground",
        className
      )}
      {...props}
    >
      {title ? (
        <div
          data-slot="ai-answer-title"
          className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground"
        >
          <SparklesIcon className="size-3.5 text-brand-text" />
          {title}
        </div>
      ) : null}

      <div
        data-slot="ai-answer-body"
        className="text-sm leading-relaxed [&_a]:underline [&_p]:mt-2 [&_p:first-child]:mt-0"
      >
        {children}
      </div>

      {citations && citations.length > 0 ? (
        <>
          <Separator />
          <div data-slot="ai-answer-sources" className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-muted-foreground">
              Fontes
            </span>
            <ul className="flex flex-col gap-1">
              {citations.map((citation, index) => {
                const chip = (
                  <>
                    <span className="inline-flex size-4 shrink-0 items-center justify-center rounded bg-brand-soft text-[0.625rem] font-medium text-brand-text tabular-nums">
                      {index + 1}
                    </span>
                    <span className="text-muted-foreground">
                      {citation.label}
                    </span>
                  </>
                )

                return (
                  <li key={citation.id} className="text-xs">
                    {citation.href ? (
                      <a
                        href={citation.href}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 hover:[&>span:last-child]:text-foreground"
                      >
                        {chip}
                      </a>
                    ) : (
                      <span className="inline-flex items-center gap-1.5">
                        {chip}
                      </span>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        </>
      ) : null}
    </div>
  )
}

export { AiAnswer, type Citation }
