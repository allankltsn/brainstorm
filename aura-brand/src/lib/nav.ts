import { Home, Inbox, PenLine, SwatchBook, Users, type LucideIcon } from 'lucide-react'

export type NavItem = { to: string; label: string; icon: LucideIcon; badge?: number }

/*
 * Menu por tarefa, não por recurso. Regras:
 * - no máximo 5 destinos, os mesmos no menu lateral e na barra do celular;
 * - o que é "criar" fica no botão Novo; o que é da conta fica no menu do usuário;
 * - subdivisões (agenda, campanhas, formulários…) viram abas dentro da página.
 */
export const NAV: NavItem[] = [
  { to: '/inicio', label: 'Início', icon: Home },
  { to: '/marca', label: 'Marca', icon: SwatchBook },
  { to: '/conteudo', label: 'Conteúdo', icon: PenLine },
  { to: '/clientes', label: 'Clientes', icon: Users },
  { to: '/conversas', label: 'Conversas', icon: Inbox, badge: 1 },
]

const TITLES: Record<string, string> = {
  '/configuracoes': 'Configurações',
  '/design-system': 'Kit de interface',
}

export function currentNav(path: string) {
  return NAV.filter((i) => path === i.to || path.startsWith(i.to + '/')).sort((a, b) => b.to.length - a.to.length)[0]
}
export function pageTitle(path: string) {
  const extra = Object.keys(TITLES).find((k) => path === k || path.startsWith(k + '/'))
  return currentNav(path)?.label ?? (extra ? TITLES[extra] : 'aura-brand')
}
