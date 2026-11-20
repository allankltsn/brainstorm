"use client"

import * as React from "react"
import { ExternalLinkIcon, LinkIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

type CitedAnswerCitation = {
  id: string
  n: number
  title: string
  url?: string
}

function CitedAnswer({
  answer,
  citations,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  answer: string
  citations: CitedAnswerCitation[]
}) {
  // Split on the citation markers, keeping the captured number so we can turn
  // each "[n]" into a visually distinct inline chip.
  const segments = answer.split(/\[(\d+)\]/)

  return (
    <div
      data-slot="cited-answer"
      className={cn(
        "flex flex-col gap-3 rounded-lg border border-border bg-card p-4 text-card-foreground",
        className
      )}
      {...props}
    >
      <p
        data-slot="cited-answer-body"
        className="text-sm leading-relaxed"
      >
        {segments.map((segment, index) => {
          // Odd indices are the captured digits from the split regex.
          if (index % 2 === 1) {
            return (
              <Badge
                key={index}
                data-slot="cited-answer-marker"
                variant="secondary"
                className="relative -top-1 mx-0.5 h-4 min-w-4 rounded-full px-1 align-super text-[0.625rem] tabular-nums"
              >
                {segment}
              </Badge>
            )
          }

          return <React.Fragment key={index}>{segment}</React.Fragment>
        })}
      </p>

      {citations.length > 0 ? (
        <>
          <Separator />
          <div
            data-slot="cited-answer-sources"
            className="flex flex-col gap-1.5"
          >
            <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <LinkIcon className="size-3.5" />
              Fontes
            </span>
            <ol className="flex flex-col gap-1">
              {citations.map((citation) => {
                const label = (
                  <>
                    <span className="inline-flex size-4 shrink-0 items-center justify-center rounded bg-muted text-[0.625rem] font-medium text-muted-foreground tabular-nums">
                      {citation.n}
                    </span>
                    <span>{citation.title}</span>
                    {citation.url ? (
                      <ExternalLinkIcon className="size-3 shrink-0 text-muted-foreground" />
                    ) : null}
                  </>
                )

                return (
                  <li key={citation.id} className="text-xs">
                    {citation.url ? (
                      <a
                        href={citation.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 hover:text-foreground"
                      >
                        {label}
                      </a>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                        {label}
                      </span>
                    )}
                  </li>
                )
              })}
            </ol>
          </div>
        </>
      ) : null}
    </div>
  )
}

export { CitedAnswer, type CitedAnswerCitation }
