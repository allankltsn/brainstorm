"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

type AgentCrewStatus = "idle" | "running" | "done" | "error"

type AgentCrewMember = {
  id: string
  name: string
  role: "lead" | "worker" | "reviewer" | (string & {})
  status?: AgentCrewStatus
  task?: string
}

const statusDotStyles: Record<string, string> = {
  idle: "bg-muted-foreground/40",
  running: "bg-primary",
  done: "bg-primary",
  error: "bg-destructive",
}

const roleLabels: Record<string, string> = {
  lead: "Líder",
  worker: "Executor",
  reviewer: "Revisor",
}

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
}

function StatusDot({ status }: { status?: AgentCrewStatus }) {
  return (
    <span
      data-slot="agent-crew-status"
      data-status={status ?? "idle"}
      className={cn(
        "size-2 shrink-0 rounded-full",
        statusDotStyles[status ?? "idle"] ?? statusDotStyles.idle
      )}
      aria-hidden
    />
  )
}

function AgentCrewMemberRow({
  member,
  emphasized,
}: {
  member: AgentCrewMember
  emphasized?: boolean
}) {
  const label = roleLabels[member.role] ?? member.role
  return (
    <div
      data-slot="agent-crew-member"
      data-role={member.role}
      data-status={member.status ?? "idle"}
      className={cn(
        "flex items-center gap-3 rounded-lg p-3 ring-1 ring-foreground/10",
        emphasized ? "bg-primary/5 ring-primary/20" : "bg-card"
      )}
    >
      <Avatar>
        <AvatarFallback>{initials(member.name)}</AvatarFallback>
      </Avatar>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <div className="flex items-center gap-2">
          <span className="truncate font-medium">{member.name}</span>
          {emphasized ? (
            <Badge variant="default">{label}</Badge>
          ) : (
            <span className="text-xs text-muted-foreground">{label}</span>
          )}
        </div>
        {member.task != null && (
          <span className="truncate text-xs text-muted-foreground">
            {member.task}
          </span>
        )}
      </div>
      <StatusDot status={member.status} />
    </div>
  )
}

function AgentCrew({
  members,
  className,
  ...props
}: React.ComponentProps<"div"> & { members: AgentCrewMember[] }) {
  const leads = members.filter((member) => member.role === "lead")
  const rest = members.filter((member) => member.role !== "lead")

  return (
    <div
      data-slot="agent-crew"
      className={cn("flex flex-col gap-4", className)}
      {...props}
    >
      {leads.length > 0 && (
        <div className="flex flex-col gap-2">
          {leads.map((member) => (
            <AgentCrewMemberRow key={member.id} member={member} emphasized />
          ))}
        </div>
      )}
      {rest.length > 0 && (
        <div className="grid gap-2 sm:grid-cols-2">
          {rest.map((member) => (
            <AgentCrewMemberRow key={member.id} member={member} />
          ))}
        </div>
      )}
    </div>
  )
}

export { AgentCrew }
export type { AgentCrewMember, AgentCrewStatus }
