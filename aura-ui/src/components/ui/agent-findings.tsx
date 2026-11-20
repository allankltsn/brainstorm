"use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type FindingSeverity = "info" | "low" | "medium" | "high" | "critical"

type AgentFinding = {
  id: string
  title: string
  severity: FindingSeverity
  location?: string
  detail?: string
}

const SEVERITY_ORDER: FindingSeverity[] = [
  "critical",
  "high",
  "medium",
  "low",
  "info",
]

const SEVERITY_LABEL: Record<FindingSeverity, string> = {
  critical: "Crítico",
  high: "Alto",
  medium: "Médio",
  low: "Baixo",
  info: "Info",
}

/* Classe do ponto/badge por severidade usando tokens semânticos. */
const SEVERITY_DOT: Record<FindingSeverity, string> = {
  critical: "bg-destructive",
  high: "bg-destructive",
  medium: "bg-warning",
  low: "bg-muted-foreground/40",
  info: "bg-muted-foreground/40",
}

const SEVERITY_BADGE: Record<FindingSeverity, string> = {
  critical: "bg-destructive/10 text-destructive",
  high: "bg-destructive/10 text-destructive",
  medium: "bg-warning/10 text-warning",
  low: "bg-muted text-muted-foreground",
  info: "bg-muted text-muted-foreground",
}

function AgentFindings({
  findings,
  showSummary = true,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  findings: AgentFinding[]
  showSummary?: boolean
}) {
  const counts = React.useMemo(() => {
    const acc: Record<FindingSeverity, number> = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
      info: 0,
    }
    for (const f of findings) acc[f.severity] += 1
    return acc
  }, [findings])

  return (
    <div
      data-slot="agent-findings"
      className={cn(
        "flex flex-col gap-3 rounded-xl border border-border bg-card p-4 text-sm text-card-foreground",
        className
      )}
      {...props}
    >
      {showSummary && findings.length > 0 && (
        <div
          data-slot="agent-findings-summary"
          className="flex flex-wrap items-center gap-1.5"
        >
          {SEVERITY_ORDER.filter((s) => counts[s] > 0).map((severity) => (
            <Badge
              key={severity}
              variant="outline"
              className={cn("gap-1.5", SEVERITY_BADGE[severity])}
            >
              <span
                aria-hidden
                className={cn("size-1.5 rounded-full", SEVERITY_DOT[severity])}
              />
              {SEVERITY_LABEL[severity]} · {counts[severity]}
            </Badge>
          ))}
        </div>
      )}

      <ul data-slot="agent-findings-list" className="flex flex-col gap-3">
        {findings.map((finding) => (
          <li
            key={finding.id}
            data-slot="agent-findings-item"
            data-severity={finding.severity}
            className="flex gap-3"
          >
            <span
              aria-hidden
              className={cn(
                "mt-1.5 size-2 shrink-0 rounded-full",
                SEVERITY_DOT[finding.severity]
              )}
            />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium">{finding.title}</span>
                <Badge
                  variant="outline"
                  className={cn("shrink-0", SEVERITY_BADGE[finding.severity])}
                >
                  {SEVERITY_LABEL[finding.severity]}
                </Badge>
              </div>
              {finding.location != null && (
                <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                  {finding.location}
                </p>
              )}
              {finding.detail != null && (
                <p className="mt-1 text-xs text-muted-foreground">
                  {finding.detail}
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export { AgentFindings }
export type { AgentFinding, FindingSeverity }
