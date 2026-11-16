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

export const AI_CREDITS = {
  used: 340,
  total: 1000,
  byFeature: [
    { label: 'Rascunhos de conteúdo', used: 180 },
    { label: 'Respostas sugeridas', used: 80 },
    { label: 'Textos de campanha', used: 60 },
    { label: 'Brand kit', used: 20 },
  ],
}
