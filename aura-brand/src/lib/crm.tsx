import { createContext, useContext, useState, type ReactNode } from 'react'

/*
 * Clientes e conversas: contatos com origem, funil, formulários de captação, automações,
 * propostas, caixa de entrada e campanhas. Tudo fictício e guardado no aparelho.
 * "Hoje" do protótipo é 11/11/2026.
 */

export const TODAY = '2026-11-11'
export const CONTACT_LIMIT = 500

export type Source = 'instagram' | 'site' | 'whatsapp' | 'indicacao' | 'planilha' | 'manual'
export type Stage = 'novo' | 'conversa' | 'proposta' | 'ganho' | 'perdido'
export type MsgChannel = 'whatsapp' | 'instagram' | 'email'

export type Contact = {
  id: string
  name: string
  email: string
  phone: string
  source: Source
  sourceDetail: string // de onde veio exatamente: nome do formulário, post, quem indicou
  stage: Stage
  value: number
  consent: boolean // LGPD: aceitou receber mensagens da marca
  createdAt: string
  note: string
}

export type FieldId = 'nome' | 'email' | 'telefone' | 'mensagem'
export type CaptureForm = {
  id: string
  kind: 'formulario' | 'pagina'
  name: string
  headline: string
  description: string
  fields: FieldId[]
  cta: string
  active: boolean
  views: number
  leads: number
}

export type Automation = { id: string; stage: Stage; name: string; channel: MsgChannel; text: string; active: boolean }
export type Proposal = { id: string; contactId: string; title: string; value: number; status: 'rascunho' | 'enviada' | 'aceita' | 'recusada'; date: string }
export type Message = { id: string; from: 'cliente' | 'marca'; text: string; at: string; auto?: boolean }
export type Thread = { id: string; contactId: string; channel: MsgChannel; unread: boolean; messages: Message[]; suggestion: string | null }
export type Audience = 'todos' | Stage
export type Campaign = {
  id: string
  name: string
  channel: 'email' | 'whatsapp'
  audience: Audience
  subject: string
  body: string
  status: 'rascunho' | 'agendada' | 'enviada'
  when: string
  sent: number
  opened: number
  clicked: number
  replied: number
}

export const SOURCES: Record<Source, string> = { instagram: 'Instagram', site: 'Formulário do site', whatsapp: 'WhatsApp', indicacao: 'Indicação', planilha: 'Planilha importada', manual: 'Adicionado à mão' }
export const STAGES: { id: Stage; label: string; hint: string }[] = [
  { id: 'novo', label: 'Novo', hint: 'Acabou de chegar' },
  { id: 'conversa', label: 'Em conversa', hint: 'Já houve contato' },
  { id: 'proposta', label: 'Proposta', hint: 'Recebeu uma proposta' },
  { id: 'ganho', label: 'Fechado', hint: 'Virou cliente' },
  { id: 'perdido', label: 'Perdido', hint: 'Não avançou' },
]
export const stageLabel = (s: Stage) => STAGES.find((x) => x.id === s)?.label ?? s
export const MSG_CHANNELS: Record<MsgChannel, string> = { whatsapp: 'WhatsApp', instagram: 'Instagram', email: 'E-mail' }
export const FIELDS: Record<FieldId, string> = { nome: 'Nome', email: 'E-mail', telefone: 'WhatsApp', mensagem: 'Mensagem' }
export const AUDIENCES: { value: Audience; label: string }[] = [{ value: 'todos', label: 'Todos os contatos' }, ...STAGES.map((s) => ({ value: s.id as Audience, label: `Etapa: ${s.label}` }))]

export const brl = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
export const dateLabel = (d: string) => {
  const [y, m, day] = d.slice(0, 10).split('-')
  return `${day}/${m}/${y}`
}
export const timeLabel = (at: string) => (at.startsWith(TODAY) ? at.slice(11, 16) : `${at.slice(8, 10)}/${at.slice(5, 7)} ${at.slice(11, 16)}`)
export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())

const c = (id: string, name: string, source: Source, sourceDetail: string, stage: Stage, value: number, createdAt: string, o: Partial<Contact> = {}): Contact => ({
  id,
  name,
  email: `${name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z]+/g, '.')}@exemplo.com.br`,
  phone: `(11) 9${id.replace(/\D/g, '').padStart(4, '0')}-00${id.replace(/\D/g, '').padStart(2, '0').slice(-2)}`,
  source,
  sourceDetail,
  stage,
  value,
  consent: true,
  createdAt,
  note: '',
  ...o,
})

