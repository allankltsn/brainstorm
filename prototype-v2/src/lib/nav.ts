import {
  Bell,
  ClipboardList,
  CreditCard,
  Dumbbell,
  FileSpreadsheet,
  Home,
  LayoutGrid,
  ListChecks,
  MessageSquare,
  Palette,
  Settings,
  ShieldCheck,
  Sparkles,
  Ticket,
  TriangleAlert,
  User,
  Users,
  type LucideIcon,
} from 'lucide-react'
import type { Role } from './data'

export type NavItem = { to: string; label: string; icon: LucideIcon; badge?: number; mobile?: boolean }
export type NavGroup = { label?: string; items: NavItem[] }

/* Menu por perfil. Poucos grupos, nomes do dia a dia; "mobile" marca o que entra na barra inferior. */
export const NAV: Record<Role, NavGroup[]> = {
  personal: [
    {
      items: [
        { to: '/inicio', label: 'Início', icon: Home, mobile: true },
        { to: '/alunos', label: 'Alunos', icon: Users, mobile: true },
        { to: '/treinos', label: 'Treinos', icon: Dumbbell, mobile: true },
        { to: '/exercicios', label: 'Exercícios', icon: ClipboardList },
      ],
    },
    {
      label: 'Acompanhamento',
      items: [
        { to: '/alertas', label: 'Alertas', icon: TriangleAlert, badge: 2 },
        { to: '/execucoes', label: 'Treinos feitos', icon: ListChecks },
        { to: '/questionarios', label: 'Questionários', icon: ClipboardList },
        { to: '/mensagens', label: 'Mensagens', icon: MessageSquare },
      ],
    },
    {
      label: 'Inteligência artificial',
      items: [
        { to: '/ia', label: 'Sugerir treino', icon: Sparkles, mobile: true },
        { to: '/ia/importar', label: 'Importar planilha', icon: FileSpreadsheet },
        { to: '/ia/dados', label: 'Dados usados pela IA', icon: ShieldCheck },
      ],
    },
    {
      label: 'Conta',
      items: [
        { to: '/assinatura', label: 'Minha assinatura', icon: CreditCard },
        { to: '/configuracoes', label: 'Configurações', icon: Settings },
      ],
    },
  ],
  aluno: [
    {
      items: [
        { to: '/inicio', label: 'Início', icon: Home, mobile: true },
        { to: '/treino', label: 'Meu treino', icon: Dumbbell, mobile: true },
        { to: '/avisos', label: 'Avisos', icon: Bell, mobile: true },
        { to: '/configuracoes', label: 'Meu perfil', icon: User, mobile: true },
      ],
    },
  ],
  admin: [
    {
      items: [
        { to: '/inicio', label: 'Início', icon: Home, mobile: true },
        { to: '/usuarios', label: 'Usuários', icon: Users, mobile: true },
        { to: '/perfis', label: 'Perfis e permissões', icon: ShieldCheck },
      ],
    },
    {
      label: 'Comercial',
      items: [
        { to: '/planos', label: 'Planos', icon: LayoutGrid, mobile: true },
        { to: '/cupons', label: 'Cupons', icon: Ticket },
      ],
    },
    { label: 'Conta', items: [{ to: '/configuracoes', label: 'Configurações', icon: Settings, mobile: true }] },
  ],
}

export const DESIGN_ITEM: NavItem = { to: '/design-system', label: 'Kit de interface', icon: Palette }

export function findNav(role: Role, path: string) {
  const all = [...NAV[role].flatMap((g) => g.items), DESIGN_ITEM]
  return all
    .filter((i) => path === i.to || path.startsWith(i.to + '/'))
    .sort((a, b) => b.to.length - a.to.length)[0]
}
