"use client"

import * as React from "react"
import { LogOut } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

type ProfileMenuUser = {
  name: string
  email?: string
  avatarUrl?: string
  plan?: string
}

type ProfileMenuItem = {
  id: string
  label: string
  icon?: React.ReactNode
  onSelect?: () => void
}

type ProfileMenuProps = React.ComponentProps<typeof DropdownMenu> & {
  user: ProfileMenuUser
  items: ProfileMenuItem[]
  onSignOut?: () => void
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "?"
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function ProfileMenu({
  user,
  items,
  onSignOut,
  ...props
}: ProfileMenuProps) {
  const initials = getInitials(user.name)

  return (
    <DropdownMenu data-slot="profile-menu" {...props}>
      <DropdownMenuTrigger
        aria-label={user.name}
        className="rounded-full outline-hidden focus-visible:ring-[3px] focus-visible:ring-ring/50"
      >
        <Avatar>
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-56">
        <DropdownMenuLabel className="flex flex-col gap-1 py-2 text-foreground">
          <span className="flex items-center gap-2">
            <span className="truncate text-sm font-medium">{user.name}</span>
            {user.plan ? (
              <Badge variant="secondary" className="ml-auto">
                {user.plan}
              </Badge>
            ) : null}
          </span>
          {user.email ? (
            <span className="truncate text-xs font-normal text-muted-foreground">
              {user.email}
            </span>
          ) : null}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {items.map((item) => (
          <DropdownMenuItem key={item.id} onSelect={() => item.onSelect?.()}>
            {item.icon ? (
              <span className="flex shrink-0 items-center">{item.icon}</span>
            ) : null}
            <span className="truncate">{item.label}</span>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onSelect={() => onSignOut?.()}
        >
          <LogOut />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { ProfileMenu }
export type { ProfileMenuProps, ProfileMenuUser, ProfileMenuItem }