const CONTACTS: Contact[] = [
  c('k01', 'Marcos Teixeira', 'whatsapp', 'Mensagem direta', 'novo', 129, '2026-11-11', { note: 'Perguntou sobre o kit presente.' }),
  c('k02', 'Lívia Andrade', 'site', 'Formulário: Oficina de café coado', 'novo', 180, '2026-11-11'),
  c('k03', 'Rafael Moura', 'instagram', 'Post: Novo horário de domingo', 'novo', 0, '2026-11-10', { consent: false }),
  c('k04', 'Beatriz Sampaio', 'instagram', 'Carrossel: 5 erros ao passar café coado', 'conversa', 240, '2026-11-09'),
  c('k05', 'Escritório Lume', 'site', 'Página: Café para empresas', 'conversa', 1800, '2026-11-08', { note: 'Quer assinatura mensal para 20 pessoas.' }),
  c('k06', 'Otávio Reis', 'indicacao', 'Indicado por Beatriz Sampaio', 'conversa', 320, '2026-11-07'),
  c('k07', 'Coworking Trama', 'site', 'Página: Café para empresas', 'proposta', 2400, '2026-11-05'),
  c('k08', 'Júlia Campos', 'whatsapp', 'Mensagem direta', 'proposta', 450, '2026-11-04'),
  c('k09', 'Estúdio Norte', 'indicacao', 'Indicado por Coworking Trama', 'ganho', 1500, '2026-10-28'),
  c('k10', 'Patrícia Melo', 'instagram', 'Post: Kit presente', 'ganho', 258, '2026-10-30'),
  c('k11', 'Daniel Costa', 'site', 'Formulário: Oficina de café coado', 'ganho', 180, '2026-11-02'),
  c('k12', 'Gustavo Leal', 'instagram', 'Anúncio: Blend de inverno', 'perdido', 0, '2026-10-25', { note: 'Achou o frete alto.' }),
]

const FORMS: CaptureForm[] = [
  { id: 'f1', kind: 'formulario', name: 'Oficina de café coado', headline: 'Garanta sua vaga na oficina de sábado', description: 'Duas horas de prática, com degustação no final. Deixe seu contato e a gente confirma a vaga.', fields: ['nome', 'telefone'], cta: 'Quero minha vaga', active: true, views: 412, leads: 38 },
  { id: 'f2', kind: 'pagina', name: 'Café para empresas', headline: 'Café especial toda semana no seu escritório', description: 'Assinatura mensal com entrega e moagem na medida. Conte quantas pessoas são e mandamos uma proposta.', fields: ['nome', 'email', 'telefone', 'mensagem'], cta: 'Pedir proposta', active: true, views: 286, leads: 14 },
  { id: 'f3', kind: 'formulario', name: 'Lista do blend de inverno', headline: 'Seja avisado quando o blend chegar', description: 'Avisamos por e-mail no dia do lançamento.', fields: ['nome', 'email'], cta: 'Avisar quando chegar', active: false, views: 150, leads: 22 },
]

const AUTOMATIONS: Automation[] = [
  { id: 'a1', stage: 'novo', name: 'Boas-vindas', channel: 'whatsapp', text: 'Oi! Aqui é do Ateliê Café. Recebemos seu contato e já vamos te responder. Enquanto isso, quer conhecer nossos cafés da semana?', active: true },
  { id: 'a2', stage: 'proposta', name: 'Lembrete da proposta', channel: 'email', text: 'Olá! Passando para saber se ficou alguma dúvida sobre a proposta que enviamos. Estamos por aqui.', active: false },
  { id: 'a3', stage: 'ganho', name: 'Agradecimento', channel: 'whatsapp', text: 'Obrigado por escolher o Ateliê Café! Qualquer coisa sobre o seu pedido, é só chamar aqui.', active: true },
]

const PROPOSALS: Proposal[] = [
  { id: 'p1', contactId: 'k07', title: 'Assinatura mensal, 30 pessoas', value: 2400, status: 'enviada', date: '2026-11-06' },
  { id: 'p2', contactId: 'k08', title: 'Kits presente de fim de ano (3 unidades)', value: 450, status: 'enviada', date: '2026-11-05' },
  { id: 'p3', contactId: 'k09', title: 'Assinatura mensal, 15 pessoas', value: 1500, status: 'aceita', date: '2026-10-29' },
]

