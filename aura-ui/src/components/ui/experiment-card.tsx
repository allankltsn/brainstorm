"use client"

import * as React from "react"
import { Trophy } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export type ExperimentVariant = {
  id: string
  label: string
  value: string | number
  delta?: string
  winner?: boolean
}

export type ExperimentCardProps = React.ComponentProps<typeof Card> & {
  name: string
  variants: ExperimentVariant[]
  metric?: string
  confidence?: string
}

/* Resultado de um experimento A/B: variantes, valores, variação e vencedor. */
function ExperimentCard({
  name,
  variants,
  metric,
  confidence,
  className,
  ...props
}: ExperimentCardProps) {
  return (
    <Card
      data-slot="experiment-card"
      className={cn("gap-(--card-spacing)", className)}
      {...props}
    >
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        {confidence && (
          <CardAction>
            <Badge variant="secondary">{confidence} confiança</Badge>
          </CardAction>
        )}
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {metric && (
          <p className="text-xs text-muted-foreground">{metric}</p>
        )}
        <ul className="flex flex-col gap-2">
          {variants.map((variant) => (
            <li
              key={variant.id}
              data-slot="experiment-variant"
              data-winner={variant.winner ? "" : undefined}
              className={cn(
                "flex items-center justify-between gap-3 rounded-lg border border-transparent bg-muted/40 px-3 py-2",
                variant.winner && "border-success/40 ring-1 ring-success/30"
              )}
            >
              <div className="flex min-w-0 flex-col gap-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="truncate text-sm text-muted-foreground">
                    {variant.label}
                  </span>
                  {variant.winner && (
                    <Badge className="gap-1 bg-success-soft text-success">
                      <Trophy aria-hidden="true" />
                      Vencedor
                    </Badge>
                  )}
                </div>
                {variant.delta && (
                  <span
                    className={cn(
                      "text-xs font-medium tabular-nums",
                      deltaTone(variant.delta)
                    )}
                  >
                    {variant.delta}
                  </span>
                )}
              </div>
              <span className="text-lg font-medium tabular-nums">
                {variant.value}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

/* Cor da variação a partir do sinal: +/- → success/destructive, neutro caso contrário. */
function deltaTone(delta: string): string {
  const trimmed = delta.trim()
  if (trimmed.startsWith("+")) return "text-success"
  if (trimmed.startsWith("-")) return "text-destructive"
  return "text-muted-foreground"
}

export { ExperimentCard }
