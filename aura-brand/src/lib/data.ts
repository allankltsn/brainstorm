/* Dados fictícios do protótipo. Nada aqui vem de uma API real. */

export const initials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('')

export const firstName = (name: string) => name.split(' ')[0]

const dateFmt = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })
export const todayLabel = () => dateFmt.format(new Date())
export const numberFmt = new Intl.NumberFormat('pt-BR')

export const session = { name: 'Marina Duarte', email: 'marina@cafedaserra.example', title: 'Café da Serra' }

export const notifications = [
  { id: 'n1', title: '3 posts aguardam sua aprovação', when: 'há 20 min', unread: true },
  { id: 'n2', title: 'Novo lead pelo formulário "Assinatura mensal"', when: 'há 2 h', unread: true },
  { id: 'n3', title: 'Seu brand kit foi atualizado', when: 'ontem', unread: false },
]

/* Os três KPIs de conteúdo são calculados a partir da lista de conteúdos; o valor aqui é só o inicial. */
export type Kpi = { id: string; label: string; value: number; hint: string }
export const kpis: Kpi[] = [
  { id: 'leads', label: 'Leads na semana', value: 18, hint: '5 a mais que na semana passada' },
  { id: 'agendados', label: 'Posts agendados', value: 0, hint: 'próximo: amanhã, 9h' },
  { id: 'producao', label: 'Em ajuste', value: 0, hint: 'devolvidos para nova versão' },
  { id: 'aprovacao', label: 'Aguardando aprovação', value: 0, hint: 'a IA só publica com seu aval' },
]

export type ContentKind = 'post' | 'carrossel' | 'video'
export type Channel = 'Instagram' | 'LinkedIn' | 'TikTok'
export type ContentStatus = 'aprovacao' | 'ajuste' | 'agendado'
export type ContentItem = {
  id: string
  kind: ContentKind
  channel: Channel
  title: string
  caption: string
  status: ContentStatus
  /** Só para itens agendados */
  when?: string
}

export const KIND_LABEL: Record<ContentKind, string> = { post: 'Post', carrossel: 'Carrossel', video: 'Vídeo curto' }
/* Custo fictício em créditos: imagem e vídeo custam mais que texto. */
export const KIND_COST: Record<ContentKind, number> = { post: 5, carrossel: 20, video: 60 }
export const CHANNELS: Channel[] = ['Instagram', 'LinkedIn', 'TikTok']

export const contentItems: ContentItem[] = [
  { id: 'a1', kind: 'carrossel', channel: 'Instagram', title: '5 motivos para assinar café fresco', caption: 'Café bom é café fresco. Veja 5 motivos para receber o seu em casa todo mês.', status: 'aprovacao' },
  { id: 'a2', kind: 'post', channel: 'Instagram', title: 'Bastidores da torra de sábado', caption: 'Sábado é dia de torra. Vem ver como o seu café ganha aroma antes de chegar na xícara.', status: 'aprovacao' },
  { id: 'a3', kind: 'post', channel: 'LinkedIn', title: 'Como escolher a moagem', caption: 'Moagem fina, média ou grossa? Depende do seu método. Um guia rápido para acertar.', status: 'aprovacao' },
  { id: 's1', kind: 'post', channel: 'Instagram', title: 'Novo lote da Mantiqueira', caption: 'Chegou o lote novo, com notas de caramelo e frutas amarelas.', status: 'agendado', when: 'amanhã, 9h' },
  { id: 's2', kind: 'video', channel: 'TikTok', title: 'Coado em 30 segundos', caption: 'O passo a passo do coado perfeito, sem complicar.', status: 'agendado', when: 'sexta, 18h' },
]

export const credits = { used: 340, total: 1000, renewsOn: '1º de dezembro' }

export type Tone = 'proximo' | 'neutro' | 'formal'
export type BrandColor = { id: string; name: string; hex: string }
export type BrandKit = {
  name: string
  segment: string
  description: string
  audience: string
  tone: Tone
  values: string[]
  avoid: string[]
  colors: BrandColor[]
  headingFont: string
  bodyFont: string
  hasLogo: boolean
}

/* As cores abaixo são da marca do cliente (conteúdo), não tokens da interface. */
export const brandKit: BrandKit = {
  name: 'Café da Serra',
  segment: 'Cafeteria e assinatura de cafés especiais',
  description: 'Torrefação artesanal que entrega café fresco por assinatura e recebe clientes em uma cafeteria de bairro.',
  audience: 'Adultos de 25 a 45 anos que gostam de café especial e compram pela internet.',
  tone: 'proximo',
  values: ['artesanal', 'frescor', 'origem conhecida'],
  avoid: ['gourmet', 'barato'],
  colors: [
    { id: 'c1', name: 'Grão torrado', hex: '#4a2c1a' },
    { id: 'c2', name: 'Creme', hex: '#f3e9dc' },
    { id: 'c3', name: 'Folha', hex: '#3f6b4f' },
    { id: 'c4', name: 'Cereja', hex: '#b8402f' },
  ],
  headingFont: 'Fraunces',
  bodyFont: 'Inter',
  hasLogo: false,
}

export const brandKitChecklist = (kit: BrandKit) => [
  { id: 'identidade', label: 'Identidade preenchida', done: Boolean(kit.name && kit.description && kit.audience) },
  { id: 'paleta', label: 'Paleta com pelo menos 3 cores', done: kit.colors.length >= 3 },
  { id: 'tipografia', label: 'Tipografia definida', done: Boolean(kit.headingFont && kit.bodyFont) },
  { id: 'voz', label: 'Tom de voz com palavras-chave', done: kit.values.length > 0 },
  { id: 'logo', label: 'Logo enviado', done: kit.hasLogo },
]
