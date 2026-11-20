"use client"

import * as React from "react"
import { ArrowDownIcon, CheckIcon, MinusIcon, XIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

type FallbackChainStatus = "ok" | "failed" | "skipped" | "active"

type FallbackChainLink = {
  id: string
  label: string
  status: FallbackChainStatus
}

const statusBadge: Record<
  FallbackChainStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  ok: { label: "Atendeu", variant: "default" },
  failed: { label: "Falhou", variant: "destructive" },
  skipped: { label: "Pulado", variant: "outline" },
  active: { label: "Tentando", variant: "secondary" },
}

function StatusIcon({ status }: { status: FallbackChainStatus }) {
  if (status === "ok") {
    return (
      <span className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-primary">
        <CheckIcon className="size-4" />
      </span>
    )
  }
  if (status === "failed") {
    return (
      <span className="flex size-7 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <XIcon className="size-4" />
      </span>
    )
  }
  if (status === "active") {
    return (
      <span className="flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground">
        <span className="size-2 animate-pulse rounded-full bg-current" />
      </span>
    )
  }
  return (
    <span className="flex size-7 items-center justify-center rounded-full border border-border bg-background text-muted-foreground">
      <MinusIcon className="size-4" />
    </span>
  )
}

function FallbackChain({
  links,
  className,
  ...props
}: React.ComponentProps<"div"> & { links: FallbackChainLink[] }) {
  return (
    <div
      data-slot="fallback-chain"
      className={cn("flex w-full max-w-sm flex-col", className)}
      {...props}
    >
      {links.map((link, index) => {
        const isLast = index === links.length - 1
        const succeeded = link.status === "ok"
        const badge = statusBadge[link.status]
        return (
          <React.Fragment key={link.id}>
            <div
              data-slot="fallback-chain-link"
              data-status={link.status}
              className={cn(
                "flex items-center gap-3 rounded-xl border px-3 py-2.5 transition-colors",
                succeeded
                  ? "border-primary/30 bg-primary/5"
                  : "border-border bg-card",
                link.status === "skipped" && "opacity-60"
              )}
            >
              <StatusIcon status={link.status} />
              <span
                dir="auto"
                title={link.label}
                className={cn(
                  "min-w-0 flex-1 truncate text-sm font-medium",
                  succeeded ? "text-foreground" : undefined,
                  link.status === "skipped" && "text-muted-foreground"
                )}
              >
                {link.label}
              </span>
              <Badge variant={badge.variant}>{badge.label}</Badge>
            </div>
            {!isLast && (
              <span
                aria-hidden="true"
                className="flex h-5 items-center justify-center text-muted-foreground"
              >
                <ArrowDownIcon className="size-4" />
              </span>
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

export { FallbackChain }
export type { FallbackChainLink }
