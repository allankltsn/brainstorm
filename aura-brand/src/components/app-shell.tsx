import { Bell, ChevronsUpDown, FileText, LogOut, Moon, Palette, Plus, Settings, Sparkles, Sun } from 'lucide-react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
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
import { useContent } from '@/lib/content'
import { useCrm } from '@/lib/crm'
import { initials, notifications, session } from '@/lib/data'
import { currentNav, NAV, pageTitle, type NavItem } from '@/lib/nav'
import { useTheme } from '@/lib/theme'
import { cn } from '@/lib/utils'

export function Brand({ className }: { className?: string }) {
  return (
    <span className={cn('text-lg font-semibold tracking-tight', className)}>
      aura<span className="text-primary">brand</span>
    </span>
  )
}

function BrandMark() {
  return (
    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
      <svg viewBox="0 0 24 24" className="size-4.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M7 4h6a4 4 0 0 1 0 8H7zM7 12h7a4 4 0 0 1 0 8H7z" />
      </svg>
    </span>
  )
}

/* Selos calculados: Conteúdo mostra o que espera aprovação; Mensagens, as conversas não lidas. */
function useBadge(item: NavItem) {
  const { items } = useContent()
  const { conversations } = useCrm()
  if (item.to === '/conteudo') return items.filter((i) => i.status === 'aprovacao').length
  if (item.to === '/mensagens') return conversations.filter((c) => c.unread).length
  return item.badge
}

function NavEntry({ item }: { item: NavItem }) {
  const { pathname } = useLocation()
  const { setOpenMobile } = useSidebar()
  const active = currentNav(pathname)?.to === item.to
  const badge = useBadge(item)
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={active} tooltip={item.label} className="h-10 gap-3 text-sm data-[active=true]:bg-background data-[active=true]:shadow-xs">
        <NavLink to={item.to} onClick={() => setOpenMobile(false)}>
          <item.icon className={cn(active && 'text-primary')} />
          <span>{item.label}</span>
        </NavLink>
      </SidebarMenuButton>
      {badge ? (
        <SidebarMenuBadge className="top-2.5 rounded-full bg-primary px-1.5 text-primary-foreground peer-data-[active=true]/menu-button:text-primary-foreground">
          {badge}
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
        <Button className="h-10 w-full justify-start gap-2 px-3 text-sm group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0" aria-label="Novo: criar">
          <Plus />
          <span className="group-data-[collapsible=icon]:hidden">Novo</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-60">
        <DropdownMenuLabel className="text-xs text-muted-foreground">O que você quer fazer?</DropdownMenuLabel>
        <DropdownMenuItem onSelect={go('/conteudo')}>
          <Sparkles /> Gerar post com IA
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={go('/marca')}>
          <Palette /> Editar brand kit
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={go('/leads')}>
          <FileText /> Criar formulário
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/* Tudo o que é da conta mora aqui: configurações e sair. */
function UserMenu() {
  const navigate = useNavigate()
  const me = session
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
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => toast.info('Protótipo: não há login ainda')}>
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

function BottomNavItem({ item: i, active }: { item: NavItem; active: boolean }) {
  const badge = useBadge(i)
  return (
    <li>
      <Link
        to={i.to}
        aria-current={active ? 'page' : undefined}
        className={cn('relative flex h-14 flex-col items-center justify-center gap-0.5 text-xs font-medium text-muted-foreground', active && 'text-primary')}
      >
        <span className="relative">
          <i.icon className="size-5" strokeWidth={active ? 2.4 : 2} />
          {badge ? <span className="absolute -top-1 -right-1.5 size-2 rounded-full bg-primary ring-2 ring-background" /> : null}
        </span>
        {i.label}
      </Link>
    </li>
  )
}

function BottomNav() {
  const { pathname } = useLocation()
  const items = NAV
  const current = currentNav(pathname)?.to
  return (
    <nav aria-label="Principal" className="fixed inset-x-0 bottom-0 z-30 border-t bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
      <ul className="grid" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}>
        {items.map((i) => (
          <BottomNavItem key={i.to} item={i} active={current === i.to} />
        ))}
      </ul>
    </nav>
  )
}

export function AppShell() {
  const { pathname } = useLocation()
  return (
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
            <NewButton />
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu className="gap-1">
                  {NAV.map((it) => (
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
            <span className="truncate text-sm font-medium">{pageTitle(pathname)}</span>
            <div className="ml-auto flex items-center gap-1">
              <ThemeToggle />
              <Notifications />
            </div>
          </header>
          <main id="conteudo" className="mx-auto w-full max-w-6xl flex-1 px-4 pt-6 pb-44 md:px-8 md:pt-8 md:pb-24">
            <Outlet />
          </main>
        </SidebarInset>
        <BottomNav />
    </SidebarProvider>
  )
}
