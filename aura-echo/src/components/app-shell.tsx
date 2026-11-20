import { ChevronsUpDown, CreditCard, LogOut, UserRound, Users } from 'lucide-react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { AuraMark } from '@/components/brand'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
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
import { Separator } from '@/components/ui/separator'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar'
import { NAV, pageTitle } from '@/lib/nav'
import { PROFILES, type DemoProfileId } from '@/lib/profiles'
import { useEcho } from '@/lib/store'
import { cn } from '@/lib/utils'

function initials(nome: string) {
  return nome
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('')
}

function NavMenu() {
  const { pathname } = useLocation()
  const { setOpenMobile } = useSidebar()
  return (
    <SidebarMenu>
      {NAV.map((item) => {
        const active = pathname === item.to || pathname.startsWith(`${item.to}/`)
        return (
          <SidebarMenuItem key={item.to}>
            <SidebarMenuButton asChild isActive={active} tooltip={item.label} className="h-10 gap-3 text-[0.9375rem]">
              <NavLink to={item.to} onClick={() => setOpenMobile(false)}>
                <item.icon className={cn(active && 'text-primary')} />
                <span>{item.label}</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )
      })}
    </SidebarMenu>
  )
}

function UserMenu() {
  const { profile, profileId, setProfile } = useEcho()
  const navigate = useNavigate()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent" aria-label={`Conta de ${profile.nome}`}>
          <Avatar className="size-8 rounded-lg">
            <AvatarFallback className="rounded-lg bg-brand-soft text-xs font-semibold text-brand-text">{initials(profile.nome)}</AvatarFallback>
          </Avatar>
          <span className="grid flex-1 text-left leading-tight">
            <span className="truncate text-sm font-medium text-foreground">{profile.nome}</span>
            <span className="truncate text-xs text-muted-foreground">{profile.email}</span>
          </span>
          <ChevronsUpDown className="ml-auto size-4 text-muted-foreground" />
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" align="start" className="w-72">
        <DropdownMenuLabel className="font-normal">
          <div className="text-sm font-medium">{profile.nome}</div>
          <div className="text-xs text-muted-foreground">{profile.email}</div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onSelect={() => navigate('/app/assinatura')}>
            <CreditCard /> Minha assinatura
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => navigate('/app/conta')}>
            <UserRound /> Conta
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="flex items-center gap-2 text-xs text-muted-foreground">
          <Users className="size-3.5" /> Protótipo: ver como
        </DropdownMenuLabel>
        <DropdownMenuRadioGroup value={profileId} onValueChange={(v) => setProfile(v as DemoProfileId)}>
          {PROFILES.map((p) => (
            <DropdownMenuRadioItem key={p.id} value={p.id}>
              <span className="grid leading-tight">
                <span className="text-sm">{p.nome}</span>
                <span className="text-xs text-muted-foreground">{p.descricao}</span>
              </span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => navigate('/')}>
          <LogOut /> Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function AppShell() {
  const { pathname } = useLocation()
  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <div className="flex h-12 items-center gap-2.5 px-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
            <AuraMark />
            <span className="font-display text-lg font-semibold tracking-tight group-data-[collapsible=icon]:hidden">Aura Echo</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <NavMenu />
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
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-1 h-5" />
          <h1 className="text-base font-semibold">{pageTitle(pathname)}</h1>
        </header>
        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
