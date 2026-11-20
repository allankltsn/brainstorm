import { createContext, useContext, useState, type ReactNode } from 'react'

/*
 * Clientes e atendimento. Modelo:
 *   Empresa ──< Pessoa ──< Conversa (uma por pessoa, juntando os canais)
 *                  └──< Negócio (anda no funil) ──< Proposta
 * Venda ao consumidor final usa só Pessoa. Tudo fictício e guardado no aparelho.
 * "Agora" do protótipo é 11/11/2026, 10h.
 */

export const TODAY = '2026-11-11'
export const NOW_AT = `${TODAY}T10:00`
export const CONTACT_LIMIT = 500
/* Conversa aberta com a última mensagem do cliente há mais tempo que isso conta como atrasada. */
export const LATE_AFTER_MIN = 30

export type Source = 'instagram' | 'site' | 'whatsapp' | 'indicacao' | 'planilha' | 'manual'
export type Stage = 'novo' | 'conversa' | 'proposta' | 'ganho' | 'perdido'
export type MsgChannel = 'whatsapp' | 'instagram' | 'facebook' | 'email' | 'site' | 'tiktok' | 'x'

export type Company = { id: string; name: string; segment: string; city: string; site: string }
export type Contact = {
  id: string
  name: string
  companyId: string | null
  role: string // cargo, quando é de uma empresa
  email: string
  phone: string
  city: string
  source: Source
  sourceDetail: string // de onde veio exatamente: nome do formulário, post, quem indicou
  consent: boolean // LGPD: aceitou receber mensagens da marca
  createdAt: string
  note: string
  tags: string[]
  data: Record<string, string> // dados personalizados, em chave e valor
}
export type Deal = { id: string; contactId: string; title: string; stage: Stage; value: number; createdAt: string }
export type Proposal = { id: string; dealId: string; title: string; value: number; status: 'rascunho' | 'enviada' | 'aceita' | 'recusada'; date: string }

export type Member = { id: string; name: string; team: string; online: boolean }
export type Queue = { id: string; name: string }
export type ThreadStatus = 'aberta' | 'aguardando' | 'resolvida'

/* A linha do tempo da conversa: mensagens de qualquer canal, notas internas, lembretes e eventos do cliente. */
export type TimelineItem =
  | { id: string; kind: 'msg'; from: 'cliente' | 'equipe'; author?: string; channel: MsgChannel; text: string; at: string; read?: boolean; auto?: boolean; attachment?: string; postRef?: string }
  | { id: string; kind: 'nota'; author: string; text: string; at: string }
  | { id: string; kind: 'lembrete'; author: string; text: string; due: string; at: string; done: boolean }
  | { id: string; kind: 'evento'; text: string; at: string }
export type Thread = {
  id: string
  contactId: string
  queue: string
  assignee: string | null
  status: ThreadStatus
  unread: boolean
  items: TimelineItem[]
  suggestion: string | null
}
export type QuickReply = { id: string; title: string; text: string }

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
export type Automation = { id: string; stage: Stage; name: string; channel: 'whatsapp' | 'email'; text: string; active: boolean }
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
export const MSG_CHANNELS: Record<MsgChannel, string> = { whatsapp: 'WhatsApp', instagram: 'Instagram', facebook: 'Facebook', email: 'E-mail', site: 'Chat do site', tiktok: 'TikTok', x: 'X' }
export const THREAD_STATUS: Record<ThreadStatus, string> = { aberta: 'Aberta', aguardando: 'Aguardando cliente', resolvida: 'Resolvida' }
export const FIELDS: Record<FieldId, string> = { nome: 'Nome', email: 'E-mail', telefone: 'WhatsApp', mensagem: 'Mensagem' }
export const AUDIENCES: { value: Audience; label: string }[] = [{ value: 'todos', label: 'Todos os contatos' }, ...STAGES.map((s) => ({ value: s.id as Audience, label: `Etapa: ${s.label}` }))]

/* Quem está usando o app. Usuários e permissões são planejados à parte; aqui só se assume que existem. */
export const ME = 'u1'
export const TEAM: Member[] = [
  { id: 'u1', name: 'Helena Duarte', team: 'Gestão', online: true },
  { id: 'u2', name: 'Lia Moraes', team: 'Vendas', online: true },
  { id: 'u3', name: 'Cadu Lima', team: 'Suporte', online: true },
  { id: 'u4', name: 'Rafa Souza', team: 'Pós-venda', online: false },
]
export const QUEUES: Queue[] = [
  { id: 'vendas', name: 'Vendas' },
  { id: 'suporte', name: 'Suporte' },
  { id: 'posvenda', name: 'Pós-venda' },
]
export const memberName = (id: string | null) => TEAM.find((m) => m.id === id)?.name ?? 'Sem responsável'
export const queueName = (id: string) => QUEUES.find((q) => q.id === id)?.name ?? id