const THREADS: Thread[] = [
  {
    id: 't1',
    contactId: 'k01',
    channel: 'whatsapp',
    unread: true,
    messages: [{ id: 'm1', from: 'cliente', text: 'Oi! Vocês têm aquele kit presente com a caneca? Entregam na Vila Mariana?', at: '2026-11-11T09:20' }],
    suggestion: 'Oi, Marcos! Temos sim o kit presente com dois cafés e a caneca. Sai por R$ 129 e entregamos em até 2 dias úteis na Vila Mariana. Quer que eu separe um para você?',
  },
  {
    id: 't2',
    contactId: 'k04',
    channel: 'instagram',
    unread: true,
    messages: [
      { id: 'm1', from: 'cliente', text: 'Amei o carrossel do coado! Qual moedor vocês indicam para começar?', at: '2026-11-10T19:05' },
      { id: 'm2', from: 'marca', text: 'Que bom que gostou, Beatriz! Para começar, um moedor manual de mós cônicas já resolve.', at: '2026-11-10T19:40' },
      { id: 'm3', from: 'cliente', text: 'Vocês vendem? E a oficina de sábado ainda tem vaga?', at: '2026-11-11T08:12' },
    ],
    suggestion: 'Vendemos sim, Beatriz: o moedor manual sai por R$ 240. E a oficina de sábado ainda tem 4 vagas. Quer que eu reserve uma para você?',
  },
  {
    id: 't3',
    contactId: 'k05',
    channel: 'email',
    unread: false,
    messages: [
      { id: 'm1', from: 'cliente', text: 'Somos 20 pessoas no escritório. Como funciona a assinatura mensal e qual o valor?', at: '2026-11-08T14:30' },
      { id: 'm2', from: 'marca', text: 'Olá! Para 20 pessoas indicamos 6 kg por mês, com entrega semanal. Posso enviar uma proposta com os valores?', at: '2026-11-08T16:02' },
    ],
    suggestion: null,
  },
  {
    id: 't4',
    contactId: 'k08',
    channel: 'whatsapp',
    unread: false,
    messages: [
      { id: 'm1', from: 'marca', text: 'Oi, Júlia! Enviei a proposta dos três kits por aqui. Qualquer dúvida, me chama.', at: '2026-11-05T11:15' },
      { id: 'm2', from: 'cliente', text: 'Recebi, obrigada! Vou confirmar com a equipe até sexta.', at: '2026-11-05T11:48' },
    ],
    suggestion: null,
  },
]

const CAMPAIGNS: Campaign[] = [
  { id: 'g1', name: 'Lançamento do blend de inverno', channel: 'email', audience: 'todos', subject: 'O blend de inverno chegou', body: 'Oi! Chegou o blend que torramos pensando nas manhãs frias: cacau, mel e um final de laranja.\n\nJá está no balcão e no site.', status: 'enviada', when: '2026-11-03T09:00', sent: 184, opened: 97, clicked: 31, replied: 6 },
  { id: 'g2', name: 'Últimas vagas da oficina', channel: 'whatsapp', audience: 'conversa', subject: '', body: 'Oi! Restam 4 vagas para a oficina de café coado deste sábado. Quer que eu reserve a sua?', status: 'agendada', when: '2026-11-12T10:00', sent: 0, opened: 0, clicked: 0, replied: 0 },
  { id: 'g3', name: 'Kits de fim de ano', channel: 'email', audience: 'ganho', subject: '', body: '', status: 'rascunho', when: '2026-11-20T09:00', sent: 0, opened: 0, clicked: 0, replied: 0 },
]

type State = { contacts: Contact[]; forms: CaptureForm[]; automations: Automation[]; proposals: Proposal[]; threads: Thread[]; campaigns: Campaign[] }
const SEED: State = { contacts: CONTACTS, forms: FORMS, automations: AUTOMATIONS, proposals: PROPOSALS, threads: THREADS, campaigns: CAMPAIGNS }

const KEY = 'aura-brand-crm'
function load(): State {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return { ...SEED, ...(JSON.parse(raw) as Partial<State>) }
  } catch {
    /* sem storage ou dado inválido: usa os exemplos */
  }
  return SEED
}

/* Quem pode receber uma campanha: está no público escolhido e deu consentimento (LGPD). */
export function audienceOf(contacts: Contact[], audience: Audience) {
  const inAudience = contacts.filter((x) => (audience === 'todos' ? x.stage !== 'perdido' : x.stage === audience))
  return { reach: inAudience.filter((x) => x.consent), blocked: inAudience.filter((x) => !x.consent).length }
}

/* Texto de exemplo para campanha. Em produção isto vira a chamada ao agente. */
export function suggestCampaign(name: string, channel: Campaign['channel'], brand: string) {
  const topic = name.trim() || 'nossa novidade'
  return {
    subject: channel === 'email' ? `${topic[0].toUpperCase()}${topic.slice(1)}` : '',
    body:
      channel === 'email'
        ? `Oi! Aqui é da ${brand}.\n\nQueremos te contar sobre ${topic.toLowerCase()}. Preparamos tudo com cuidado e achamos que você vai gostar.\n\nResponda este e-mail se quiser saber mais.`
        : `Oi! Aqui é da ${brand}. Passando para contar sobre ${topic.toLowerCase()}. Quer saber mais?`,
  }
}

