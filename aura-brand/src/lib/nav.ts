import { CalendarDays, Home, MessageSquare, Palette, Users, type LucideIcon } from 'lucide-react'

export type NavItem = { to: string; label: string; icon: LucideIcon; badge?: number }

/* No máximo 5 destinos, os mesmos no menu lateral e na barra do celular. */
export const NAV: NavItem[] = [
  { to: '/inicio', label: 'Início', icon: Home },
  { to: '/marca', label: 'Marca', icon: Palette },
  { to: '/conteudo', label: 'Conteúdo', icon: CalendarDays, badge: 3 },
  { to: '/leads', label: 'Leads', icon: Users },
  { to: '/mensagens', label: 'Mensagens', icon: MessageSquare, badge: 2 },
]

export function currentNav(path: string) {
  return NAV.find((i) => path === i.to || path.startsWith(i.to + '/'))
}
export function pageTitle(path: string) {
  return currentNav(path)?.label ?? 'aura-brand'
}