export const brl = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
export const dateLabel = (d: string) => {
  const [y, m, day] = d.slice(0, 10).split('-')
  return `${day}/${m}/${y}`
}
export const timeLabel = (at: string) => (at.startsWith(TODAY) ? at.slice(11, 16) : `${at.slice(8, 10)}/${at.slice(5, 7)} ${at.slice(11, 16)}`)
export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())
const minutes = (at: string) => new Date(at).getTime() / 60000

/* Últimas mensagens e estados derivados da conversa. */
export const messagesOf = (t: Thread) => t.items.filter((i): i is Extract<TimelineItem, { kind: 'msg' }> => i.kind === 'msg')
export const lastMessage = (t: Thread) => messagesOf(t).at(-1)
export const lastActivity = (t: Thread) => t.items.at(-1)?.at ?? ''
/* O canal da resposta é o último que o cliente usou. */
export const replyChannel = (t: Thread): MsgChannel => messagesOf(t).filter((m) => m.from === 'cliente').at(-1)?.channel ?? lastMessage(t)?.channel ?? 'whatsapp'
export const isLate = (t: Thread) => {
  const m = lastMessage(t)
  return t.status === 'aberta' && !!m && m.from === 'cliente' && minutes(NOW_AT) - minutes(m.at) > LATE_AFTER_MIN
}
/* WhatsApp só aceita mensagem livre até 24 horas depois da última mensagem do cliente. Depois, só modelos aprovados. */
export const whatsappOpen = (t: Thread) => {
  const m = messagesOf(t).filter((x) => x.from === 'cliente' && x.channel === 'whatsapp').at(-1)
  return !!m && minutes(NOW_AT) - minutes(m.at) < 24 * 60
}
export const WHATSAPP_TEMPLATES: QuickReply[] = [
  { id: 'w1', title: 'Retomar conversa', text: 'Olá! Aqui é do Ateliê Café. Podemos continuar nossa conversa por aqui?' },
  { id: 'w2', title: 'Proposta enviada', text: 'Olá! Enviamos a sua proposta. Quer conversar sobre ela?' },
]

const slug = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z]+/g, '.')

const COMPANIES: Company[] = [
  { id: 'e1', name: 'Escritório Lume', segment: 'Arquitetura', city: 'São Paulo', site: 'lume.exemplo.com.br' },
  { id: 'e2', name: 'Coworking Trama', segment: 'Coworking', city: 'São Paulo', site: 'trama.exemplo.com.br' },
  { id: 'e3', name: 'Estúdio Norte', segment: 'Design', city: 'Campinas', site: 'norte.exemplo.com.br' },
]

type Seed = { id: string; name: string; source: Source; sourceDetail: string; stage: Stage; value: number; createdAt: string; dealTitle: string; o?: Partial<Contact> }
const seed = (...rows: Seed[]) => rows
const SEEDS = seed(
  { id: 'k01', name: 'Marcos Teixeira', source: 'whatsapp', sourceDetail: 'Mensagem direta', stage: 'novo', value: 129, createdAt: '2026-11-11', dealTitle: 'Kit presente', o: { note: 'Perguntou sobre o kit presente.', city: 'São Paulo' } },
  { id: 'k02', name: 'Lívia Andrade', source: 'site', sourceDetail: 'Formulário: Oficina de café coado', stage: 'novo', value: 180, createdAt: '2026-11-11', dealTitle: 'Vaga na oficina' },
  { id: 'k03', name: 'Rafael Moura', source: 'instagram', sourceDetail: 'Post: Novo horário de domingo', stage: 'novo', value: 0, createdAt: '2026-11-10', dealTitle: 'Primeira compra', o: { consent: false } },
  { id: 'k04', name: 'Beatriz Sampaio', source: 'instagram', sourceDetail: 'Carrossel: 5 erros ao passar café coado', stage: 'conversa', value: 240, createdAt: '2026-11-09', dealTitle: 'Moedor manual e oficina', o: { tags: ['oficina', 'equipamento'], city: 'São Paulo', data: { 'nível': 'iniciante', 'método preferido': 'coado' } } },
  { id: 'k05', name: 'Carla Nogueira', source: 'site', sourceDetail: 'Página: Café para empresas', stage: 'conversa', value: 1800, createdAt: '2026-11-08', dealTitle: 'Assinatura mensal, 20 pessoas', o: { companyId: 'e1', role: 'Gerente administrativa', note: 'Quer assinatura mensal para 20 pessoas.', tags: ['b2b', 'assinatura'], data: { pessoas: '20', 'entrega preferida': 'segunda de manhã' } } },
  { id: 'k06', name: 'Otávio Reis', source: 'indicacao', sourceDetail: 'Indicado por Beatriz Sampaio', stage: 'conversa', value: 320, createdAt: '2026-11-07', dealTitle: 'Café para evento' },
  { id: 'k07', name: 'Bruno Siqueira', source: 'site', sourceDetail: 'Página: Café para empresas', stage: 'proposta', value: 2400, createdAt: '2026-11-05', dealTitle: 'Assinatura mensal, 30 pessoas', o: { companyId: 'e2', role: 'Sócio', tags: ['b2b'] } },
  { id: 'k08', name: 'Júlia Campos', source: 'whatsapp', sourceDetail: 'Mensagem direta', stage: 'proposta', value: 450, createdAt: '2026-11-04', dealTitle: 'Kits de fim de ano (3)' },
  { id: 'k09', name: 'Paula Reis', source: 'indicacao', sourceDetail: 'Indicado por Coworking Trama', stage: 'ganho', value: 1500, createdAt: '2026-10-28', dealTitle: 'Assinatura mensal, 15 pessoas', o: { companyId: 'e3', role: 'Diretora de operações', tags: ['b2b', 'assinatura'] } },
  { id: 'k10', name: 'Patrícia Melo', source: 'instagram', sourceDetail: 'Post: Kit presente', stage: 'ganho', value: 258, createdAt: '2026-10-30', dealTitle: 'Dois kits presente' },
  { id: 'k11', name: 'Daniel Costa', source: 'site', sourceDetail: 'Formulário: Oficina de café coado', stage: 'ganho', value: 180, createdAt: '2026-11-02', dealTitle: 'Vaga na oficina' },
  { id: 'k12', name: 'Gustavo Leal', source: 'instagram', sourceDetail: 'Anúncio: Blend de inverno', stage: 'perdido', value: 0, createdAt: '2026-10-25', dealTitle: 'Blend de inverno', o: { note: 'Achou o frete alto.' } },
)

