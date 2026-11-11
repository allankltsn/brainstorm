import { Bell, ChevronsUpDown, ClipboardList, CreditCard, Dumbbell, LogOut, Moon, Palette, Plus, Search, Settings, Sparkles, Sun, UserPlus } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { AssistantWidget } from '@/components/assistant'
import { CommandPalette } from '@/components/command-palette'
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
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { AssistantProvider } from '@/lib/assistant'
import { initials, notifications, sessions, type Role } from '@/lib/data'
import { currentNav, NAV, pageTitle, type NavItem } from '@/lib/nav'
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
  const active = currentNav(role, pathname)?.to === item.to
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={active} tooltip={item.label} className="h-10 gap-3 text-[0.9375rem] data-[active=true]:bg-background data-[active=true]:shadow-xs">
        <NavLink to={item.to} onClick={() => setOpenMobile(false)}>
          <item.icon className={cn(active && 'text-primary')} />
          <span>{item.label}</span>
        </NavLink>
      </SidebarMenuButton>
      {item.badge ? (
        <SidebarMenuBadge className="top-2.5 rounded-full bg-primary px-1.5 text-primary-foreground peer-data-[active=true]/menu-button:text-primary-foreground">
          {item.badge}
          <span className="sr-only"> novos</span>
        </SidebarMenuBadge>
      ) : null}
    </SidebarMenuItem>
  )
}

/* Um só lugar para tudo o que é "criar". */
function NewButton() {
  const navigate = useNavigate()
  const { setOpenMobile } = useSidebar()
  const go = (to: string) => () => {
    setOpenMobile(false)
    navigate(to)
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="h-10 w-full justify-start gap-2 px-3 text-[0.9375rem] group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0" aria-label="Novo: criar ou convidar">
          <Plus />
          <span className="group-data-[collapsible=icon]:hidden">Novo</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-60">
        <DropdownMenuLabel className="text-xs text-muted-foreground">O que você quer fazer?</DropdownMenuLabel>
        <DropdownMenuItem onSelect={go('/convidar-aluno')}>
          <UserPlus /> Convidar aluno
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={go('/treinos/novo')}>
          <Dumbbell /> Criar treino
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={go('/ia')}>
          <Sparkles /> Sugerir treino com IA
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={go('/acompanhamento/questionarios/enviar')}>
          <ClipboardList /> Enviar questionário
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const ROLE_LABEL: Record<Role, string> = { personal: 'Personal', aluno: 'Aluno', admin: 'Admin' }

/* Tudo o que é da conta mora aqui: configurações, assinatura, sair. */
function UserMenu() {
  const { role, setRole } = useRole()
  const navigate = useNavigate()
  const me = sessions[role]
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent" aria-label={`Conta de ${me.name}`}>
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
        <DropdownMenuGroup>
          <DropdownMenuItem onSelect={() => navigate('/configuracoes')}>
            <Settings /> Configurações
          </DropdownMenuItem>
          {role === 'personal' && (
            <DropdownMenuItem onSelect={() => navigate('/configuracoes?aba=assinatura')}>
              <CreditCard /> Minha assinatura
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-xs text-muted-foreground">Protótipo: ver como</DropdownMenuLabel>
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
        <DropdownMenuItem onSelect={() => navigate('/design-system')}>
          <Palette /> Kit de interface
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => navigate('/login')}>
          <LogOut /> Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function Tip({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}

function Notifications() {
  const navigate = useNavigate()
  const unread = notifications.filter((n) => n.unread).length
  return (
    <DropdownMenu>
      <Tip label="Avisos">
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative" aria-label={`Avisos, ${unread} não lido`}>
            <Bell />
            {unread > 0 && <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-primary ring-2 ring-background" />}
          </Button>
        </DropdownMenuTrigger>
      </Tip>
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
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => navigate('/avisos')} className="justify-center text-sm font-medium">
          Ver todos os avisos
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function ThemeToggle() {
  const { isDark, setTheme } = useTheme()
  const label = isDark ? 'Usar tema claro' : 'Usar tema escuro'
  return (
    <Tip label={label}>
      <Button variant="ghost" size="icon" onClick={() => setTheme(isDark ? 'light' : 'dark')} aria-label={label}>
        {isDark ? <Sun /> : <Moon />}
      </Button>
    </Tip>
  )
}

function BottomNav() {
  const { role } = useRole()
  const { pathname } = useLocation()
  const items = NAV[role]
  const current = currentNav(role, pathname)?.to
  return (
    <nav aria-label="Principal" className="fixed inset-x-0 bottom-0 z-30 border-t bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
      <ul className="grid" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}>
        {items.map((i) => {
          const active = current === i.to
          return (
            <li key={i.to}>
              <Link
                to={i.to}
                aria-current={active ? 'page' : undefined}
                className={cn('relative flex h-14 flex-col items-center justify-center gap-0.5 text-[11px] font-medium text-muted-foreground', active && 'text-primary')}
              >
                <span className="relative">
                  <i.icon className="size-5" strokeWidth={active ? 2.4 : 2} />
                  {i.badge ? <span className="absolute -top-1 -right-1.5 size-2 rounded-full bg-primary ring-2 ring-background" /> : null}
                </span>
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
  const [search, setSearch] = useState(false)
  return (
    <AssistantProvider>
      <SidebarProvider>
        <a href="#conteudo" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-background focus:px-3 focus:py-2 focus:shadow">
          Ir para o conteúdo
        </a>
        <Sidebar variant="inset" collapsible="icon">
          <SidebarHeader className="gap-3">
            <Link to="/inicio" className="flex h-9 items-center gap-2.5 px-1 group-data-[collapsible=icon]:px-0">
              <BrandMark />
              <Brand className="group-data-[collapsible=icon]:hidden" />
            </Link>
            {role === 'personal' && <NewButton />}
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu className="gap-1">
                  {NAV[role].map((it) => (
                    <NavEntry key={it.to} item={it} />
                  ))}
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
          <header className="sticky top-0 z-20 flex h-14 items-center gap-2 rounded-t-xl border-b bg-background/90 px-3 backdrop-blur md:px-5">
            <Tip label="Abrir ou recolher o menu">
              <SidebarTrigger aria-label="Abrir ou recolher o menu" />
            </Tip>
            <Separator orientation="vertical" className="mr-1 h-5! self-center!" />
            <span className="truncate text-sm font-medium">{pageTitle(role, pathname)}</span>
            <div className="ml-auto flex items-center gap-1">
              <button
                type="button"
                onClick={() => setSearch(true)}
                className="mr-1 hidden h-8 w-56 items-center gap-2 rounded-lg border bg-muted/50 px-2.5 text-sm text-muted-foreground outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring md:flex"
              >
                <Search className="size-4" />
                Buscar
                <kbd className="ml-auto rounded border bg-background px-1.5 text-[11px] font-medium">Ctrl K</kbd>
              </button>
              <Tip label="Buscar">
                <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSearch(true)} aria-label="Buscar">
                  <Search />
                </Button>
              </Tip>
              <ThemeToggle />
              <Notifications />
            </div>
          </header>
          <main id="conteudo" className="mx-auto w-full max-w-6xl flex-1 px-4 pt-6 pb-44 md:px-8 md:pt-8 md:pb-24">
            <Outlet />
          </main>
        </SidebarInset>
        <BottomNav />
        <CommandPalette open={search} onOpenChange={setSearch} />
        <AssistantWidget />
      </SidebarProvider>
    </AssistantProvider>
  )
}
