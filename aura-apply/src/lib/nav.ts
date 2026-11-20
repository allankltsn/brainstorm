import { Briefcase, ClipboardCheck, type LucideIcon } from 'lucide-react'

export type NavItem = { to: string; label: string; icon: LucideIcon }

/* Dois destinos, só. Um fluxo, não um painel. */
export const NAV: NavItem[] = [
  { to: '/vagas', label: 'Vagas', icon: Briefcase },
  { to: '/candidaturas', label: 'Candidaturas', icon: ClipboardCheck },
]