const CONTACTS: Contact[] = SEEDS.map((s) => {
  const n = s.id.replace(/\D/g, '')
  return {
    id: s.id,
    name: s.name,
    companyId: null,
    role: '',
    email: `${slug(s.name)}@exemplo.com.br`,
    phone: `(11) 9${n.padStart(4, '0')}-00${n.slice(-2)}`,
    city: 'São Paulo',
    source: s.source,
    sourceDetail: s.sourceDetail,
    consent: true,
    createdAt: s.createdAt,
    note: '',
    tags: [],
    data: {},
    ...s.o,
  }
})
const DEALS: Deal[] = SEEDS.map((s) => ({ id: `n${s.id.slice(1)}`, contactId: s.id, title: s.dealTitle, stage: s.stage, value: s.value, createdAt: s.createdAt }))

const PROPOSALS: Proposal[] = [
  { id: 'p1', dealId: 'n07', title: 'Assinatura mensal, 30 pessoas', value: 2400, status: 'enviada', date: '2026-11-06' },
  { id: 'p2', dealId: 'n08', title: 'Kits presente de fim de ano (3 unidades)', value: 450, status: 'enviada', date: '2026-11-05' },
  { id: 'p3', dealId: 'n09', title: 'Assinatura mensal, 15 pessoas', value: 1500, status: 'aceita', date: '2026-10-29' },
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

const QUICK_REPLIES: QuickReply[] = [
  { id: 'q1', title: 'Horário de funcionamento', text: 'Abrimos de segunda a sábado, das 7h às 19h, e aos domingos das 9h às 14h.' },
  { id: 'q2', title: 'Prazo de entrega', text: 'Entregamos em até 2 dias úteis na cidade de São Paulo. Para outras cidades, o prazo é de 3 a 5 dias úteis.' },
  { id: 'q3', title: 'Assinatura para empresas', text: 'A assinatura para empresas inclui entrega semanal, moagem na medida e troca de blend todo mês. Posso montar uma proposta para vocês?' },
  { id: 'q4', title: 'Oficina de sábado', text: 'A oficina de café coado acontece aos sábados, das 10h às 12h, com degustação no final. O valor é R$ 180.' },
]

let seq = 0
const uid = (p: string) => `${p}${Date.now().toString(36)}${++seq}`
const msg = (id: string, from: 'cliente' | 'equipe', channel: MsgChannel, text: string, at: string, o: Partial<Extract<TimelineItem, { kind: 'msg' }>> = {}): TimelineItem => ({ id, kind: 'msg', from, channel, text, at, ...o })

const THREADS: Thread[] = [
  {
    id: 't1',
    contactId: 'k01',
    queue: 'vendas',
    assignee: 'u2',
    status: 'aberta',
    unread: true,
    items: [msg('m1', 'cliente', 'whatsapp', 'Oi! Vocês têm aquele kit presente com a caneca? Entregam na Vila Mariana?', '2026-11-11T09:20')],
    suggestion: 'Oi, Marcos! Temos sim o kit presente com dois cafés e a caneca. Sai por R$ 129 e entregamos em até 2 dias úteis na Vila Mariana. Quer que eu separe um para você?',
  },
  {
    id: 't2',
    contactId: 'k04',
    queue: 'vendas',
    assignee: 'u2',
    status: 'aberta',
    unread: true,
    items: [
      msg('m1', 'cliente', 'instagram', 'Amei o carrossel do coado! Qual moedor vocês indicam para começar?', '2026-11-10T19:05', { postRef: 'Carrossel: 5 erros ao passar café coado' }),
      msg('m2', 'equipe', 'instagram', 'Que bom que gostou, Beatriz! Para começar, um moedor manual de mós cônicas já resolve.', '2026-11-10T19:40', { author: 'u2', read: true }),
      { id: 'e1', kind: 'evento', text: 'Negócio criado: Moedor manual e oficina', at: '2026-11-10T19:41' },
      { id: 'n1', kind: 'nota', author: 'u2', text: '@Cadu temos o moedor manual em estoque para entregar até sábado?', at: '2026-11-10T19:45' },
      msg('m3', 'cliente', 'whatsapp', 'Oi, é a Beatriz do Instagram! Vocês vendem o moedor? E a oficina de sábado ainda tem vaga?', '2026-11-11T08:12'),
    ],
    suggestion: 'Vendemos sim, Beatriz: o moedor manual sai por R$ 240. E a oficina de sábado ainda tem 4 vagas. Quer que eu reserve uma para você?',
  },
  {
    id: 't3',
    contactId: 'k05',
    queue: 'vendas',
    assignee: 'u1',
    status: 'aguardando',
    unread: false,
    items: [
      { id: 'e1', kind: 'evento', text: 'Preencheu a página "Café para empresas"', at: '2026-11-08T14:28' },
      msg('m1', 'cliente', 'site', 'Somos 20 pessoas no escritório. Como funciona a assinatura mensal e qual o valor?', '2026-11-08T14:30'),
      msg('m2', 'equipe', 'email', 'Olá, Carla! Para 20 pessoas indicamos 6 kg por mês, com entrega semanal. Posso enviar uma proposta com os valores?', '2026-11-08T16:02', { author: 'u1', read: true }),
      { id: 'r1', kind: 'lembrete', author: 'u1', text: 'Ligar para a Carla se ela não responder', due: '2026-11-11T15:00', at: '2026-11-08T16:03', done: false },
    ],
    suggestion: null,
  },
  {
    id: 't4',
    contactId: 'k08',
    queue: 'vendas',
    assignee: 'u2',
    status: 'aguardando',
    unread: false,
    items: [
      msg('m1', 'equipe', 'whatsapp', 'Oi, Júlia! Enviei a proposta dos três kits por aqui. Qualquer dúvida, me chama.', '2026-11-05T11:15', { author: 'u2', read: true, attachment: 'Proposta - Kits de fim de ano.pdf' }),
      msg('m2', 'cliente', 'whatsapp', 'Recebi, obrigada! Vou confirmar com a equipe até sexta.', '2026-11-05T11:48'),
    ],
    suggestion: null,
  },
  {
    id: 't5',
    contactId: 'k10',
    queue: 'suporte',
    assignee: null,
    status: 'aberta',
    unread: true,
    items: [
      msg('m1', 'equipe', 'whatsapp', 'Obrigado por escolher o Ateliê Café! Qualquer coisa sobre o seu pedido, é só chamar aqui.', '2026-10-30T17:00', { auto: true, read: true }),
      msg('m2', 'cliente', 'facebook', 'Olá, recebi um dos kits com a caneca trincada. Como faço a troca?', '2026-11-11T09:05'),
    ],
    suggestion: 'Oi, Patrícia! Sinto muito pela caneca. Trocamos sem custo: me manda uma foto por aqui e já agendamos a entrega da nova junto com a retirada da trincada.',
  },
  {
    id: 't6',
    contactId: 'k03',
    queue: 'vendas',
    assignee: null,
    status: 'aberta',
    unread: true,
    items: [msg('m1', 'cliente', 'tiktok', 'Domingo vocês abrem que horas?', '2026-11-11T09:48', { postRef: 'Vídeo: Novo horário de domingo' })],
    suggestion: 'Oi, Rafael! Aos domingos abrimos das 9h às 14h. Te esperamos!',
  },
  {
    id: 't7',
    contactId: 'k09',
    queue: 'posvenda',
    assignee: 'u4',
    status: 'resolvida',
    unread: false,
    items: [
      msg('m1', 'cliente', 'email', 'A entrega desta semana chegou certinho, obrigada!', '2026-11-04T10:12'),
      msg('m2', 'equipe', 'email', 'Que ótimo, Paula! Até a próxima segunda.', '2026-11-04T10:30', { author: 'u4', read: true }),
    ],
    suggestion: null,
  },
]

const CAMPAIGNS: Campaign[] = [
  { id: 'g1', name: 'Lançamento do blend de inverno', channel: 'email', audience: 'todos', subject: 'O blend de inverno chegou', body: 'Oi! Chegou o blend que torramos pensando nas manhãs frias: cacau, mel e um final de laranja.\n\nJá está no balcão e no site.', status: 'enviada', when: '2026-11-03T09:00', sent: 184, opened: 97, clicked: 31, replied: 6 },
  { id: 'g2', name: 'Últimas vagas da oficina', channel: 'whatsapp', audience: 'conversa', subject: '', body: 'Oi! Restam 4 vagas para a oficina de café coado deste sábado. Quer que eu reserve a sua?', status: 'agendada', when: '2026-11-12T10:00', sent: 0, opened: 0, clicked: 0, replied: 0 },
  { id: 'g3', name: 'Kits de fim de ano', channel: 'email', audience: 'ganho', subject: '', body: '', status: 'rascunho', when: '2026-11-20T09:00', sent: 0, opened: 0, clicked: 0, replied: 0 },
]

type State = {
  companies: Company[]
  contacts: Contact[]
  deals: Deal[]
  proposals: Proposal[]
  forms: CaptureForm[]
  automations: Automation[]
  threads: Thread[]
  quickReplies: QuickReply[]
  campaigns: Campaign[]
}
const SEED: State = { companies: COMPANIES, contacts: CONTACTS, deals: DEALS, proposals: PROPOSALS, forms: FORMS, automations: AUTOMATIONS, threads: THREADS, quickReplies: QUICK_REPLIES, campaigns: CAMPAIGNS }

const KEY = 'aura-brand-crm-2'
function load(): State {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return { ...SEED, ...(JSON.parse(raw) as Partial<State>) }
  } catch {
    /* sem storage ou dado inválido: usa os exemplos */
  }
  return SEED
}

