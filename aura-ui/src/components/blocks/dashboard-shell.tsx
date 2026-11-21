"use client"

import * as React from "react"
import {
  Bell,
  BarChart3,
  Bot,
  Home,
  Search,
  Settings,
  Sparkles,
  Users,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { IconButton } from "@/components/ui/icon-button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  ProfileMenu,
  type ProfileMenuItem,
  type ProfileMenuUser,
} from "@/components/ui/profile-menu"

type NavItem = {
  id: string
  label: string
  icon: React.ReactNode
}

const navItems: NavItem[] = [
  { id: "inicio", label: "Início", icon: <Home /> },
  { id: "agentes", label: "Agentes", icon: <Bot /> },
  { id: "metricas", label: "Métricas", icon: <BarChart3 /> },
  { id: "equipe", label: "Equipe", icon: <Users /> },
  { id: "config", label: "Configurações", icon: <Settings /> },
]

const demoUser: ProfileMenuUser = {
  name: "Ana Souza",
  email: "ana.souza@aura.app",
  plan: "Pro",
}

const demoMenuItems: ProfileMenuItem[] = [
  { id: "perfil", label: "Perfil" },
  { id: "config", label: "Configurações" },
]

type DashboardShellProps = React.ComponentProps<"div"> & {
  title?: string
}

function DashboardShell({
  title = "Visão geral",
  children,
  className,
  ...props
}: DashboardShellProps) {
  return (
    <div
      data-slot="dashboard-shell"
      className={cn("flex min-h-screen bg-background text-foreground", className)}
      {...props}
    >
      {/* LEFT: fixed nav aside (hidden on mobile) */}
      <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-card lg:flex">
        <div className="flex h-14 items-center gap-2 px-4">
          <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="size-4" />
          </span>
          <span className="font-heading text-sm font-semibold tracking-tight">
            aura-ui
          </span>
        </div>
        <Separator />
        <nav className="flex flex-1 flex-col gap-1 p-2">
          {navItems.map((item, index) => (
            <Button
              key={item.id}
              variant="ghost"
              className={cn(
                "w-full justify-start gap-2 font-normal text-muted-foreground",
                index === 0 &&
                  "bg-muted font-medium text-foreground dark:bg-muted/50"
              )}
              aria-current={index === 0 ? "page" : undefined}
            >
              {item.icon}
              <span>{item.label}</span>
            </Button>
          ))}
        </nav>
        <Separator />
        <div className="flex items-center justify-between gap-2 p-3">
          <span className="text-xs text-muted-foreground">Plano atual</span>
          <Badge variant="secondary">Pro</Badge>
        </div>
      </aside>

      {/* RIGHT: topbar + content */}
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-10 flex h-14 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur sm:px-6">
          <h1 className="font-heading text-lg font-semibold tracking-tight">
            {title}
          </h1>
          <div className="flex-1" />
          <div className="relative hidden sm:block">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar..."
              aria-label="Buscar"
              className="w-56 pl-8"
            />
          </div>
          <div className="relative">
            <IconButton
              label="Notificações"
              variant="ghost"
              size="icon"
              tooltip
            >
              <Bell />
            </IconButton>
            <span
              aria-hidden="true"
              className="absolute top-1 right-1 size-2 rounded-full bg-primary ring-2 ring-background"
            />
          </div>
          <ProfileMenu user={demoUser} items={demoMenuItems} />
        </header>

        <main className="flex-1 p-4 sm:p-6">
          {children ?? (
            <div className="flex min-h-64 items-center justify-center rounded-xl border border-dashed border-border text-sm text-muted-foreground">
              Conteúdo da página
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export { DashboardShell }
