import { createContext, useContext, useState, type ReactNode } from 'react'

/* Brand kit: estado único da marca, guardado no aparelho (protótipo, sem servidor). */

export type SectionId = 'logo' | 'paleta' | 'tipografia' | 'voz'
/* vazio: sem nada · sugerido: a IA propôs, falta aprovar · aprovado: vale para o conteúdo */
export type SectionStatus = 'vazio' | 'sugerido' | 'aprovado'

export type Briefing = { name: string; segment: string; audience: string; offer: string; personality: string[] }
export type Palette = { id: string; name: string; primary: string; secondary: string; accent: string; ink: string; surface: string }
export type LogoStyle = 'monograma' | 'selo' | 'palavra'
export type FontPair = { id: string; name: string; note: string; heading: string; body: string }
export type Voice = { traits: string[]; tone: 'proxima' | 'equilibrada' | 'formal'; say: string[]; avoid: string[]; sample: string }

export type BrandKit = {
  briefing: Briefing
  briefingDone: boolean
  logo: { style: LogoStyle; upload: string | null }
  palette: Palette
  fontId: string
  voice: Voice
  status: Record<SectionId, SectionStatus>
}

/* As cores abaixo são dados da marca do cliente, não tokens da interface. */
export const PALETTES: Palette[] = [
  { id: 'torra', name: 'Torra média', primary: '#7b3f1d', secondary: '#e8c9a1', accent: '#d9772b', ink: '#2a1a12', surface: '#fbf6ef' },
  { id: 'jardim', name: 'Jardim', primary: '#1f6b4a', secondary: '#cfe6d6', accent: '#e0a526', ink: '#14261d', surface: '#f6faf5' },
  { id: 'oceano', name: 'Oceano', primary: '#14508c', secondary: '#cfe0f3', accent: '#f0803c', ink: '#0f2238', surface: '#f5f8fc' },
  { id: 'ameixa', name: 'Ameixa', primary: '#6b2152', secondary: '#f0d3e3', accent: '#e2a03f', ink: '#2b1223', surface: '#fcf6f9' },
  { id: 'grafite', name: 'Grafite', primary: '#26272b', secondary: '#dfe0e4', accent: '#d64545', ink: '#17181a', surface: '#f7f7f8' },
]

/* Protótipo: só o Geist está instalado; os outros pares usam fontes do aparelho. */
export const FONT_PAIRS: FontPair[] = [
  { id: 'moderna', name: 'Moderna', note: 'Limpa e direta. Boa para tecnologia e serviços.', heading: "'Geist Variable', sans-serif", body: "'Geist Variable', sans-serif" },
  { id: 'editorial', name: 'Editorial', note: 'Títulos com serifa. Passa tradição e cuidado.', heading: "Georgia, 'Times New Roman', serif", body: "'Geist Variable', sans-serif" },
  { id: 'amigavel', name: 'Amigável', note: 'Formas arredondadas. Próxima e acolhedora.', heading: "ui-rounded, 'Nunito', 'Trebuchet MS', sans-serif", body: "ui-rounded, 'Nunito', 'Trebuchet MS', sans-serif" },
  { id: 'tecnica', name: 'Técnica', note: 'Títulos monoespaçados. Precisa e objetiva.', heading: "ui-monospace, 'SF Mono', Menlo, monospace", body: "'Geist Variable', sans-serif" },
]
export const fontPair = (id: string) => FONT_PAIRS.find((f) => f.id === id) ?? FONT_PAIRS[0]

export const SECTIONS: { id: SectionId; label: string }[] = [
  { id: 'logo', label: 'Logo' },
  { id: 'paleta', label: 'Paleta' },
  { id: 'tipografia', label: 'Tipografia' },
  { id: 'voz', label: 'Tom de voz' },
]

const EMPTY: BrandKit = {
  briefing: { name: '', segment: '', audience: '', offer: '', personality: [] },
  briefingDone: false,
  logo: { style: 'monograma', upload: null },
  palette: PALETTES[0],
  fontId: 'moderna',
  voice: { traits: [], tone: 'equilibrada', say: [], avoid: [], sample: '' },
  status: { logo: 'vazio', paleta: 'vazio', tipografia: 'vazio', voz: 'vazio' },
}

export const EXAMPLE_BRIEFING: Briefing = {
  name: 'Ateliê Café',
  segment: 'cafeteria',
  audience: 'Pessoas de 25 a 45 anos que trabalham perto e gostam de café especial',
  offer: 'Cafés torrados na casa, oficinas aos sábados e kits para presente',
  personality: ['acolhedora', 'artesanal', 'bem-humorada'],
}

