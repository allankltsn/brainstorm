import { Bell, ChevronsUpDown, LogOut, Moon, Search, Sun, UserCog } from 'lucide-react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { initials, notifications, sessions, type Role } from '@/lib/data'
import { DESIGN_ITEM, findNav, NAV, type NavItem } from '@/lib/nav'
import { useRole } from '@/lib/role'
import { useTheme } from '@/lib/theme'
import { cn } from '@/lib/utils'

export function Brand({ className }: { className?: string }) {
  return (
    <span className={cn('text-lg font-semibold tracking-tight', className)}>
      aura<span className="text-primary">fit</span>
    </span>
  )
}

function BrandMark() {
  return (
    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
      <svg viewBox="0 0 24 24" className="size-4.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M5 19 12 5l7 14M8 14h8" />
      </svg>
    </span>
  )
}

function NavEntry({ item }: { item: NavItem }) {
  const { pathname } = useLocation()
  const { role } = useRole()
  const { setOpenMobile } = useSidebar()
  const active = findNav(role, pathname)?.to === item.to
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={active} tooltip={item.label} className="h-9">
        <NavLink to={item.to} onClick={() => setOpenMobile(false)}>
          <item.icon />
          <span>{item.label}</span>
        </NavLink>
      </SidebarMenuButton>
      {item.badge ? (
        <SidebarMenuBadge className="rounded-full bg-warning-soft px-1.5 text-warning">
          {item.badge}
          <span className="sr-only"> em aberto</span>
        </SidebarMenuBadge>
      ) : null}
    </SidebarMenuItem>
  )
}

const ROLE_LABEL: Record<Role, string> = { personal: 'Personal', aluno: 'Aluno', admin: 'Admin' }

function UserMenu() {
  const { role, setRole } = useRole()
  const navigate = useNavigate()
  const me = sessions[role]
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent">
          <Avatar className="size-8 rounded-lg">
            <AvatarFallback className="rounded-lg bg-brand-soft text-xs font-semibold text-brand-text">{initials(me.name)}</AvatarFallback>
          </Avatar>
          <span className="grid flex-1 text-left leading-tight">
            <span className="truncate text-sm font-medium text-foreground">{me.name}</span>
            <span className="truncate text-xs text-muted-foreground">{me.title}</span>
          </span>
          <ChevronsUpDown className="ml-auto size-4 text-muted-foreground" />
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" align="start" className="w-64">
        <DropdownMenuLabel className="font-normal">
          <div className="text-sm font-medium">{me.name}</div>
          <div className="text-xs text-muted-foreground">{me.email}</div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-xs text-muted-foreground">Ver o protótipo como</DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={role}
          onValueChange={(r) => {
            setRole(r as Role)
            navigate('/inicio')
          }}
        >
          {(Object.keys(ROLE_LABEL) as Role[]).map((r) => (
            <DropdownMenuRadioItem key={r} value={r}>
              {ROLE_LABEL[r]}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onSelect={() => navigate('/configuracoes')}>
            <UserCog /> Configurações
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => navigate('/login')}>
            <LogOut /> Sair
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function Notifications() {
  const unread = notifications.filter((n) => n.unread).length
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label={`Avisos, ${unread} não lido`}>
          <Bell />
          {unread > 0 && <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-primary ring-2 ring-background" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Avisos</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.map((n) => (
          <DropdownMenuItem key={n.id} className="items-start gap-3 py-2.5">
            <span className={cn('mt-1.5 size-2 shrink-0 rounded-full', n.unread ? 'bg-primary' : 'bg-border')} />
            <span className="grid gap-0.5">
              <span className={cn('text-sm', n.unread && 'font-medium')}>{n.title}</span>
              <span className="text-xs text-muted-foreground">{n.when}</span>
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function ThemeToggle() {
  const { isDark, setTheme } = useTheme()
  return (
    <Button variant="ghost" size="icon" onClick={() => setTheme(isDark ? 'light' : 'dark')} aria-label={isDark ? 'Usar tema claro' : 'Usar tema escuro'}>
      {isDark ? <Sun /> : <Moon />}
    </Button>
  )
}

const SEARCH: Record<Role, string> = {
  personal: 'Buscar alunos ou treinos',
  aluno: 'Buscar treino',
  admin: 'Buscar usuários, planos ou cupons',
}

function BottomNav() {
  const { role } = useRole()
  const { pathname } = useLocation()
  const items = NAV[role].flatMap((g) => g.items).filter((i) => i.mobile).slice(0, 4)
  const current = findNav(role, pathname)?.to
  return (
    <nav aria-label="Principal" className="fixed inset-x-0 bottom-0 z-30 border-t bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
      <ul className="grid grid-cols-4">
        {items.map((i) => {
          const active = current === i.to
          return (
            <li key={i.to}>
              <Link
                to={i.to}
                aria-current={active ? 'page' : undefined}
                className={cn('flex h-14 flex-col items-center justify-center gap-0.5 text-[11px] font-medium text-muted-foreground', active && 'text-primary')}
              >
                <i.icon className="size-5" strokeWidth={active ? 2.4 : 2} />
                {i.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export function AppShell() {
  const { role } = useRole()
  const { pathname } = useLocation()
  const current = findNav(role, pathname)
  return (
    <SidebarProvider>
      <a href="#conteudo" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-background focus:px-3 focus:py-2 focus:shadow">
        Ir para o conteúdo
      </a>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <Link to="/inicio" className="flex h-10 items-center gap-2.5 px-1 group-data-[collapsible=icon]:px-0">
            <BrandMark />
            <Brand className="group-data-[collapsible=icon]:hidden" />
          </Link>
        </SidebarHeader>
        <SidebarContent>
          {NAV[role].map((g, i) => (
            <SidebarGroup key={i}>
              {g.label && <SidebarGroupLabel>{g.label}</SidebarGroupLabel>}
              <SidebarGroupContent>
                <SidebarMenu>
                  {g.items.map((it) => (
                    <NavEntry key={it.to} item={it} />
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
          <SidebarGroup className="mt-auto">
            <SidebarGroupLabel>Protótipo</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <NavEntry item={DESIGN_ITEM} />
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <UserMenu />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset className="min-w-0">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-2 border-b bg-background/85 px-3 backdrop-blur md:px-5">
          <SidebarTrigger aria-label="Abrir ou fechar o menu" />
          <Separator orientation="vertical" className="mr-1 h-5! self-center!" />
          <span className="truncate text-sm font-medium">{current?.label ?? 'aura-fit'}</span>
          <div className="ml-auto flex items-center gap-1">
            <label className="relative mr-1 hidden lg:block">
              <span className="sr-only">{SEARCH[role]}</span>
              <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                placeholder={SEARCH[role]}
                className="h-8 w-64 rounded-lg border bg-card pr-3 pl-8 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/20"
              />
            </label>
            <ThemeToggle />
            <Notifications />
          </div>
        </header>
        <main id="conteudo" className="mx-auto w-full max-w-6xl flex-1 px-4 pt-6 pb-24 md:px-8 md:pt-8 md:pb-12">
          <Outlet />
        </main>
      </SidebarInset>
      <BottomNav />
    </SidebarProvider>
  )
}
