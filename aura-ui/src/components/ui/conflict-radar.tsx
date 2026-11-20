"use client"

import * as React from "react"
import { GitMergeIcon, TriangleAlertIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type ConflictSeverity = "low" | "medium" | "high"

type Conflict = {
  id: string
  title: string
  parties?: string[]
  severity?: ConflictSeverity
  location?: string
}

const SEVERITY_LABEL: Record<ConflictSeverity, string> = {
  high: "Alto",
  medium: "Médio",
  low: "Baixo",
}

/* Ponto por severidade usando tokens semânticos. */
const SEVERITY_DOT: Record<ConflictSeverity, string> = {
  high: "bg-destructive",
  medium: "bg-warning",
  low: "bg-muted-foreground/40",
}

/* Badge por severidade usando tokens semânticos. */
const SEVERITY_BADGE: Record<ConflictSeverity, string> = {
  high: "bg-destructive/10 text-destructive",
  medium: "bg-warning/10 text-warning",
  low: "bg-muted text-muted-foreground",
}

function ConflictRadar({
  conflicts,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  conflicts: Conflict[]
}) {
  return (
    <div
      data-slot="conflict-radar"
      className={cn(
        "flex flex-col gap-3 rounded-xl border border-border bg-card p-4 text-sm text-card-foreground",
        className
      )}
      {...props}
    >
      <div
        data-slot="conflict-radar-header"
        className="flex items-center gap-2"
      >
        <GitMergeIcon className="size-4 text-muted-foreground" aria-hidden />
        <span className="font-medium">Conflitos</span>
        <Badge variant="outline" className="ml-auto shrink-0">
          {conflicts.length}
        </Badge>
      </div>

      {conflicts.length === 0 ? (
        <p
          data-slot="conflict-radar-empty"
          className="text-muted-foreground"
        >
          Sem conflitos.
        </p>
      ) : (
        <ul data-slot="conflict-radar-list" className="flex flex-col gap-3">
          {conflicts.map((conflict) => {
            const severity = conflict.severity ?? "low"
            return (
              <li
                key={conflict.id}
                data-slot="conflict-radar-item"
                data-severity={severity}
                className="flex gap-3"
              >
                <span
                  aria-hidden
                  className={cn(
                    "mt-1.5 size-2 shrink-0 rounded-full",
                    SEVERITY_DOT[severity]
                  )}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">{conflict.title}</span>
                    <Badge
                      variant="outline"
                      className={cn("shrink-0 gap-1", SEVERITY_BADGE[severity])}
                    >
                      {severity === "high" && (
                        <TriangleAlertIcon aria-hidden />
                      )}
                      {SEVERITY_LABEL[severity]}
                    </Badge>
                  </div>
                  {conflict.location != null && (
                    <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                      {conflict.location}
                    </p>
                  )}
                  {conflict.parties != null && conflict.parties.length > 0 && (
                    <div
                      data-slot="conflict-radar-parties"
                      className="mt-1.5 flex flex-wrap items-center gap-1"
                    >
                      {conflict.parties.map((party, index) => (
                        <React.Fragment key={`${conflict.id}-${index}`}>
                          {index > 0 && (
                            <span
                              aria-hidden
                              className="text-xs text-muted-foreground"
                            >
                              ×
                            </span>
                          )}
                          <span className="rounded-md bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
                            {party}
                          </span>
                        </React.Fragment>
                      ))}
                    </div>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export { ConflictRadar }
export type { Conflict, ConflictSeverity }