/* Etapa do contato no funil: a do negócio aberto mais recente; sem negócio aberto, a do último. */
export function stageOf(deals: Deal[], contactId: string): Stage | null {
  const mine = deals.filter((d) => d.contactId === contactId)
  const open = mine.filter((d) => d.stage !== 'ganho' && d.stage !== 'perdido')
  return (open.at(-1) ?? mine.at(-1))?.stage ?? null
}

/* Quem pode receber uma campanha: está no público escolhido e deu consentimento (LGPD). */
export function audienceOf(contacts: Contact[], deals: Deal[], audience: Audience) {
  const inAudience = contacts.filter((c) => {
    const stages = deals.filter((d) => d.contactId === c.id).map((d) => d.stage)
    return audience === 'todos' ? !(stages.length > 0 && stages.every((s) => s === 'perdido')) : stages.includes(audience)
  })
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

/* Resumo de exemplo da conversa, para quem assume no meio. Em produção, gerado pela IA. */
export function summarize(t: Thread, contact: Contact | undefined, deal: Deal | undefined) {
  const msgs = messagesOf(t)
  const fromClient = msgs.filter((m) => m.from === 'cliente')
  const channels = [...new Set(msgs.map((m) => MSG_CHANNELS[m.channel]))]
  const first = fromClient[0]?.text
  const last = fromClient.at(-1)?.text
  const parts = [
    `${contact?.name ?? 'O cliente'} falou por ${channels.join(', ') || 'nenhum canal ainda'}.`,
    first ? `Começou com: "${first}"` : '',
    last && last !== first ? `Última mensagem: "${last}"` : '',
    deal ? `Negócio "${deal.title}" em ${stageLabel(deal.stage)}${deal.value ? `, ${brl(deal.value)}` : ''}.` : 'Ainda sem negócio aberto.',
    lastMessage(t)?.from === 'cliente' ? 'Falta responder.' : 'A última resposta foi da equipe.',
  ]
  return parts.filter(Boolean).join(' ')
}

/* Ações de exemplo da Aura sobre o texto da resposta. Em produção, chamadas ao agente com o tom de voz aprovado. */
export type AuraAction = 'expandir' | 'encurtar' | 'tom' | 'corrigir'
export function auraRewrite(text: string, action: AuraAction, opts: { near: boolean; brand: string }) {
  const t = text.trim()
  if (!t) return t
  if (action === 'encurtar') return t.split(/(?<=[.!?])\s+/).slice(0, 2).join(' ')
  if (action === 'expandir') return `${t}${/[.!?]$/.test(t) ? '' : '.'} Se preferir, posso te explicar com mais detalhes ou mandar fotos por aqui.`
  if (action === 'corrigir')
    return t
      .replace(/\s+/g, ' ')
      .replace(/\s([,.!?])/g, '$1')
      .replace(/(^|[.!?]\s+)([a-zà-ú])/g, (_, a: string, b: string) => a + b.toUpperCase())
      .replace(/([^.!?])$/, '$1.')
  // tom da marca: próximo ou formal, conforme o tom de voz aprovado
  return opts.near ? `Oi! ${t.replace(/^(olá|oi)[,!]?\s*/i, '')}` : `Olá. ${t.replace(/^(olá|oi)[,!]?\s*/i, '')} Atenciosamente, equipe ${opts.brand}.`
}

type NewContact = Pick<Contact, 'name' | 'email' | 'phone' | 'source' | 'sourceDetail'> & Partial<Pick<Contact, 'consent' | 'note' | 'role'>> & { companyName?: string; dealTitle?: string; value?: number }
type Event = { text: string }

type Ctx = State & {
  unread: number
  contact: (id: string) => Contact | undefined
  company: (id: string | null) => Company | undefined
  dealsOf: (contactId: string) => Deal[]
  threadOf: (contactId: string) => Thread | undefined
  /* Devolvem os nomes das automações que rodaram, para a tela avisar. */
  addContact: (data: NewContact) => { contact: Contact; ran: string[] }
  addContacts: (rows: NewContact[]) => number
  patchContact: (id: string, patch: Partial<Contact>) => void
  removeContact: (id: string) => void
  addDeal: (contactId: string, title: string, value: number) => void
  patchDeal: (id: string, patch: Partial<Omit<Deal, 'stage'>>) => void
  moveDeal: (id: string, stage: Stage) => string[]
  addProposal: (dealId: string, title: string, value: number) => void
  setProposal: (id: string, status: Proposal['status']) => string[]
  saveForm: (form: CaptureForm) => void
  removeForm: (id: string) => void
  submitForm: (formId: string, data: { name: string; email: string; phone: string; note: string }) => { contact: Contact; ran: string[] }
  patchAutomation: (id: string, patch: Partial<Automation>) => void
  send: (threadId: string, text: string, channel: MsgChannel, attachment?: string) => void
  addNote: (threadId: string, text: string) => void
  addReminder: (threadId: string, text: string, due: string) => void
  toggleReminder: (threadId: string, itemId: string) => void
  setStatus: (threadId: string, status: ThreadStatus) => void
  assign: (threadId: string, memberId: string | null) => void
  setQueue: (threadId: string, queue: string) => void
  markRead: (threadId: string, unread?: boolean) => void
  openThread: (contactId: string) => string
  saveCampaign: (campaign: Campaign) => void
  removeCampaign: (id: string) => void
  sendCampaign: (campaign: Campaign) => number
  restore: (state: State) => void
  snapshot: () => State
}
const CrmCtx = createContext<Ctx | null>(null)

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

  /* Acrescenta itens à conversa do contato, criando a conversa se ainda não existir. */
  const append = (s: State, contactId: string, items: TimelineItem[], patch: Partial<Thread> = {}): State => {
    const t = s.threads.find((x) => x.contactId === contactId)
    if (t) return { ...s, threads: s.threads.map((x) => (x.id === t.id ? { ...x, ...patch, items: [...x.items, ...items] } : x)) }
    const fresh: Thread = { id: uid('t'), contactId, queue: 'vendas', assignee: null, status: 'aberta', unread: false, items, suggestion: null, ...patch }
    return { ...s, threads: [fresh, ...s.threads] }
  }
  const event = (text: string): TimelineItem => ({ id: uid('e'), kind: 'evento', text, at: NOW_AT })

  /*
   * Automações da etapa: texto fixo escrito pelo dono, enviado quando o negócio entra na etapa.
   * Só vale para quem deu consentimento. A mensagem entra na conversa do contato, marcada como automação.
   */
  const runAutomations = (s: State, contact: Contact, stage: Stage): { state: State; ran: string[] } => {
    const rules = s.automations.filter((a) => a.active && a.stage === stage)
    if (!contact.consent || rules.length === 0) return { state: s, ran: [] }
    const items = rules.map((r) => msg(uid('m'), 'equipe', r.channel, r.text, NOW_AT, { auto: true }))
    return { state: append(s, contact.id, items), ran: rules.map((r) => r.name) }
  }

  const move = (s: State, dealId: string, stage: Stage): { state: State; ran: string[] } => {
    const d = s.deals.find((x) => x.id === dealId)
    const c = d && s.contacts.find((x) => x.id === d.contactId)
    if (!d || !c || d.stage === stage) return { state: s, ran: [] }
    let next: State = { ...s, deals: s.deals.map((x) => (x.id === dealId ? { ...x, stage } : x)) }
    if (next.threads.some((t) => t.contactId === c.id)) next = append(next, c.id, [event(`Negócio "${d.title}" foi para ${stageLabel(stage)}`)])
    return runAutomations(next, c, stage)
  }

  const insert = (s: State, data: NewContact, events: Event[] = [], first?: TimelineItem): { state: State; contact: Contact; ran: string[] } => {
    let companies = s.companies
    let companyId: string | null = null
    const cname = data.companyName?.trim()
    if (cname) {
      const found = companies.find((e) => e.name.toLowerCase() === cname.toLowerCase())
      companyId = found?.id ?? uid('e')
      if (!found) companies = [{ id: companyId, name: cname, segment: '', city: '', site: '' }, ...companies]
    }
    const contact: Contact = {
      id: uid('k'),
      companyId,
      role: data.role ?? '',
      name: data.name,
      email: data.email,
      phone: data.phone,
      city: '',
      source: data.source,
      sourceDetail: data.sourceDetail,
      consent: data.consent ?? true,
      createdAt: TODAY,
      note: data.note ?? '',
      tags: companyId ? ['b2b'] : [],
      data: {},
    }
    const deal: Deal = { id: uid('n'), contactId: contact.id, title: data.dealTitle || (cname ? `Negócio com ${cname}` : 'Primeira compra'), stage: 'novo', value: data.value ?? 0, createdAt: TODAY }
    let next: State = { ...s, companies, contacts: [contact, ...s.contacts], deals: [...s.deals, deal] }
    if (events.length || first) next = append(next, contact.id, [...events.map((e) => event(e.text)), ...(first ? [first] : [])], first ? { unread: true } : {})
    const r = runAutomations(next, contact, 'novo')
    return { state: r.state, contact, ran: r.ran }
  }

  const patchThread = (id: string, patch: Partial<Thread>) => commit({ ...state, threads: state.threads.map((t) => (t.id === id ? { ...t, ...patch } : t)) })

  const value: Ctx = {
    ...state,
    unread: state.threads.filter((t) => t.unread && t.status !== 'resolvida').length,
    contact: (id) => state.contacts.find((x) => x.id === id),
    company: (id) => (id ? state.companies.find((x) => x.id === id) : undefined),
    dealsOf: (contactId) => state.deals.filter((d) => d.contactId === contactId),
    threadOf: (contactId) => state.threads.find((t) => t.contactId === contactId),
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
    removeContact: (id) => {
      const dealIds = new Set(state.deals.filter((d) => d.contactId === id).map((d) => d.id))
      commit({ ...state, contacts: state.contacts.filter((x) => x.id !== id), deals: state.deals.filter((d) => !dealIds.has(d.id)), proposals: state.proposals.filter((p) => !dealIds.has(p.dealId)), threads: state.threads.filter((t) => t.contactId !== id) })
    },
    addDeal: (contactId, title, v) => {
      const d: Deal = { id: uid('n'), contactId, title, stage: 'novo', value: v, createdAt: TODAY }
      let next: State = { ...state, deals: [...state.deals, d] }
      if (next.threads.some((t) => t.contactId === contactId)) next = append(next, contactId, [event(`Negócio criado: ${title}`)])
      commit(next)
    },
    patchDeal: (id, patch) => commit({ ...state, deals: state.deals.map((d) => (d.id === id ? { ...d, ...patch } : d)) }),
    moveDeal: (id, stage) => {
      const r = move(state, id, stage)
      commit(r.state)
      return r.ran
    },
    addProposal: (dealId, title, v) => commit({ ...state, proposals: [{ id: uid('p'), dealId, title, value: v, status: 'rascunho', date: TODAY }, ...state.proposals] }),
    // Enviar a proposta leva o negócio para "Proposta"; aceitar, para "Fechado".
    setProposal: (id, status) => {
      const p = state.proposals.find((x) => x.id === id)
      const d = p && state.deals.find((x) => x.id === p.dealId)
      if (!p || !d) return []
      let s: State = { ...state, proposals: state.proposals.map((x) => (x.id === id ? { ...x, status, date: TODAY } : x)), deals: state.deals.map((x) => (x.id === d.id && status !== 'recusada' ? { ...x, value: p.value } : x)) }
      if (status === 'enviada' && s.threads.some((t) => t.contactId === d.contactId)) s = append(s, d.contactId, [event(`Proposta enviada: ${p.title}`)])
      const r = status === 'enviada' ? move(s, d.id, 'proposta') : status === 'aceita' ? move(s, d.id, 'ganho') : { state: s, ran: [] }
      commit(r.state)
      return r.ran
    },
    saveForm: (form) => commit({ ...state, forms: state.forms.some((f) => f.id === form.id) ? state.forms.map((f) => (f.id === form.id ? form : f)) : [form, ...state.forms] }),
    removeForm: (id) => commit({ ...state, forms: state.forms.filter((f) => f.id !== id) }),
    submitForm: (formId, data) => {
      const form = state.forms.find((f) => f.id === formId)
      const label = form ? `${form.kind === 'pagina' ? 'Página' : 'Formulário'}: ${form.name}` : 'Formulário'
      const counted: State = { ...state, forms: state.forms.map((f) => (f.id === formId ? { ...f, views: f.views + 1, leads: f.leads + 1 } : f)) }
      // o que a pessoa escreveu no formulário entra na conversa como a primeira mensagem, pelo canal do site
      const first = data.note ? msg(uid('m'), 'cliente', 'site', data.note, NOW_AT) : undefined
      const r = insert(counted, { name: data.name, email: data.email, phone: data.phone, note: data.note, source: 'site', sourceDetail: label }, [{ text: `Preencheu ${form?.kind === 'pagina' ? 'a página' : 'o formulário'} "${form?.name ?? ''}"` }], first)
      commit(r.state)
      return { contact: r.contact, ran: r.ran }
    },
    patchAutomation: (id, patch) => commit({ ...state, automations: state.automations.map((a) => (a.id === id ? { ...a, ...patch } : a)) }),
    send: (threadId, text, channel, attachment) => {
      const t = state.threads.find((x) => x.id === threadId)
      if (!t) return
      let s: State = {
        ...state,
        threads: state.threads.map((x) =>
          x.id === threadId ? { ...x, unread: false, suggestion: null, status: 'aguardando', assignee: x.assignee ?? ME, items: [...x.items, msg(uid('m'), 'equipe', channel, text, NOW_AT, { author: ME, attachment })] } : x,
        ),
      }
      // responder um contato novo já conta como conversa iniciada
      const open = s.deals.filter((d) => d.contactId === t.contactId && d.stage === 'novo').at(-1)
      if (open) s = move(s, open.id, 'conversa').state
      commit(s)
    },
    addNote: (threadId, text) => patchThread(threadId, { items: [...(state.threads.find((t) => t.id === threadId)?.items ?? []), { id: uid('n'), kind: 'nota', author: ME, text, at: NOW_AT }] }),
    addReminder: (threadId, text, due) => patchThread(threadId, { items: [...(state.threads.find((t) => t.id === threadId)?.items ?? []), { id: uid('r'), kind: 'lembrete', author: ME, text, due, at: NOW_AT, done: false }] }),
    toggleReminder: (threadId, itemId) => {
      const t = state.threads.find((x) => x.id === threadId)
      if (t) patchThread(threadId, { items: t.items.map((i) => (i.id === itemId && i.kind === 'lembrete' ? { ...i, done: !i.done } : i)) })
    },
    setStatus: (threadId, status) => patchThread(threadId, { status, ...(status === 'resolvida' ? { unread: false } : {}) }),
    assign: (threadId, memberId) => patchThread(threadId, { assignee: memberId }),
    setQueue: (threadId, queue) => patchThread(threadId, { queue }),
    markRead: (threadId, unread = false) => {
      if (state.threads.some((t) => t.id === threadId && t.unread !== unread)) patchThread(threadId, { unread })
    },
    openThread: (contactId) => {
      const existing = state.threads.find((t) => t.contactId === contactId)
      if (existing) return existing.id
      const t: Thread = { id: uid('t'), contactId, queue: 'vendas', assignee: ME, status: 'aberta', unread: false, items: [], suggestion: null }
      commit({ ...state, threads: [t, ...state.threads] })
      return t.id
    },
    saveCampaign: (campaign) => commit({ ...state, campaigns: state.campaigns.some((g) => g.id === campaign.id) ? state.campaigns.map((g) => (g.id === campaign.id ? campaign : g)) : [campaign, ...state.campaigns] }),
    removeCampaign: (id) => commit({ ...state, campaigns: state.campaigns.filter((g) => g.id !== id) }),
    // salva e envia de uma vez; os números de abertura só chegam depois, então começam zerados
    sendCampaign: (campaign) => {
      const { reach } = audienceOf(state.contacts, state.deals, campaign.audience)
      const done: Campaign = { ...campaign, status: 'enviada', when: NOW_AT, sent: reach.length, opened: 0, clicked: 0, replied: 0 }
      let s: State = { ...state, campaigns: state.campaigns.some((x) => x.id === done.id) ? state.campaigns.map((x) => (x.id === done.id ? done : x)) : [done, ...state.campaigns] }
      // fica no histórico de quem já tem conversa
      for (const c of reach) if (s.threads.some((t) => t.contactId === c.id)) s = append(s, c.id, [event(`Recebeu a campanha "${campaign.name}" por ${campaign.channel === 'email' ? 'e-mail' : 'WhatsApp'}`)])
      commit(s)
      return reach.length
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
