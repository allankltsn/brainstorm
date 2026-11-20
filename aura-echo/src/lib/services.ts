import { Briefcase, Dumbbell, Megaphone, Scissors, type LucideIcon } from 'lucide-react'

export type ServiceId = 'fit' | 'barber' | 'brand' | 'vagas'

export type Service = {
  id: ServiceId
  nome: string
  slug: string
  tagline: string
  descricao: string
  precoMensal: number
  url: string
  icon: LucideIcon
  destaques: string[]
}

/* Catálogo mockado do ecossistema. Cada serviço é uma vertical Aura. */
export const SERVICES: Service[] = [
  {
    id: 'fit',
    nome: 'Aura Fit',
    slug: 'fit',
    tagline: 'Treinos e alunos para personais e academias',
    descricao:
      'Monte treinos, acompanhe alunos, envie questionários e gerencie planos — tudo em um painel feito para o dia a dia do personal.',
    precoMensal: 79,
    url: 'https://fit.aura.app',
    icon: Dumbbell,
    destaques: ['Alunos ilimitados', 'Montagem de treinos com IA', 'App do aluno incluído'],
  },
  {
    id: 'barber',
    nome: 'Aura Barber',
    slug: 'barber',
    tagline: 'Agenda e caixa para barbearias',
    descricao:
      'Agendamento online, controle de comissões e lembretes automáticos para encher a cadeira e organizar a barbearia.',
    precoMensal: 69,
    url: 'https://barber.aura.app',
    icon: Scissors,
    destaques: ['Agenda online 24h', 'Comissão por profissional', 'Lembrete por WhatsApp'],
  },
  {
    id: 'brand',
    nome: 'Aura Brand',
    slug: 'brand',
    tagline: 'CRM e marketing em um só funil',
    descricao:
      'Centralize contatos, automatize campanhas e acompanhe cada oportunidade do primeiro toque ao fechamento.',
    precoMensal: 149,
    url: 'https://brand.aura.app',
    icon: Megaphone,
    destaques: ['Funil de vendas visual', 'Automação de campanhas', 'Relatórios de conversão'],
  },
  {
    id: 'vagas',
    nome: 'Aura Vagas',
    slug: 'vagas',
    tagline: 'Recrutamento e candidaturas sem planilha',
    descricao:
      'Publique vagas, organize candidatos por etapa e acompanhe o processo seletivo com a equipe no mesmo lugar.',
    precoMensal: 99,
    url: 'https://vagas.aura.app',
    icon: Briefcase,
    destaques: ['Vagas ilimitadas', 'Kanban de candidatos', 'Página de carreiras'],
  },
]

export const serviceById = (id: ServiceId): Service | undefined => SERVICES.find((s) => s.id === id)
export const serviceBySlug = (slug: string): Service | undefined => SERVICES.find((s) => s.slug === slug)

/* Classes de croma por serviço (tokens --svc-* definidos no index.css). */
export const SERVICE_TONE: Record<ServiceId, { text: string; bg: string; dot: string }> = {
  fit: { text: 'text-fit', bg: 'bg-fit-soft', dot: 'bg-fit' },
  barber: { text: 'text-barber', bg: 'bg-barber-soft', dot: 'bg-barber' },
  brand: { text: 'text-brand', bg: 'bg-brand-svc-soft', dot: 'bg-brand' },
  vagas: { text: 'text-vagas', bg: 'bg-vagas-soft', dot: 'bg-vagas' },
}
