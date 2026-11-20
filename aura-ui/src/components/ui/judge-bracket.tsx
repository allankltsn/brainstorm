"use client"

import * as React from "react"
import { CheckIcon, TrophyIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

type JudgeMatch = {
  id: string
  a: string
  b: string
  winner?: "a" | "b"
}

type JudgeRound = {
  id: string
  matches: JudgeMatch[]
}

function MatchRow({
  label,
  state,
}: {
  label: string
  state: "winner" | "loser" | "undecided"
}) {
  return (
    <div
      data-slot="judge-bracket-row"
      data-state={state}
      className={cn(
        "flex items-center gap-2 rounded-md px-2 py-1.5 text-xs",
        state === "winner" && "bg-primary/10 font-medium text-primary",
        state === "loser" && "text-muted-foreground line-through",
        state === "undecided" && "text-foreground"
      )}
    >
      {state === "winner" ? (
        <CheckIcon aria-hidden className="size-3 shrink-0" />
      ) : (
        <span aria-hidden className="size-3 shrink-0" />
      )}
      <span className="truncate">{label}</span>
    </div>
  )
}

function JudgeBracket({
  rounds,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  rounds: JudgeRound[]
}) {
  const champion = React.useMemo(() => {
    const lastRound = rounds[rounds.length - 1]
    if (!lastRound || lastRound.matches.length !== 1) return null
    const match = lastRound.matches[0]
    if (match.winner === "a") return match.a
    if (match.winner === "b") return match.b
    return null
  }, [rounds])

  return (
    <div
      data-slot="judge-bracket"
      className={cn("flex flex-col gap-4", className)}
      {...props}
    >
      <div className="flex gap-6 overflow-x-auto">
        {rounds.map((round, roundIndex) => (
          <div
            key={round.id}
            data-slot="judge-bracket-round"
            className="flex min-w-40 flex-col gap-3"
          >
            <span className="text-xs font-medium text-muted-foreground">
              Rodada {roundIndex + 1}
            </span>
            <div className="flex flex-1 flex-col justify-around gap-3">
              {round.matches.map((match) => (
                <div
                  key={match.id}
                  data-slot="judge-bracket-match"
                  className="flex flex-col gap-1 rounded-lg bg-card p-2 ring-1 ring-foreground/10"
                >
                  <MatchRow
                    label={match.a}
                    state={
                      match.winner == null
                        ? "undecided"
                        : match.winner === "a"
                          ? "winner"
                          : "loser"
                    }
                  />
                  <MatchRow
                    label={match.b}
                    state={
                      match.winner == null
                        ? "undecided"
                        : match.winner === "b"
                          ? "winner"
                          : "loser"
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {champion ? (
        <div
          data-slot="judge-bracket-champion"
          className="flex items-center gap-2"
        >
          <Badge variant="default">
            <TrophyIcon aria-hidden />
            Campeão
          </Badge>
          <span className="truncate text-sm font-medium text-foreground">
            {champion}
          </span>
        </div>
      ) : null}
    </div>
  )
}

export { JudgeBracket }
export type { JudgeRound, JudgeMatch }
