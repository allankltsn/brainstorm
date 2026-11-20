"use client"

import * as React from "react"
import {
  CheckCircle2Icon,
  MessageSquareIcon,
  PencilIcon,
  UserPlusIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

type CollaborationEventKind = "edit" | "comment" | "approve" | "join"

type CollaborationEvent = {
  id: string
  actor: string
  action: string
  target?: string
  at?: string
  kind?: CollaborationEventKind
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "?"
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

const kindIcon: Record<CollaborationEventKind, React.ReactNode> = {
  edit: <PencilIcon className="size-3" />,
  comment: <MessageSquareIcon className="size-3" />,
  approve: <CheckCircle2Icon className="size-3" />,
  join: <UserPlusIcon className="size-3" />,
}

function CollaborationStream({
  events,
  className,
  ...props
}: React.ComponentProps<"div"> & { events: CollaborationEvent[] }) {
  return (
    <div
      data-slot="collaboration-stream"
      className={cn("flex flex-col gap-1", className)}
      {...props}
    >
      {events.map((event) => (
        <div
          key={event.id}
          data-slot="collaboration-stream-item"
          data-kind={event.kind}
          className="flex items-center gap-3 rounded-md px-2 py-1.5 transition-colors hover:bg-muted/50"
        >
          <Avatar size="sm">
            <AvatarFallback>{getInitials(event.actor)}</AvatarFallback>
          </Avatar>
          <p className="min-w-0 flex-1 truncate text-sm leading-6 text-muted-foreground">
            {event.kind != null && (
              <span className="mr-1.5 inline-flex align-middle text-muted-foreground/70">
                {kindIcon[event.kind]}
              </span>
            )}
            <span className="font-medium text-foreground">{event.actor}</span>{" "}
            {event.action}
            {event.target != null && (
              <>
                {" "}
                <span className="font-mono text-xs text-muted-foreground/80">
                  {event.target}
                </span>
              </>
            )}
          </p>
          {event.at != null && (
            <time className="shrink-0 text-xs text-muted-foreground/70 tabular-nums">
              {event.at}
            </time>
          )}
        </div>
      ))}
    </div>
  )
}

export { CollaborationStream }
export type { CollaborationEvent }
