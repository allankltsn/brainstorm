import { CalendarClock, CalendarDays, Home, Plus, Scissors, Users, type LucideIcon } from 'lucide-react'
import type { Role } from './data'

export type NavItem = { to: string; label: string; icon: LucideIcon }

/* Menu por tarefa, no máximo ~4 destinos por papel (padrão da família Aura). */
export const NAV: Record<Role, NavItem[]> = {
  dono: [
    { to: '/inicio', label: 'Início', icon: Home },
    { to: '/agenda', label: 'Agenda', icon: CalendarDays },
    { to: '/servicos', label: 'Serviços', icon: Scissors },
    { to: '/profissionais', label: 'Profissionais', icon: Users },
  ],
  barbeiro: [
    { to: '/inicio', label: 'Início', icon: Home },
    { to: '/agenda', label: 'Agenda', icon: CalendarDays },
  ],
  cliente: [
    { to: '/inicio', label: 'Início', icon: Home },
    { to: '/meus-horarios', label: 'Meus horários', icon: CalendarClock },
    { to: '/agendar', label: 'Agendar', icon: Plus },
  ],
}

export const ROLE_LABEL: Record<Role, string> = { dono: 'Dono', barbeiro: 'Barbeiro', cliente: 'Cliente' }
