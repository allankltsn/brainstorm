"use client"

import * as React from "react"
import { CheckIcon, PlugIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

type Integration = {
  id: string
  name: string
  description?: string
  connected?: boolean
  icon?: React.ReactNode
}

function IntegrationPicker({
  integrations,
  onConnect,
  onDisconnect,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  integrations: Integration[]
  onConnect?: (id: string) => void
  onDisconnect?: (id: string) => void
}) {
  return (
    <div
      data-slot="integration-picker"
      className={cn(
        "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3",
        className
      )}
      {...props}
    >
      {integrations.map((integration) => (
        <div
          key={integration.id}
          data-slot="integration-picker-item"
          data-connected={integration.connected ? "" : undefined}
          className="flex flex-col gap-3 rounded-xl bg-card p-4 text-sm text-card-foreground ring-1 ring-foreground/10"
        >
          <div className="flex items-start gap-3">
            <span
              data-slot="integration-picker-icon"
              className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground [&_svg]:size-4 [&_svg]:shrink-0"
            >
              {integration.icon ?? <PlugIcon />}
            </span>
            <div className="flex min-w-0 flex-col gap-0.5">
              <span className="truncate font-medium">{integration.name}</span>
              {integration.description ? (
                <span className="text-xs text-muted-foreground">
                  {integration.description}
                </span>
              ) : null}
            </div>
          </div>
          <div className="mt-auto flex items-center justify-between gap-2">
            {integration.connected ? (
              <>
                <Badge variant="secondary">
                  <CheckIcon />
                  Conectado
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDisconnect?.(integration.id)}
                >
                  Desconectar
                </Button>
              </>
            ) : (
              <Button
                size="sm"
                className="w-full"
                onClick={() => onConnect?.(integration.id)}
              >
                Conectar
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export { IntegrationPicker, type Integration }
