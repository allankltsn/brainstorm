import { createContext, useContext, useState, type ReactNode } from 'react'
import { PALETTES, type BrandKit } from './brand'

/* Conteúdo: rascunhos que a Aura sugere, a fila de aprovação e o que já foi agendado. */

export type Format = 'post' | 'carrossel'
export type Channel = 'instagram' | 'facebook' | 'linkedin'
export type Goal = 'novidade' | 'dica' | 'oferta' | 'bastidores'
export type Slide = { title: string; text: string }
/* fila: espera aprovação · agendado: aprovado, com data para publicar */
export type ContentStatus = 'fila' | 'agendado'

export type ContentItem = {
  id: string
  format: Format
  channel: Channel
  goal: Goal
  topic: string
  headline: string
  caption: string
  hashtags: string[]
  slides: Slide[]
  when: string // data e hora locais, no formato do campo datetime-local
  status: ContentStatus
  version: number
}

export const FORMATS: { value: Format; label: string }[] = [
  { value: 'post', label: 'Post' },
  { value: 'carrossel', label: 'Carrossel' },
]
export const CHANNELS: { value: Channel; label: string; limit: number; note: string }[] = [
  { value: 'instagram', label: 'Instagram', limit: 2200, note: 'Legenda com quebras de linha e até 5 hashtags.' },
  { value: 'facebook', label: 'Facebook', limit: 500, note: 'Texto curto, em tom de conversa.' },
  { value: 'linkedin', label: 'LinkedIn', limit: 1300, note: 'Tom mais profissional, com parágrafos curtos.' },
]
export const GOALS: { value: Goal; label: string; description: string }[] = [
  { value: 'novidade', label: 'Contar uma novidade', description: 'Lançamento, produto novo ou mudança' },
  { value: 'dica', label: 'Ensinar algo', description: 'Dica prática que mostra o que você sabe' },
  { value: 'oferta', label: 'Divulgar uma oferta', description: 'Promoção, kit ou condição com prazo' },
  { value: 'bastidores', label: 'Mostrar os bastidores', description: 'Como as coisas são feitas e quem faz' },
]
export const channelOf = (c: Channel) => CHANNELS.find((x) => x.value === c) ?? CHANNELS[0]
export const formatOf = (f: Format) => FORMATS.find((x) => x.value === f) ?? FORMATS[0]

/* "Hoje" do protótipo é 11/11/2026. */
export const NOW = '2026-11-11T10:00'
export function whenLabel(when: string) {
  const d = new Date(when)
  if (Number.isNaN(d.getTime())) return 'sem data'
  const day = d.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' }).replace('.', '')
  return `${day} às ${d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`
}

/*
 * A Aura só usa no conteúdo o que foi aprovado. Parte do kit ainda não aprovada
 * sai neutra: cores em grafite, fonte padrão e tom equilibrado.
 */
const NEUTRAL = PALETTES.find((p) => p.id === 'grafite') ?? PALETTES[0]
export function approvedKit(kit: BrandKit): BrandKit {
  const ok = (s: keyof BrandKit['status']) => kit.status[s] === 'aprovado'
  return {
    ...kit,
    logo: ok('logo') ? kit.logo : { style: 'monograma', upload: null },
    palette: ok('paleta') ? kit.palette : NEUTRAL,
    fontId: ok('tipografia') ? kit.fontId : 'moderna',
    voice: ok('voz') ? kit.voice : { ...kit.voice, tone: 'equilibrada', traits: [] },
  }
}

const slugTag = (s: string) =>
  '#' +
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '')
    .toLowerCase()
const cap = (s: string) => (s ? s[0].toUpperCase() + s.slice(1) : s)
const clean = (s: string) => s.trim().replace(/[.!?]+$/, '')
/* Palavras que carregam o assunto, sem artigos e preposições, para montar a hashtag. */
const STOP = new Set(['a', 'o', 'as', 'os', 'de', 'da', 'do', 'das', 'dos', 'e', 'em', 'no', 'na', 'para', 'com', 'um', 'uma', 'ao'])
const keywords = (s: string) =>
  s
    .split(/\s+/)
    .filter((w) => !STOP.has(w.toLowerCase()))
    .slice(0, 2)
    .join(' ')