const SEGMENT_HINT: Record<string, { palette: string; font: string }> = {
  cafeteria: { palette: 'torra', font: 'editorial' },
  alimentacao: { palette: 'torra', font: 'amigavel' },
  saude: { palette: 'jardim', font: 'amigavel' },
  beleza: { palette: 'ameixa', font: 'editorial' },
  moda: { palette: 'grafite', font: 'editorial' },
  servicos: { palette: 'oceano', font: 'moderna' },
  tecnologia: { palette: 'oceano', font: 'tecnica' },
  outro: { palette: 'grafite', font: 'moderna' },
}

/* Sugestão de exemplo a partir do briefing. Em produção isto vira a chamada ao agente. */
export function suggestFrom(b: Briefing): Pick<BrandKit, 'logo' | 'palette' | 'fontId' | 'voice'> {
  const hint = SEGMENT_HINT[b.segment] ?? SEGMENT_HINT.outro
  const traits = b.personality.length ? b.personality : ['clara', 'confiável', 'próxima']
  const casual = traits.some((t) => /humor|divertid|acolh|próxim|jovem|leve/i.test(t))
  const formal = traits.some((t) => /séri|formal|técnic|premium|sofistic/i.test(t))
  const name = b.name.trim() || 'Sua marca'
  return {
    logo: { style: 'monograma', upload: null },
    palette: PALETTES.find((p) => p.id === hint.palette) ?? PALETTES[0],
    fontId: hint.font,
    voice: {
      traits,
      tone: formal ? 'formal' : casual ? 'proxima' : 'equilibrada',
      say: ['Frases curtas, na voz ativa', 'Falar do benefício antes do produto', 'Convidar em vez de mandar'],
      avoid: ['Jargão e termos em inglês sem necessidade', 'Promessa exagerada', 'Texto todo em maiúsculas'],
      sample: casual
        ? `Oi! Aqui é a ${name}. A gente preparou uma novidade pensando em você: ${b.offer.trim().toLowerCase() || 'vem ver de perto'}. Passa aqui?`
        : `A ${name} apresenta uma novidade: ${b.offer.trim().toLowerCase() || 'conheça nossos serviços'}. Fale com a gente para saber mais.`,
    },
  }
}

/* Contraste WCAG entre duas cores hex (#rrggbb). */
export function contrast(a: string, b: string) {
  const lum = (hex: string) => {
    const n = hex.replace('#', '')
    const [r, g, bl] = [0, 2, 4].map((i) => {
      const c = parseInt(n.slice(i, i + 2), 16) / 255
      return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
    })
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl
  }
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}
export const isHex = (v: string) => /^#[0-9a-f]{6}$/i.test(v)
/* Texto legível sobre uma cor da marca: claro ou escuro, o que tiver mais contraste. */
export const onColor = (bg: string) => (isHex(bg) && contrast(bg, '#ffffff') >= contrast(bg, '#18181b') ? '#ffffff' : '#18181b')

const KEY = 'aura-brand-kit'
function load(): BrandKit {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return { ...EMPTY, ...(JSON.parse(raw) as Partial<BrandKit>) }
  } catch {
    /* sem storage ou dado inválido: começa vazio */
  }
  return EMPTY
}

type Ctx = {
  kit: BrandKit
  update: (patch: Partial<BrandKit>) => void
  /* Editar uma seção aprovada devolve para "sugerido": o que mudou precisa de nova aprovação. */
  edit: (section: SectionId, patch: Partial<BrandKit>) => void
  approve: (section: SectionId) => void
  generate: (b: Briefing) => void
  reset: () => void
  approved: number
}
const BrandCtx = createContext<Ctx | null>(null)

export function BrandProvider({ children }: { children: ReactNode }) {
  const [kit, setKit] = useState<BrandKit>(load)
  const save = (next: BrandKit) => {
    setKit(next)
    try {
      // o logo enviado é uma URL temporária do navegador: não vale guardar
      localStorage.setItem(KEY, JSON.stringify({ ...next, logo: { ...next.logo, upload: null } }))
    } catch {
      /* ignora */
    }
  }
  const value: Ctx = {
    kit,
    update: (patch) => save({ ...kit, ...patch }),
    edit: (section, patch) => save({ ...kit, ...patch, status: { ...kit.status, [section]: 'sugerido' } }),
    approve: (section) => save({ ...kit, status: { ...kit.status, [section]: 'aprovado' } }),
    generate: (b) => save({ ...kit, briefing: b, briefingDone: true, ...suggestFrom(b), status: { logo: 'sugerido', paleta: 'sugerido', tipografia: 'sugerido', voz: 'sugerido' } }),
    reset: () => save(EMPTY),
    approved: SECTIONS.filter((s) => kit.status[s.id] === 'aprovado').length,
  }
  return <BrandCtx.Provider value={value}>{children}</BrandCtx.Provider>
}

export function useBrand() {
  const c = useContext(BrandCtx)
  if (!c) throw new Error('useBrand fora do BrandProvider')
  return c
}
