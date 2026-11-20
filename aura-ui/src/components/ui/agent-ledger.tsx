"use client"

import * as React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type AgentLedgerKind = "tool" | "model" | "cost" | "note"

type AgentLedgerEntry = {
  id: string
  at: string
  label: string
  kind?: AgentLedgerKind
  amount?: string
}

const kindLabels: Record<AgentLedgerKind, string> = {
  tool: "Ferramenta",
  model: "Modelo",
  cost: "Custo",
  note: "Nota",
}

const kindVariants: Record<
  AgentLedgerKind,
  React.ComponentProps<typeof Badge>["variant"]
> = {
  tool: "secondary",
  model: "default",
  cost: "outline",
  note: "ghost",
}

function KindBadge({ kind }: { kind?: AgentLedgerKind }) {
  if (!kind) {
    return <span className="text-muted-foreground">—</span>
  }
  return (
    <Badge variant={kindVariants[kind]} className="font-normal">
      {kindLabels[kind]}
    </Badge>
  )
}

function AgentLedger({
  entries,
  className,
  ...props
}: React.ComponentProps<"div"> & { entries: AgentLedgerEntry[] }) {
  return (
    <div
      data-slot="agent-ledger"
      className={cn(
        "w-full overflow-hidden rounded-lg border border-border",
        className
      )}
      {...props}
    >
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="text-muted-foreground">Quando</TableHead>
            <TableHead className="text-muted-foreground">Tipo</TableHead>
            <TableHead className="text-muted-foreground">Descrição</TableHead>
            <TableHead className="text-right text-muted-foreground">
              Valor
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry) => (
            <TableRow key={entry.id} data-slot="agent-ledger-row">
              <TableCell className="font-mono text-xs text-muted-foreground">
                {entry.at}
              </TableCell>
              <TableCell>
                <KindBadge kind={entry.kind} />
              </TableCell>
              <TableCell className="text-foreground">{entry.label}</TableCell>
              <TableCell className="text-right font-mono text-xs tabular-nums">
                {entry.amount ?? (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export { AgentLedger }
export type { AgentLedgerEntry }
