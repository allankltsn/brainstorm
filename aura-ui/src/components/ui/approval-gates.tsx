"use client"

import * as React from "react"
import { CheckIcon, XIcon, ClockIcon, LockIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export type ApprovalGateStatus = "pending" | "approved" | "rejected" | "blocked"

export type ApprovalGate = {
  id: string
  label: string
  status: ApprovalGateStatus
  approver?: string
}

export type ApprovalGatesProps = React.ComponentProps<"div"> & {
  gates: ApprovalGate[]
  onApprove?: (id: string) => void
  onReject?: (id: string) => void
}

const STATUS = {
  approved: {
    icon: CheckIcon,
    marker: "border-transparent bg-success/15 text-success",
    badge: { variant: "secondary" as const, label: "Aprovado" },
  },
  rejected: {
    icon: XIcon,
    marker: "border-transparent bg-destructive/15 text-destructive",
    badge: { variant: "destructive" as const, label: "Recusado" },
  },
  pending: {
    icon: ClockIcon,
    marker: "border-border bg-background text-muted-foreground",
    badge: { variant: "outline" as const, label: "Pendente" },
  },
  blocked: {
    icon: LockIcon,
    marker: "border-border bg-muted text-muted-foreground/60",
    badge: { variant: "outline" as const, label: "Bloqueado" },
  },
} as const

function ApprovalGates({
  gates,
  onApprove,
  onReject,
  className,
  ...props
}: ApprovalGatesProps) {
  // Only the first pending gate can be acted on; later ones wait their turn.
  const activeId = gates.find((g) => g.status === "pending")?.id

  return (
    <div
      data-slot="approval-gates"
      className={cn("flex w-full max-w-sm flex-col", className)}
      {...props}
    >
      {gates.map((gate, i) => {
        const meta = STATUS[gate.status]
        const Icon = meta.icon
        const isActive = gate.status === "pending" && gate.id === activeId
        const last = i === gates.length - 1

        return (
          <div key={gate.id} data-slot="approval-gate" className="flex gap-3">
            {/* Status marker + connector */}
            <div className="flex flex-col items-center">
              <span
                data-slot="approval-gate-marker"
                data-status={gate.status}
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-full border [&_svg]:size-3.5",
                  meta.marker
                )}
              >
                <Icon aria-hidden="true" />
              </span>
              {!last ? (
                <span className="my-1 w-px flex-1 bg-border" aria-hidden="true" />
              ) : null}
            </div>

            {/* Gate body */}
            <div className={cn("flex-1 pb-5", last && "pb-0")}>
              <div className="flex items-center justify-between gap-2">
                <span
                  dir="auto"
                  className={cn(
                    "min-w-0 truncate text-sm font-medium",
                    gate.status === "blocked" && "text-muted-foreground"
                  )}
                >
                  {gate.label}
                </span>
                <Badge variant={meta.badge.variant}>{meta.badge.label}</Badge>
              </div>

              {gate.approver ? (
                <p className="mt-0.5 text-xs text-muted-foreground" dir="auto">
                  {gate.status === "rejected" ? "Recusado por" : "Aprovador"}:{" "}
                  {gate.approver}
                </p>
              ) : null}

              {gate.status === "pending" ? (
                isActive ? (
                  <div className="mt-2 flex gap-2">
                    <Button size="sm" onClick={() => onApprove?.(gate.id)}>
                      Aprovar
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => onReject?.(gate.id)}
                    >
                      Recusar
                    </Button>
                  </div>
                ) : (
                  <p className="mt-2 text-xs text-muted-foreground">
                    Aguardando a aprovação anterior
                  </p>
                )
              ) : null}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export { ApprovalGates }
