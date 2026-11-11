/* Dados fictícios do CRM, da caixa de entrada e das campanhas. Nada aqui vem de uma API real. */

export const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })

export type Stage = 'novo' | 'contato' | 'proposta' | 'ganho' | 'perdido'
export const STAGES: Stage[] = ['novo', 'contato', 'proposta', 'ganho', 'perdido']
export const STAGE_LABEL: Record<Stage, string> = { novo: 'Novo', contato: 'Em contato', proposta: 'Proposta enviada', ganho: 'Ganho', perdido: 'Perdido' }
/* Colunas do funil. "Perdido" fica fora das colunas e aparece só no resumo. */
export const FUNNEL: Stage[] = ['novo', 'contato', 'proposta', 'ganho']

export type Source = 'Formulário' | 'Instagram' | 'WhatsApp' | 'Indicação' | 'Planilha'
export const SOURCES: Source[] = ['Formulário', 'Instagram', 'WhatsApp', 'Indicação', 'Planilha']

export type Lead = {
  id: string
  name: string
  email: string
  source: Source
  stage: Stage
  /** Valor estimado do negócio, em reais */
  value: number
  /** LGPD: só leads com consentimento recebem campanhas */
  consent: boolean
}

export const leads: Lead[] = [
  { id: 'l1', name: 'Rafael Monteiro', email: 'rafael@exemplo.example', source: 'Formulário', stage: 'novo', value: 180, consent: true },
  { id: 'l2', name: 'Padaria Aurora', email: 'compras@aurora.example', source: 'Instagram', stage: 'novo', value: 1200, consent: true },
  { id: 'l3', name: 'Júlia Santana', email: 'julia@exemplo.example', source: 'WhatsApp', stage: 'contato', value: 240, consent: true },
  { id: 'l4', name: 'Coworking Trilha', email: 'adm@trilha.example', source: 'Indicação', stage: 'contato', value: 2400, consent: false },
  { id: 'l5', name: 'Bruno Albuquerque', email: 'bruno@exemplo.example', source: 'Formulário', stage: 'proposta', value: 360, consent: true },
  { id: 'l6', name: 'Empório Vila', email: 'contato@vila.example', source: 'Instagram', stage: 'proposta', value: 3100, consent: true },
  { id: 'l7', name: 'Camila Prado', email: 'camila@exemplo.example', source: 'Formulário', stage: 'ganho', value: 180, consent: true },
  { id: 'l8', name: 'Hotel Mirante', email: 'compras@mirante.example', source: 'Indicação', stage: 'perdido', value: 5200, consent: false },
]

export type LeadForm = { id: string; name: string; fields: string[]; leads: number; active: boolean }
export const forms: LeadForm[] = [
  { id: 'f1', name: 'Assinatura mensal', fields: ['Nome', 'E-mail', 'CEP'], leads: 42, active: true },
  { id: 'f2', name: 'Café para empresas', fields: ['Nome', 'E-mail', 'Empresa', 'Volume mensal'], leads: 9, active: true },
  { id: 'f3', name: 'Lista de espera: curso de barista', fields: ['Nome', 'E-mail'], leads: 17, active: false },
]

export const leadsByDay = [
  { dia: 'qui', leads: 2 },
  { dia: 'sex', leads: 4 },
  { dia: 'sáb', leads: 1 },
  { dia: 'dom', leads: 0 },
  { dia: 'seg', leads: 5 },
  { dia: 'ter', leads: 3 },
  { dia: 'qua', leads: 3 },
]

export type InboxChannel = 'WhatsApp' | 'Instagram' | 'E-mail'
export const INBOX_CHANNELS: InboxChannel[] = ['WhatsApp', 'Instagram', 'E-mail']
export type Message = { id: string; from: 'cliente' | 'marca'; text: string; time: string }
export type Conversation = { id: string; name: string; channel: InboxChannel; unread: boolean; messages: Message[] }

export const conversations: Conversation[] = [
  {
    id: 'c1',
    name: 'Júlia Santana',
    channel: 'WhatsApp',
    unread: true,
    messages: [
      { id: 'm1', from: 'cliente', text: 'Oi! Vocês entregam em Campinas?', time: '09:12' },
      { id: 'm2', from: 'marca', text: 'Oi, Júlia! Entregamos, sim. O frete é grátis na assinatura.', time: '09:20' },
      { id: 'm3', from: 'cliente', text: 'Que bom. Dá para trocar o tipo de café todo mês?', time: '09:31' },
    ],
  },
  {
    id: 'c2',
    name: 'Padaria Aurora',
    channel: 'Instagram',
    unread: true,
    messages: [{ id: 'm1', from: 'cliente', text: 'Vi o post do lote novo. Vocês vendem no atacado?', time: 'ontem' }],
  },
  {
    id: 'c3',
    name: 'Bruno Albuquerque',
    channel: 'E-mail',
    unread: false,
    messages: [
      { id: 'm1', from: 'cliente', text: 'Recebi a proposta. Consigo começar no mês que vem?', time: 'seg' },
      { id: 'm2', from: 'marca', text: 'Consegue, sim. Deixei a primeira entrega para o dia 5.', time: 'seg' },
    ],
  },
]

export type CampaignStatus = 'rascunho' | 'agendada' | 'enviada'
export const CAMPAIGN_LABEL: Record<CampaignStatus, string> = { rascunho: 'Rascunho', agendada: 'Agendada', enviada: 'Enviada' }
export type Campaign = { id: string; name: string; channel: 'E-mail' | 'WhatsApp'; segment: Stage | 'todos'; status: CampaignStatus; recipients: number; opened?: number }

export const campaigns: Campaign[] = [
  { id: 'k1', name: 'Lote novo da Mantiqueira', channel: 'E-mail', segment: 'todos', status: 'enviada', recipients: 68, opened: 31 },
  { id: 'k2', name: 'Lembrete de proposta', channel: 'WhatsApp', segment: 'proposta', status: 'agendada', recipients: 2 },
]

export type PlanId = 'essencial' | 'pro' | 'equipe'
export type Plan = { id: PlanId; name: string; price: number; credits: number; perks: string[] }
/* Preços e limites de exemplo, para o protótipo. */
export const plans: Plan[] = [
  { id: 'essencial', name: 'Essencial', price: 79, credits: 300, perks: ['1 marca', '1 usuário', 'Brand kit e posts'] },
  { id: 'pro', name: 'Pro', price: 199, credits: 1000, perks: ['1 marca', '3 usuários', 'CRM, caixa de entrada e campanhas'] },
  { id: 'equipe', name: 'Equipe', price: 449, credits: 3000, perks: ['3 marcas', '10 usuários', 'Relatórios e automações'] },
]
export const currentPlan: PlanId = 'pro'
