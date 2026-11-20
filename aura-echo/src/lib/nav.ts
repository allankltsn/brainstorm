import { Home, Store, type LucideIcon } from 'lucide-react'

export type NavItem = { to: string; label: string; icon: LucideIcon }

/* Só destinos de tarefa no menu. Assinatura, Conta e Sair ficam no menu do usuário. */
export const NAV: NavItem[] = [
  { to: '/app/inicio', label: 'Início', icon: Home },
  { to: '/app/loja', label: 'Loja', icon: Store },
]

const TITLES: Record<string, string> = {
  '/app/inicio': 'Início',
  '/app/loja': 'Loja',
  '/app/assinatura': 'Minha assinatura',
  '/app/conta': 'Conta',
}

export function pageTitle(path: string): string {
  const key = Object.keys(TITLES)
    .filter((k) => path === k || path.startsWith(`${k}/`))
    .sort((a, b) => b.length - a.length)[0]
  return key ? TITLES[key] : 'Aura Echo'
}
