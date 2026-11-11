import { Activity, Dumbbell, Home, LayoutGrid, MessageSquare, TrendingUp, Users, type LucideIcon } from 'lucide-react'
import type { Role } from './data'

export type NavItem = { to: string; label: string; icon: LucideIcon; badge?: number }

/*
 * Menu por tarefa, não por recurso. Regras:
 * - no máximo 5 destinos por perfil, os mesmos no menu lateral e na barra do celular;
 * - o que é "criar" fica no botão Novo; o que é da conta fica no menu do usuário;
 * - subdivisões (exercícios, alertas, questionários…) viram abas dentro da página.
 */
export const NAV: Record<Role, NavItem[]> = {
  personal: [
    { to: '/inicio', label: 'Início', icon: Home },
    { to: '/alunos', label: 'Alunos', icon: Users },
    { to: '/treinos', label: 'Treinos', icon: Dumbbell },
    { to: '/acompanhamento', label: 'Acompanhar', icon: Activity, badge: 2 },
    { to: '/mensagens', label: 'Mensagens', icon: MessageSquare, badge: 1 },
  ],
  aluno: [
    { to: '/inicio', label: 'Início', icon: Home },
    { to: '/treino', label: 'Meu treino', icon: Dumbbell },
    { to: '/evolucao', label: 'Evolução', icon: TrendingUp },
    { to: '/mensagens', label: 'Mensagens', icon: MessageSquare },
  ],
  admin: [
    { to: '/inicio', label: 'Início', icon: Home },
    { to: '/usuarios', label: 'Usuários', icon: Users },
    { to: '/planos', label: 'Planos e cupons', icon: LayoutGrid },
  ],
}

const TITLES: Record<string, string> = {
  '/configuracoes': 'Configurações',
  '/design-system': 'Kit de interface',
  '/ia': 'Sugerir treino',
  '/convidar-aluno': 'Convidar aluno',
  '/planos': 'Planos',
  '/assinatura': 'Assinatura',
  '/avisos': 'Avisos',
  '/check-in': 'Check-in',
  '/primeiros-passos': 'Primeiros passos',
  '/pagamentos': 'Pagamentos',
  '/cobrancas': 'Cobranças',
  '/suporte': 'Ajuda e suporte',
}

export function currentNav(role: Role, path: string) {
  return NAV[role].filter((i) => path === i.to || path.startsWith(i.to + '/')).sort((a, b) => b.to.length - a.to.length)[0]
}
export function pageTitle(role: Role, path: string) {
  const extra = Object.keys(TITLES).find((k) => path === k || path.startsWith(k + '/'))
  return currentNav(role, path)?.label ?? (extra ? TITLES[extra] : 'aura-fit')
}