type NewContact = Pick<Contact, 'name' | 'email' | 'phone' | 'source' | 'sourceDetail'> & Partial<Pick<Contact, 'consent' | 'value' | 'note'>>

type Ctx = State & {
  unread: number
  contact: (id: string) => Contact | undefined
  /* Devolve os nomes das automações que rodaram, para a tela avisar. */
  addContact: (data: NewContact) => { contact: Contact; ran: string[] }
  addContacts: (rows: NewContact[]) => number
  patchContact: (id: string, patch: Partial<Contact>) => void
  moveContact: (id: string, stage: Stage) => string[]
  removeContact: (id: string) => void
  saveForm: (form: CaptureForm) => void
  removeForm: (id: string) => void
  submitForm: (formId: string, data: { name: string; email: string; phone: string; note: string }) => { contact: Contact; ran: string[] }
  patchAutomation: (id: string, patch: Partial<Automation>) => void
  addProposal: (contactId: string, title: string, value: number) => void
  setProposal: (id: string, status: Proposal['status']) => string[]
  send: (threadId: string, text: string) => void
  markRead: (threadId: string) => void
  openThread: (contactId: string) => string
  saveCampaign: (campaign: Campaign) => void
  removeCampaign: (id: string) => void
  sendCampaign: (campaign: Campaign) => number
  restore: (state: State) => void
  snapshot: () => State
}
const CrmCtx = createContext<Ctx | null>(null)

let seq = 0
const uid = (p: string) => `${p}${Date.now().toString(36)}${++seq}`
const NOW_AT = `${TODAY}T10:00`

