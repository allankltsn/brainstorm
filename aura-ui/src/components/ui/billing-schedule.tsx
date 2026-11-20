"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

type BillingScheduleStatus = "pending" | "paid" | "failed" | "upcoming"

type BillingScheduleItem = {
  id: string
  date: string
  label: string
  amount: string
  status?: BillingScheduleStatus
}

const statusLabels: Record<BillingScheduleStatus, string> = {
  pending: "Pendente",
  paid: "Pago",
  failed: "Falhou",
  upcoming: "Agendado",
}

const statusVariants: Record<
  BillingScheduleStatus,
  React.ComponentProps<typeof Badge>["variant"]
> = {
  paid: "default",
  pending: "secondary",
  upcoming: "secondary",
  failed: "destructive",
}

function StatusBadge({ status }: { status?: BillingScheduleStatus }) {
  if (!status) {
    return null
  }
  return (
    <Badge variant={statusVariants[status]} className="font-normal">
      {statusLabels[status]}
    </Badge>
  )
}

function BillingSchedule({
  items,
  className,
  ...props
}: React.ComponentProps<"div"> & { items: BillingScheduleItem[] }) {
  const nextCharge = items.find(
    (item) => item.status === "upcoming" || item.status === "pending"
  )

  return (
    <div
      data-slot="billing-schedule"
      className={cn("flex w-full flex-col gap-3", className)}
      {...props}
    >
      {nextCharge != null && (
        <div
          data-slot="billing-schedule-header"
          className="flex items-center justify-between rounded-lg border border-border bg-muted/50 px-3 py-2"
        >
          <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarIcon className="size-4" aria-hidden />
            Próxima cobrança
          </span>
          <span className="font-mono text-sm font-medium tabular-nums text-foreground">
            {nextCharge.amount}
          </span>
        </div>
      )}

      <ol className="flex flex-col divide-y divide-border">
        {items.map((item) => (
          <li
            key={item.id}
            data-slot="billing-schedule-item"
            data-status={item.status}
            className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
          >
            <time className="w-20 shrink-0 font-mono text-xs text-muted-foreground tabular-nums">
              {item.date}
            </time>

            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <p className="truncate text-sm leading-none font-medium text-foreground">
                {item.label}
              </p>
              <StatusBadge status={item.status} />
            </div>

            <span className="shrink-0 font-mono text-sm font-medium tabular-nums text-foreground">
              {item.amount}
            </span>
          </li>
        ))}
      </ol>
    </div>
  )
}

export { BillingSchedule }
export type { BillingScheduleItem }
