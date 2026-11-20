"use client"

import * as React from "react"
import { AlertTriangle, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty-state"

export type Decision = {
  id: string
  title: string
  /** Short context under the title */
  detail?: string
  /** Main answer, shown as the primary button */
  primary: string
  /** Other answer, shown as the outline button */
  secondary: string
  /** Starts folded to one muted line – click to open */
  collapsed?: boolean
}

export type DecisionInboxProps = {
  decisions: Decision[]
  /** Called with the decision and the chosen answer */
  onDecide?: (decision: Decision, answer: "primary" | "secondary") => void
  className?: string
}

type State = { open: boolean; answered?: string; gone?: boolean }

function DecisionInbox({ decisions, onDecide, className }: DecisionInboxProps) {
  const [state, setState] = React.useState<Record<string, State>>(() =>
    Object.fromEntries(decisions.map((d) => [d.id, { open: !d.collapsed }]))
  )
  const patch = (id: string, next: Partial<State>) =>
    setState((s) => ({ ...s, [id]: { ...s[id], ...next } }))

  const open = decisions.filter((d) => !state[d.id]?.answered).length
  // 1284 → "1,284"
  const count = new Intl.NumberFormat("en").format(open)
  const cleared = decisions.every((d) => state[d.id]?.gone)

  const decide = (d: Decision, answer: "primary" | "secondary") => {
    patch(d.id, { answered: answer === "primary" ? d.primary : d.secondary })
    onDecide?.(d, answer)
    // Show the confirmation for a moment, then fold the row away and open the next folded one
    window.setTimeout(() => {
      setState((s) => {
        const next = { ...s, [d.id]: { ...s[d.id], gone: true } }
        const folded = decisions.find(
          (x) => x.id !== d.id && !next[x.id]?.open && !next[x.id]?.answered
        )
        if (folded) next[folded.id] = { ...next[folded.id], open: true }
        return next
      })
    }, 1100)
  }

  return (
    <div
      data-slot="decision-inbox"
      data-clear={cleared || undefined}
      className={cn("w-full max-w-[440px]", className)}
    >
      <header
        aria-live="polite"
        className={cn(
          "flex items-center gap-2 px-4 pt-2.5 pb-2 text-sm font-medium",
          open > 0 ? "text-foreground" : "text-muted-foreground"
        )}
      >
        {open > 0 ? (
          <>
            <AlertTriangle className="size-4 shrink-0 text-primary" />
            <span>
              <span className="font-semibold">{count}</span>{" "}
              {open === 1 ? "espera" : "esperam"} sua resposta
            </span>
          </>
        ) : (
          <>
            <CheckCircle2 className="size-4 shrink-0" />
            <span>Tudo decidido</span>
          </>
        )}
      </header>

      {cleared ? (
        <Empty data-slot="decision-inbox-empty">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <CheckCircle2 />
            </EmptyMedia>
            <EmptyTitle>Nada esperando por você</EmptyTitle>
            <EmptyDescription>
              Novas decisões aparecem aqui quando precisarem da sua resposta.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <Card className="gap-0 divide-y divide-border py-0">
          {decisions.map((d) => {
            const s = state[d.id] ?? { open: true }
            return (
              <div
                key={d.id}
                data-slot="decision-inbox-row"
                data-gone={s.gone || undefined}
                inert={s.gone}
                className={cn(
                  "grid grid-rows-[1fr] transition-all duration-300 ease-out",
                  s.gone && "grid-rows-[0fr] opacity-0"
                )}
              >
                <div className="min-h-0 overflow-hidden">
                  <div className="px-5 py-4">
                    {s.open ? (
                      <p
                        dir="auto"
                        className="text-sm leading-5 font-medium text-foreground [overflow-wrap:anywhere]"
                      >
                        {d.title}
                      </p>
                    ) : (
                      <button
                        type="button"
                        dir="auto"
                        title={d.title}
                        onClick={() => patch(d.id, { open: true })}
                        className="block w-full truncate text-left text-sm leading-5 font-medium text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {d.title}
                      </button>
                    )}
                    <div
                      className={cn(
                        "grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 ease-out",
                        s.open && "grid-rows-[1fr]"
                      )}
                    >
                      <div className="min-h-0 overflow-hidden">
                        {d.detail ? (
                          <p
                            dir="auto"
                            className="mt-1 text-[0.8rem] leading-5 whitespace-pre-line text-muted-foreground [overflow-wrap:anywhere]"
                          >
                            {d.detail}
                          </p>
                        ) : null}
                        <div className="mt-3 flex min-h-[1.875rem] flex-wrap items-center gap-2">
                          {s.answered ? (
                            <Badge variant="secondary" role="status">
                              <CheckCircle2 />
                              <span dir="auto">{s.answered}</span>
                            </Badge>
                          ) : (
                            <>
                              <Button
                                size="sm"
                                dir="auto"
                                onClick={() => decide(d, "primary")}
                              >
                                {d.primary}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                dir="auto"
                                onClick={() => decide(d, "secondary")}
                              >
                                {d.secondary}
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </Card>
      )}
    </div>
  )
}

export { DecisionInbox }