type Request = { format: Format; channel: Channel; goal: Goal; topic: string; version?: number }

/*
 * Rascunho de exemplo: gancho, corpo, chamada e hashtags, ajustados ao canal e ao tom
 * de voz aprovado. Em produção isto vira a chamada ao agente.
 */
export function draftFrom(req: Request, kit: BrandKit): Omit<ContentItem, 'id' | 'status' | 'when'> {
  const k = approvedKit(kit)
  const v = req.version ?? 0
  const name = k.briefing.name.trim() || 'a gente'
  const topic = clean(req.topic)
  const near = k.voice.tone === 'proxima'
  const formal = k.voice.tone === 'formal' || req.channel === 'linkedin'

  const hooks: Record<Goal, string[]> = {
    novidade: [`Vem aí: ${topic}`, `Tem novidade: ${topic}`, `Agora na ${name}: ${topic}`],
    dica: [`${cap(topic)}: o que quase ninguém conta`, `3 coisas sobre ${topic} que fazem diferença`, `Antes de pensar em ${topic}, veja isto`],
    oferta: [`${cap(topic)}, só nesta semana`, `Condição especial: ${topic}`, `${cap(topic)} com prazo para acabar`],
    bastidores: [`Como nasce ${topic}`, `Por trás de ${topic}`, `Um dia fazendo ${topic}`],
  }
  const bodies: Record<Goal, string> = {
    novidade: `Preparamos isso pensando em quem já acompanha a ${name} e em quem está chegando agora.`,
    dica: `Separamos o que aprendemos na prática, sem complicar.`,
    oferta: `É a chance de experimentar com uma condição que não fica o ano todo.`,
    bastidores: `Cada etapa tem um motivo, e a gente gosta de mostrar como faz.`,
  }
  const ctas: Record<Goal, string> = {
    novidade: near ? 'Passa aqui para conhecer?' : 'Fale com a gente para saber mais.',
    dica: near ? 'Salva este post para lembrar depois.' : 'Guarde este conteúdo para consultar depois.',
    oferta: near ? 'Chama a gente no WhatsApp e garante o seu.' : 'Entre em contato para garantir a condição.',
    bastidores: near ? 'Conta pra gente: o que você quer ver por aqui?' : 'Conte nos comentários o que você gostaria de conhecer.',
  }
  const headline = hooks[req.goal][v % 3]
  const opener = near && !formal ? `Oi! ${headline}.` : `${headline}.`
  const offer = k.briefing.offer.trim() ? `\n\nNa ${name}: ${clean(k.briefing.offer).toLowerCase()}.` : ''
  const caption =
    req.channel === 'facebook'
      ? `${opener} ${bodies[req.goal]} ${ctas[req.goal]}`
      : `${opener}\n\n${bodies[req.goal]}${req.channel === 'linkedin' ? offer : ''}\n\n${ctas[req.goal]}`

  const slides: Slide[] =
    req.format === 'carrossel'
      ? [
          { title: headline, text: 'Arraste para ver' },
          { title: 'Por que importa', text: bodies[req.goal] },
          { title: 'Como funciona', text: `O essencial sobre ${topic}, em poucas linhas.` },
          { title: 'O que muda para você', text: 'Um benefício concreto, dito de forma simples.' },
          { title: 'Próximo passo', text: ctas[req.goal] },
        ]
      : []

  const tags = [slugTag(name), slugTag(keywords(topic)), ...k.voice.traits.slice(0, 1).map(slugTag), slugTag(k.briefing.segment || 'marca')]
  const hashtags = req.channel === 'facebook' ? [] : [...new Set(tags.filter((t) => t.length > 2))].slice(0, req.channel === 'linkedin' ? 3 : 4)

  return { format: req.format, channel: req.channel, goal: req.goal, topic: req.topic.trim(), headline, caption, hashtags, slides, version: v }
}

