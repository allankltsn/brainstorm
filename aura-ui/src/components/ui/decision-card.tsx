"use client"

import * as React from "react"
import { CheckIcon, XIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export type DecisionOption = {
  id: string
  label: string
  pros?: string[]
  cons?: string[]
  recommended?: boolean
}

export type DecisionCardProps = Omit<
  React.ComponentProps<typeof Card>,
  "title"
> & {
  title: string
  question?: string
  options: DecisionOption[]
  onChoose?: (id: string) => void
}

function DecisionCard({
  title,
  question,
  options,
  onChoose,
  className,
  ...props
}: DecisionCardProps) {
  return (
    <Card data-slot="decision-card" className={className} {...props}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {question ? (
          <CardDescription dir="auto">{question}</CardDescription>
        ) : null}
      </CardHeader>
      <CardContent className="grid gap-3">
        {options.map((option) => (
          <div
            key={option.id}
            data-slot="decision-card-option"
            data-recommended={option.recommended || undefined}
            className={cn(
              "grid gap-2 rounded-lg border border-border p-3 transition-colors",
              option.recommended && "ring-2 ring-brand-text/40"
            )}
          >
            <div className="flex items-center justify-between gap-2">
              <span
                dir="auto"
                className="min-w-0 flex-1 truncate font-medium text-foreground"
              >
                {option.label}
              </span>
              {option.recommended ? (
                <Badge className="bg-brand-soft text-brand-text">
                  Recomendado
                </Badge>
              ) : null}
            </div>

            {option.pros?.length ? (
              <ul className="grid gap-1">
                {option.pros.map((pro, i) => (
                  <li
                    key={`pro-${i}`}
                    dir="auto"
                    className="flex items-start gap-1.5 text-sm text-muted-foreground"
                  >
                    <CheckIcon className="mt-0.5 size-3.5 shrink-0 text-success" />
                    <span className="min-w-0">{pro}</span>
                  </li>
                ))}
              </ul>
            ) : null}

            {option.cons?.length ? (
              <ul className="grid gap-1">
                {option.cons.map((con, i) => (
                  <li
                    key={`con-${i}`}
                    dir="auto"
                    className="flex items-start gap-1.5 text-sm text-muted-foreground"
                  >
                    <XIcon className="mt-0.5 size-3.5 shrink-0 text-destructive" />
                    <span className="min-w-0">{con}</span>
                  </li>
                ))}
              </ul>
            ) : null}

            <Button
              type="button"
              variant={option.recommended ? "default" : "outline"}
              size="sm"
              className="w-fit"
              onClick={() => onChoose?.(option.id)}
            >
              Escolher
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export { DecisionCard }
