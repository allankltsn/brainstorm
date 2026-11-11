/* Dados 100% fictícios. "Hoje" é fixo: 11/11/2026. */

export const TODAY_LABEL = 'quarta-feira, 11 de novembro'

export const session = { name: 'Helena Duarte', email: 'helena@ateliecafe.exemplo.com.br', title: 'Dona · Ateliê Café' }

export const initials = (name: string) => {
  const p = name.trim().split(/\s+/)
  return (p[0][0] + (p.length > 1 ? p[p.length - 1][0] : '')).toUpperCase()
}
export const firstName = (name: string) => name.split(' ')[0]

export const notifications = [
  { id: 'n1', title: 'A Aura preparou 3 posts para a semana', when: 'há 15 min', unread: true },
  { id: 'n2', title: 'Novo lead pelo formulário do site', when: 'há 2 h', unread: true },
  { id: 'n3', title: 'Sua assinatura renova em 03/12', when: 'ontem', unread: false },
]

/* Fila "Precisa de você": a IA só sugere, nunca publica sem aprovação. */
export type Draft = {
  id: string
  kind: 'Post' | 'Carrossel' | 'Resposta' | 'E-mail'
  channel: string
  title: string
  text: string
  when: string
}
export const drafts: Draft[] = [
  {
    id: 'd1',
    kind: 'Post',
    channel: 'Instagram',
    title: 'Novo blend de inverno',
    text: 'Chegou o blend que a gente torrou pensando nas manhãs frias: notas de cacau, mel e um final de laranja. Disponível a partir de sexta, no balcão e no site.',
    when: 'Sugerido para sexta, 09:00',
  },
  {
    id: 'd2',
    kind: 'Carrossel',
    channel: 'Instagram',
    title: '5 erros ao passar café coado',
    text: 'Carrossel com 6 telas: água fervendo demais, moagem errada, filtro sem escaldar, proporção no olho e café velho. Fecha com convite para a oficina de sábado.',
    when: 'Sugerido para segunda, 18:30',
  },
  {
    id: 'd3',
    kind: 'Resposta',
    channel: 'WhatsApp',
    title: 'Resposta para Marcos Teixeira',
    text: 'Oi, Marcos! Temos sim o kit presente com dois cafés e a caneca. Sai por R$ 129 e entregamos em até 2 dias úteis na sua região. Quer que eu separe um para você?',
    when: 'Mensagem recebida há 40 min',
  },
]

export const leadsWeek = [
  { dia: 'Qui', leads: 4 },
  { dia: 'Sex', leads: 6 },
  { dia: 'Sáb', leads: 9 },
  { dia: 'Dom', leads: 5 },
  { dia: 'Seg', leads: 7 },
  { dia: 'Ter', leads: 8 },
  { dia: 'Qua', leads: 11 },
]

export const leadSources = [
  { source: 'Instagram', leads: 21 },
  { source: 'Formulário do site', leads: 14 },
  { source: 'WhatsApp', leads: 11 },
  { source: 'Indicação', leads: 4 },
]

export const AI_CREDITS = { used: 340, total: 1000 }