const SEED: ContentItem[] = [
  {
    id: 'c1',
    format: 'post',
    channel: 'instagram',
    goal: 'novidade',
    topic: 'novo blend de inverno',
    headline: 'Novo blend de inverno chegou',
    caption:
      'Oi! Chegou o blend que a gente torrou pensando nas manhãs frias.\n\nNotas de cacau, mel e um final de laranja. Disponível a partir de sexta, no balcão e no site.\n\nPassa aqui para provar?',
    hashtags: ['#ateliecafe', '#cafeespecial', '#blenddeinverno'],
    slides: [],
    when: '2026-11-13T09:00',
    status: 'fila',
    version: 0,
  },
  {
    id: 'c2',
    format: 'carrossel',
    channel: 'instagram',
    goal: 'dica',
    topic: 'café coado',
    headline: '5 erros ao passar café coado',
    caption: 'Café coado parece simples, mas alguns detalhes mudam tudo.\n\nSepara dois minutos e arrasta para ver.\n\nSalva este post para lembrar depois.',
    hashtags: ['#ateliecafe', '#cafecoado', '#dicasdecafe'],
    slides: [
      { title: '5 erros ao passar café coado', text: 'Arraste para ver' },
      { title: 'Água fervendo demais', text: 'Desligue o fogo e espere 30 segundos antes de passar.' },
      { title: 'Moagem errada', text: 'Para coado, a moagem média é a mais segura.' },
      { title: 'Filtro sem escaldar', text: 'Passe água quente no filtro antes para tirar o gosto de papel.' },
      { title: 'Proporção no olho', text: 'Comece com 10 g de café para cada 100 ml de água.' },
      { title: 'Quer aprender ao vivo?', text: 'A oficina de sábado ainda tem vagas. Chama a gente.' },
    ],
    when: '2026-11-16T18:30',
    status: 'fila',
    version: 0,
  },
  {
    id: 'c0',
    format: 'post',
    channel: 'facebook',
    goal: 'bastidores',
    topic: 'a torra de quinta',
    headline: 'Como nasce a torra de quinta',
    caption: 'Toda quinta a gente torra os cafés da semana. Cada etapa tem um motivo, e a gente gosta de mostrar como faz. Conta pra gente: o que você quer ver por aqui?',
    hashtags: [],
    slides: [],
    when: '2026-11-12T08:00',
    status: 'agendado',
    version: 0,
  },
]

const KEY = 'aura-brand-content'
function load(): ContentItem[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw) as ContentItem[]
  } catch {
    /* sem storage ou dado inválido: usa os exemplos */
  }
  return SEED
}

type Ctx = {
  items: ContentItem[]
  queue: ContentItem[]
  scheduled: ContentItem[]
  add: (draft: Omit<ContentItem, 'id' | 'status' | 'when'>) => ContentItem
  patch: (id: string, patch: Partial<ContentItem>) => void
  remove: (id: string) => void
  restore: (item: ContentItem) => void
}
const ContentCtx = createContext<Ctx | null>(null)

export function ContentProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ContentItem[]>(load)
  const save = (fn: (cur: ContentItem[]) => ContentItem[]) =>
    setItems((cur) => {
      const next = fn(cur)
      try {
        localStorage.setItem(KEY, JSON.stringify(next))
      } catch {
        /* ignora */
      }
      return next
    })
  const byDate = (a: ContentItem, b: ContentItem) => a.when.localeCompare(b.when)
  const value: Ctx = {
    items,
    queue: items.filter((i) => i.status === 'fila'),
    scheduled: items.filter((i) => i.status === 'agendado').sort(byDate),
    add: (draft) => {
      // sugestão de horário: dois dias depois de "hoje", às 9h
      const item: ContentItem = { ...draft, id: `c${Date.now()}`, status: 'fila', when: '2026-11-13T09:00' }
      save((cur) => [item, ...cur])
      return item
    },
    patch: (id, patch) => save((cur) => cur.map((i) => (i.id === id ? { ...i, ...patch } : i))),
    remove: (id) => save((cur) => cur.filter((i) => i.id !== id)),
    restore: (item) => save((cur) => (cur.some((i) => i.id === item.id) ? cur.map((i) => (i.id === item.id ? item : i)) : [item, ...cur])),
  }
  return <ContentCtx.Provider value={value}>{children}</ContentCtx.Provider>
}

export function useContent() {
  const c = useContext(ContentCtx)
  if (!c) throw new Error('useContent fora do ContentProvider')
  return c
}