export function CrmProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(load)
  const commit = (next: State) => {
    setState(next)
    try {
      localStorage.setItem(KEY, JSON.stringify(next))
    } catch {
      /* ignora */
    }
    return next
  }

  /*
   * Automações da etapa: texto fixo escrito pelo dono, enviado quando o contato entra na etapa.
   * Só vale para quem deu consentimento. A mensagem entra na conversa do contato.
   */
  const runAutomations = (s: State, contact: Contact, stage: Stage): { state: State; ran: string[] } => {
    const rules = s.automations.filter((a) => a.active && a.stage === stage)
    if (!contact.consent || rules.length === 0) return { state: s, ran: [] }
    let threads = s.threads
    for (const rule of rules) {
      const msg: Message = { id: uid('m'), from: 'marca', text: rule.text, at: NOW_AT, auto: true }
      const existing = threads.find((t) => t.contactId === contact.id && t.channel === rule.channel)
      threads = existing
        ? threads.map((t) => (t.id === existing.id ? { ...t, messages: [...t.messages, msg] } : t))
        : [{ id: uid('t'), contactId: contact.id, channel: rule.channel, unread: false, messages: [msg], suggestion: null }, ...threads]
    }
    return { state: { ...s, threads }, ran: rules.map((r) => r.name) }
  }

  const insert = (s: State, data: NewContact): { state: State; contact: Contact; ran: string[] } => {
    const contact: Contact = { id: uid('k'), stage: 'novo', value: 0, consent: true, note: '', createdAt: TODAY, ...data }
    const r = runAutomations({ ...s, contacts: [contact, ...s.contacts] }, contact, 'novo')
    return { state: r.state, contact, ran: r.ran }
  }

  const move = (s: State, id: string, stage: Stage): { state: State; ran: string[] } => {
    const cur = s.contacts.find((x) => x.id === id)
    if (!cur || cur.stage === stage) return { state: s, ran: [] }
    const moved = { ...cur, stage }
    return runAutomations({ ...s, contacts: s.contacts.map((x) => (x.id === id ? moved : x)) }, moved, stage)
  }

  const value: Ctx = {
    ...state,
    unread: state.threads.filter((t) => t.unread).length,
    contact: (id) => state.contacts.find((x) => x.id === id),
    addContact: (data) => {
      const r = insert(state, data)
      commit(r.state)
      return { contact: r.contact, ran: r.ran }
    },
    addContacts: (rows) => {
      let s = state
      for (const row of rows) s = insert(s, row).state
      commit(s)
      return rows.length
    },
    patchContact: (id, patch) => commit({ ...state, contacts: state.contacts.map((x) => (x.id === id ? { ...x, ...patch } : x)) }),
    moveContact: (id, stage) => {
      const r = move(state, id, stage)
      commit(r.state)
      return r.ran
    },
    removeContact: (id) =>
      commit({ ...state, contacts: state.contacts.filter((x) => x.id !== id), threads: state.threads.filter((t) => t.contactId !== id), proposals: state.proposals.filter((p) => p.contactId !== id) }),
    saveForm: (form) => commit({ ...state, forms: state.forms.some((f) => f.id === form.id) ? state.forms.map((f) => (f.id === form.id ? form : f)) : [form, ...state.forms] }),
    removeForm: (id) => commit({ ...state, forms: state.forms.filter((f) => f.id !== id) }),
    submitForm: (formId, data) => {
      const form = state.forms.find((f) => f.id === formId)
      const label = form ? `${form.kind === 'pagina' ? 'Página' : 'Formulário'}: ${form.name}` : 'Formulário'
      const r = insert({ ...state, forms: state.forms.map((f) => (f.id === formId ? { ...f, views: f.views + 1, leads: f.leads + 1 } : f)) }, { name: data.name, email: data.email, phone: data.phone, note: data.note, source: 'site', sourceDetail: label })
      commit(r.state)
      return { contact: r.contact, ran: r.ran }
    },
    patchAutomation: (id, patch) => commit({ ...state, automations: state.automations.map((a) => (a.id === id ? { ...a, ...patch } : a)) }),
    addProposal: (contactId, title, v) => commit({ ...state, proposals: [{ id: uid('p'), contactId, title, value: v, status: 'rascunho', date: TODAY }, ...state.proposals] }),
    // Enviar a proposta leva o contato para "Proposta"; aceitar, para "Fechado".
    setProposal: (id, status) => {
      const p = state.proposals.find((x) => x.id === id)
      if (!p) return []
      const s: State = { ...state, proposals: state.proposals.map((x) => (x.id === id ? { ...x, status, date: TODAY } : x)), contacts: state.contacts.map((x) => (x.id === p.contactId && status !== 'recusada' ? { ...x, value: p.value } : x)) }
      const r = status === 'enviada' ? move(s, p.contactId, 'proposta') : status === 'aceita' ? move(s, p.contactId, 'ganho') : { state: s, ran: [] }
      commit(r.state)
      return r.ran
    },
    send: (threadId, text) => {
      const s: State = { ...state, threads: state.threads.map((t) => (t.id === threadId ? { ...t, unread: false, suggestion: null, messages: [...t.messages, { id: uid('m'), from: 'marca' as const, text, at: NOW_AT }] } : t)) }
      // responder um contato novo já conta como conversa iniciada
      const t = state.threads.find((x) => x.id === threadId)
      const who = t && state.contacts.find((x) => x.id === t.contactId)
      commit(who && who.stage === 'novo' ? move(s, who.id, 'conversa').state : s)
    },
    markRead: (threadId) => {
      if (state.threads.some((t) => t.id === threadId && t.unread)) commit({ ...state, threads: state.threads.map((t) => (t.id === threadId ? { ...t, unread: false } : t)) })
    },
    openThread: (contactId) => {
      const existing = state.threads.find((t) => t.contactId === contactId)
      if (existing) return existing.id
      const t: Thread = { id: uid('t'), contactId, channel: 'whatsapp', unread: false, messages: [], suggestion: null }
      commit({ ...state, threads: [t, ...state.threads] })
      return t.id
    },
    saveCampaign: (campaign) => commit({ ...state, campaigns: state.campaigns.some((g) => g.id === campaign.id) ? state.campaigns.map((g) => (g.id === campaign.id ? campaign : g)) : [campaign, ...state.campaigns] }),
    removeCampaign: (id) => commit({ ...state, campaigns: state.campaigns.filter((g) => g.id !== id) }),
    // salva e envia de uma vez; os números de abertura só chegam depois, então começam zerados
    sendCampaign: (campaign) => {
      const n = audienceOf(state.contacts, campaign.audience).reach.length
      const done: Campaign = { ...campaign, status: 'enviada', when: NOW_AT, sent: n, opened: 0, clicked: 0, replied: 0 }
      commit({ ...state, campaigns: state.campaigns.some((x) => x.id === done.id) ? state.campaigns.map((x) => (x.id === done.id ? done : x)) : [done, ...state.campaigns] })
      return n
    },
    restore: (s) => void commit(s),
    snapshot: () => state,
  }
  return <CrmCtx.Provider value={value}>{children}</CrmCtx.Provider>
}

export function useCrm() {
  const ctx = useContext(CrmCtx)
  if (!ctx) throw new Error('useCrm fora do CrmProvider')
  return ctx
}
