"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Badge, type badgeVariants } from "@/components/ui/badge"
import type { VariantProps } from "class-variance-authority"

type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>["variant"]>

export type ProjectStatus = "active" | "paused" | "done" | "archived"

export type ProjectMetric = {
  label: string
  value: string | number
}

export type ProjectCardProps = React.ComponentProps<"div"> & {
  /** Nome do projeto, exibido no cabeçalho. */
  name: string
  /** Descrição curta, em texto suave. */
  description?: string
  /** Situação do projeto, mostrada como Badge. */
  status?: ProjectStatus
  /** Progresso de 0 a 100; quando definido, exibe a barra. */
  progress?: number
  /** Nomes dos membros, convertidos em iniciais de avatar. */
  members?: string[]
  /** Métricas compactas (rótulo suave + valor). */
  metrics?: ProjectMetric[]
}

const STATUS_CONFIG: Record<
  ProjectStatus,
  { label: string; variant: BadgeVariant }
> = {
  active: { label: "Ativo", variant: "default" },
  paused: { label: "Pausado", variant: "secondary" },
  done: { label: "Concluído", variant: "outline" },
  archived: { label: "Arquivado", variant: "ghost" },
}

/** Máximo de avatares visíveis antes do contador de excedente. */
const MAX_AVATARS = 4

/** Extrai as iniciais (1-2 letras) de um nome para o avatar. */
function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "?"
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase()
  return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase()
}

/* Cartão de resumo de projeto: cabeçalho com nome e situação, descrição
   opcional, barra de progresso, linha de métricas e pilha de membros. */
function ProjectCard({
  name,
  description,
  status,
  progress,
  members,
  metrics,
  className,
  ...props
}: ProjectCardProps) {
  const statusConfig = status ? STATUS_CONFIG[status] : null
  const hasProgress = typeof progress === "number"
  const clampedProgress = hasProgress
    ? Math.max(0, Math.min(100, progress))
    : 0
  const visibleMembers = members?.slice(0, MAX_AVATARS) ?? []
  const overflowCount = Math.max(0, (members?.length ?? 0) - MAX_AVATARS)

  return (
    <Card
      data-slot="project-card"
      className={cn("gap-3", className)}
      {...props}
    >
      <div className="flex items-start justify-between gap-3 px-(--card-spacing)">
        <h3 className="min-w-0 truncate font-medium">{name}</h3>
        {statusConfig && (
          <Badge variant={statusConfig.variant} className="shrink-0">
            {statusConfig.label}
          </Badge>
        )}
      </div>

      {description && (
        <p className="px-(--card-spacing) text-sm text-muted-foreground">
          {description}
        </p>
      )}

      {hasProgress && (
        <div className="flex items-center gap-2 px-(--card-spacing)">
          <Progress value={clampedProgress} />
          <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
            {clampedProgress}%
          </span>
        </div>
      )}

      {metrics && metrics.length > 0 && (
        <dl className="flex flex-wrap gap-x-6 gap-y-1 px-(--card-spacing)">
          {metrics.map((metric, index) => (
            <div key={`${metric.label}-${index}`} className="flex flex-col">
              <dt className="text-xs text-muted-foreground">{metric.label}</dt>
              <dd className="text-sm font-medium tabular-nums">
                {metric.value}
              </dd>
            </div>
          ))}
        </dl>
      )}

      {visibleMembers.length > 0 && (
        <div className="flex -space-x-2 px-(--card-spacing)">
          {visibleMembers.map((member, index) => (
            <Avatar
              key={`${member}-${index}`}
              size="sm"
              className="ring-2 ring-background"
            >
              <AvatarFallback>{getInitials(member)}</AvatarFallback>
            </Avatar>
          ))}
          {overflowCount > 0 && (
            <Avatar size="sm" className="ring-2 ring-background">
              <AvatarFallback>+{overflowCount}</AvatarFallback>
            </Avatar>
          )}
        </div>
      )}
    </Card>
  )
}

export { ProjectCard }
