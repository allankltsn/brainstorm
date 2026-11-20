import { Check, RefreshCw, Sparkles, Upload } from 'lucide-react'
import { useRef, useState, type ReactNode } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/affect/button'
import { SegmentedControl } from '@/components/affect/segmented-control'
import { Select } from '@/components/affect/select'
import { TagInput } from '@/components/affect/tag-input'
import { TextArea } from '@/components/affect/text-area'
import { TextField } from '@/components/affect/text-field'
import { ThinkingLoader } from '@/components/affect/thinking-loader'
import { brandName, LogoMark, PostPreview } from '@/components/brand-preview'
import { PageHeader, Pill, Section } from '@/components/page'
import { Progress } from '@/components/ui/progress'
import {
  contrast,
  EXAMPLE_BRIEFING,
  FONT_PAIRS,
  fontPair,
  isHex,
  onColor,
  PALETTES,
  SECTIONS,
  useBrand,
  type Briefing,
  type LogoStyle,
  type Palette,
  type SectionId,
  type Voice,
} from '@/lib/brand'
import { useTab } from '@/lib/use-tab'
import { cn } from '@/lib/utils'

const TABS = ['visao', 'briefing', 'logo', 'paleta', 'tipografia', 'voz'] as const
type Tab = (typeof TABS)[number]

const STATUS_LABEL = { vazio: 'Falta fazer', sugerido: 'Sugestão da Aura · falta aprovar', aprovado: 'Aprovado' } as const
const STATUS_TONE = { vazio: 'neutral', sugerido: 'warning', aprovado: 'success' } as const

const SEGMENTS = [
  { value: 'cafeteria', label: 'Cafeteria ou padaria' },
  { value: 'alimentacao', label: 'Restaurante e alimentação' },
  { value: 'saude', label: 'Saúde e bem-estar' },
  { value: 'beleza', label: 'Beleza e estética' },
  { value: 'moda', label: 'Moda e acessórios' },
  { value: 'servicos', label: 'Serviços profissionais' },
  { value: 'tecnologia', label: 'Tecnologia' },
  { value: 'outro', label: 'Outro' },
]

/* Rodapé de cada parte do kit: estado em texto e a ação de aprovar. */
function Approval({ section }: { section: SectionId }) {
  const { kit, approve } = useBrand()
  const status = kit.status[section]
  const label = SECTIONS.find((s) => s.id === section)?.label ?? ''
  return (
    <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t pt-4">
      <Pill tone={STATUS_TONE[status]} icon={status === 'aprovado' ? <Check /> : undefined}>
        {STATUS_LABEL[status]}
      </Pill>
      <Button
        disabled={status === 'aprovado'}
        onClick={() => {
          approve(section)
          toast.success(`${label}: aprovado`, { description: 'Os próximos conteúdos já usam esta definição.' })
        }}
      >
        {status === 'aprovado' ? 'Aprovado' : `Aprovar ${label.toLowerCase()}`}
      </Button>
    </div>
  )
}

function NeedsBriefing({ onGo }: { onGo: () => void }) {
  return (
    <Section title="Comece pelo briefing" description="Com cinco respostas a Aura sugere logo, paleta, tipografia e tom de voz.">
      <Button icon={<Sparkles />} onClick={onGo}>
        Responder o briefing
      </Button>
    </Section>
  )
}

function Overview({ go }: { go: (t: Tab) => void }) {
  const { kit, approved } = useBrand()
  if (!kit.briefingDone) return <NeedsBriefing onGo={() => go('briefing')} />
  const next = SECTIONS.find((s) => kit.status[s.id] !== 'aprovado')
  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <div className="grid min-w-0 content-start gap-6 lg:col-span-3">
        <Section
          title={`${approved} de ${SECTIONS.length} partes aprovadas`}
          description={next ? 'A Aura só usa no conteúdo o que você aprovou.' : 'Seu brand kit está completo. Todo conteúdo novo segue estas definições.'}
        >
          <Progress value={(approved / SECTIONS.length) * 100} className="mb-4 h-1.5" aria-label={`${approved} de ${SECTIONS.length} partes aprovadas`} />
          <ul className="-mx-2 divide-y">
            {SECTIONS.map((s) => (
              <li key={s.id} className="flex flex-wrap items-center justify-between gap-3 px-2 py-3">
                <span className="text-sm font-medium">{s.label}</span>
                <span className="flex items-center gap-2">
                  <Pill tone={STATUS_TONE[kit.status[s.id]]}>{STATUS_LABEL[kit.status[s.id]]}</Pill>
                  <Button size="sm" variant="secondary" onClick={() => go(s.id)}>
                    {kit.status[s.id] === 'aprovado' ? 'Ver' : 'Revisar'}
                  </Button>
                </span>
              </li>
            ))}
          </ul>
        </Section>
        <Section title="Resumo da marca">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="flex h-28 items-center justify-center rounded-lg border" style={{ background: kit.palette.surface }}>
              <LogoMark kit={kit} className="h-20 w-auto max-w-full" />
            </div>
            <div className="grid content-start gap-3">
              <div className="flex gap-1.5" role="img" aria-label={`Paleta ${kit.palette.name}`}>
                {(['primary', 'secondary', 'accent', 'ink', 'surface'] as const).map((k) => (
                  <span key={k} className="h-8 flex-1 rounded-md border" style={{ background: kit.palette[k] }} />
                ))}
              </div>
              <p className="text-sm">
                <span className="text-muted-foreground">Tipografia:</span> {fontPair(kit.fontId).name}
              </p>
              <p className="text-sm">
                <span className="text-muted-foreground">Personalidade:</span> {kit.voice.traits.join(', ') || 'a definir'}
              </p>
            </div>
          </div>
        </Section>
      </div>
      <div className="min-w-0 lg:col-span-2">
        <h2 className="mb-3 text-sm font-semibold">Como fica num post</h2>
        <PostPreview kit={kit} />
      </div>
    </div>
  )
}

function BriefingForm({ onDone }: { onDone: () => void }) {
  const { kit, generate } = useBrand()
  const [b, setB] = useState<Briefing>(kit.briefing)
  const [busy, setBusy] = useState(false)
  const [tried, setTried] = useState(false)
  const set = (patch: Partial<Briefing>) => setB((cur) => ({ ...cur, ...patch }))
  const missing = { name: !b.name.trim(), segment: !b.segment, audience: !b.audience.trim(), offer: !b.offer.trim() }
  const invalid = Object.values(missing).some(Boolean)

  if (busy)
    return (
      <Section title="A Aura está montando o seu brand kit" description="Leva alguns segundos. Você revisa tudo antes de valer.">
        <ThinkingLoader phases={['Lendo o briefing', 'Escolhendo cores e fontes', 'Desenhando o logo', 'Escrevendo o tom de voz']} interval={700} />
      </Section>
    )

  return (
    <Section
      title="Briefing da marca"
      description="Cinco respostas. Quanto mais específico, melhor a sugestão."
      action={
        <Button size="sm" variant="ghost" onClick={() => setB(EXAMPLE_BRIEFING)}>
          Preencher com exemplo
        </Button>
      }
    >
      <form
        className="grid gap-5"
        noValidate
        onSubmit={(e) => {
          e.preventDefault()
          setTried(true)
          if (invalid) return
          setBusy(true)
          setTimeout(() => {
            generate(b)
            setBusy(false)
            toast.success('Brand kit sugerido', { description: 'Revise cada parte e aprove o que estiver bom.' })
            onDone()
          }, 2900)
        }}
      >
        <TextField label="Nome da marca" value={b.name} onChange={(e) => set({ name: e.target.value })} maxLength={40} error={tried && missing.name ? 'Informe o nome da marca.' : undefined} />
        <Select
          label="Segmento"
          placeholder="Escolha o mais próximo"
          options={SEGMENTS}
          value={b.segment || null}
          onChange={(v) => set({ segment: v })}
          error={tried && missing.segment ? 'Escolha um segmento.' : undefined}
        />
        <TextArea
          label="Para quem você vende"
          hint="Idade, região, o que essas pessoas buscam."
          minRows={2}
          maxLength={240}
          value={b.audience}
          onChange={(e) => set({ audience: e.target.value })}
          error={tried && missing.audience ? 'Descreva o seu público.' : undefined}
        />
        <TextArea
          label="O que você oferece de diferente"
          hint="Produtos, serviços e o que faz as pessoas escolherem você."
          minRows={2}
          maxLength={240}
          value={b.offer}
          onChange={(e) => set({ offer: e.target.value })}
          error={tried && missing.offer ? 'Conte o que a marca oferece.' : undefined}
        />
        <TagInput
          label="Personalidade da marca"
          optional
          hint="Até 5 palavras. Ex.: acolhedora, técnica, bem-humorada. Enter adiciona."
          placeholder="Adicionar palavra"
          max={5}
          value={b.personality}
          onChange={(personality) => set({ personality })}
        />
        <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-4">
          <p className="text-xs text-muted-foreground">Gerar o kit usa 20 créditos de IA. {kit.briefingDone && 'Gerar de novo substitui as sugestões atuais.'}</p>
          <Button type="submit" icon={<Sparkles />}>
            {kit.briefingDone ? 'Gerar de novo' : 'Gerar brand kit'}
          </Button>
        </div>
      </form>
    </Section>
  )
}

const LOGO_STYLES: { value: LogoStyle; label: string; note: string }[] = [
  { value: 'monograma', label: 'Monograma', note: 'Iniciais num bloco. Funciona bem em tamanhos pequenos.' },
  { value: 'selo', label: 'Selo', note: 'Circular, com cara de carimbo. Bom para embalagens.' },
  { value: 'palavra', label: 'Só o nome', note: 'O nome escrito na fonte da marca.' },
]

function LogoTab() {
  const { kit, edit } = useBrand()
  const file = useRef<HTMLInputElement>(null)
  return (
    <Section title="Logo" description="Escolha uma das opções sugeridas ou envie o logo que você já usa.">
      <div role="radiogroup" aria-label="Estilo do logo" className="grid gap-3 sm:grid-cols-3">
        {LOGO_STYLES.map((s) => {
          const active = kit.logo.style === s.value && !kit.logo.upload
          return (
            <button
              key={s.value}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => edit('logo', { logo: { style: s.value, upload: null } })}
              className={cn('rounded-xl border p-3 text-left outline-none hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring', active && 'border-primary ring-1 ring-primary')}
            >
              <span className="flex h-24 items-center justify-center rounded-lg" style={{ background: kit.palette.surface }}>
                <LogoMark kit={{ ...kit, logo: { style: s.value, upload: null } }} className="h-16 w-auto max-w-full" />
              </span>
              <span className="mt-3 flex items-center gap-1.5 text-sm font-medium">
                {s.label}
                {active && <Check className="size-4 text-primary" aria-hidden="true" />}
              </span>
              <span className="mt-0.5 block text-xs text-muted-foreground">{s.note}</span>
            </button>
          )
        })}
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <input
          ref={file}
          type="file"
          accept="image/png,image/svg+xml,image/jpeg"
          className="sr-only"
          aria-label="Enviar arquivo do logo"
          onChange={(e) => {
            const f = e.target.files?.[0]
            if (!f) return
            if (f.size > 2 * 1024 * 1024) {
              toast.error('Arquivo grande demais', { description: 'Envie uma imagem de até 2 MB.' })
              return
            }
            edit('logo', { logo: { style: kit.logo.style, upload: URL.createObjectURL(f) } })
            e.target.value = ''
          }}
        />
        <Button variant="secondary" icon={<Upload />} onClick={() => file.current?.click()}>
          Enviar meu logo
        </Button>
        <p className="text-xs text-muted-foreground">PNG, SVG ou JPG, até 2 MB.</p>
        {kit.logo.upload && (
          <span className="flex items-center gap-3">
            <img src={kit.logo.upload} alt="Logo enviado" className="h-10 w-auto rounded border bg-white object-contain p-1" />
            <Button size="sm" variant="ghost" onClick={() => edit('logo', { logo: { style: kit.logo.style, upload: null } })}>
              Remover
            </Button>
          </span>
        )}
      </div>
      <Approval section="logo" />
    </Section>
  )
}

const COLOR_FIELDS: { key: keyof Omit<Palette, 'id' | 'name'>; label: string; hint: string }[] = [
  { key: 'primary', label: 'Principal', hint: 'Botões, títulos e destaques' },
  { key: 'secondary', label: 'Apoio', hint: 'Fundos de cartões e detalhes' },
  { key: 'accent', label: 'Destaque', hint: 'Use pouco: selos e chamadas' },
  { key: 'ink', label: 'Texto', hint: 'Cor do texto corrido' },
  { key: 'surface', label: 'Fundo', hint: 'Fundo das peças' },
]

function ContrastRow({ label, a, b }: { label: string; a: string; b: string }) {
  const ratio = contrast(a, b)
  const ok = ratio >= 4.5
  return (
    <li className="flex items-center justify-between gap-3 text-sm">
      <span className="flex items-center gap-2.5">
        <span className="flex size-8 items-center justify-center rounded-md border text-xs font-semibold" style={{ background: b, color: a }} aria-hidden="true">
          Aa
        </span>
        {label}
      </span>
      <Pill tone={ok ? 'success' : 'warning'}>
        {ratio.toFixed(1).replace('.', ',')}:1 · {ok ? 'Boa leitura' : 'Difícil de ler'}
      </Pill>
    </li>
  )
}

function PaletteTab() {
  const { kit, edit } = useBrand()
  const { palette } = kit
  // rascunho por campo: deixa digitar um hex incompleto sem quebrar a prévia
  const [typing, setTyping] = useState<Partial<Record<string, string>>>({})
  const setColor = (key: keyof Palette, value: string) => edit('paleta', { palette: { ...palette, id: 'personalizada', name: 'Personalizada', [key]: value.toLowerCase() } })
  const suggestAnother = () => {
    const i = PALETTES.findIndex((p) => p.id === palette.id)
    setTyping({})
    edit('paleta', { palette: PALETTES[(i + 1) % PALETTES.length] })
  }
  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Section
        title={`Paleta: ${palette.name}`}
        description="Cinco cores, cada uma com um papel."
        className="min-w-0 lg:col-span-3"
        action={
          <Button size="sm" variant="secondary" icon={<RefreshCw />} onClick={suggestAnother}>
            Sugerir outra
          </Button>
        }
      >
        <ul className="grid gap-4">
          {COLOR_FIELDS.map((f) => {
            const draft = typing[f.key]
            const bad = draft !== undefined && !isHex(draft)
            return (
              <li key={f.key} className="flex items-start gap-3">
                <label className="relative mt-[1.6875rem] size-10 shrink-0 overflow-hidden rounded-lg border focus-within:ring-2 focus-within:ring-ring" style={{ background: palette[f.key] }}>
                  <span className="sr-only">Escolher a cor {f.label.toLowerCase()}</span>
                  <input type="color" value={palette[f.key]} onChange={(e) => (setTyping((t) => ({ ...t, [f.key]: undefined })), setColor(f.key, e.target.value))} className="absolute inset-0 size-full cursor-pointer opacity-0" />
                </label>
                <TextField
                  label={f.label}
                  hint={bad ? undefined : f.hint}
                  error={bad ? 'Use o formato #rrggbb, como #6a0dad.' : undefined}
                  className="flex-1"
                  inputClassName="font-mono uppercase"
                  maxLength={7}
                  spellCheck={false}
                  value={draft ?? palette[f.key]}
                  onChange={(e) => {
                    const v = e.target.value.trim()
                    if (isHex(v)) {
                      setTyping((t) => ({ ...t, [f.key]: undefined }))
                      setColor(f.key, v)
                    } else setTyping((t) => ({ ...t, [f.key]: v }))
                  }}
                />
              </li>
            )
          })}
        </ul>
        <Approval section="paleta" />
      </Section>
      <div className="grid min-w-0 content-start gap-6 lg:col-span-2">
        <Section title="Leitura" description="O texto precisa de contraste de pelo menos 4,5:1.">
          <ul className="grid gap-3">
            <ContrastRow label="Texto no fundo" a={palette.ink} b={palette.surface} />
            <ContrastRow label="Texto na cor principal" a={onColor(palette.primary)} b={palette.primary} />
            <ContrastRow label="Principal no fundo" a={palette.primary} b={palette.surface} />
            <ContrastRow label="Texto na cor de apoio" a={palette.ink} b={palette.secondary} />
          </ul>
        </Section>
        <PostPreview kit={kit} />
      </div>
    </div>
  )
}

function FontsTab() {
  const { kit, edit } = useBrand()
  const name = brandName(kit)
  return (
    <Section title="Tipografia" description="Um par de fontes: uma para títulos, outra para o texto.">
      <div role="radiogroup" aria-label="Par de fontes" className="grid gap-3 sm:grid-cols-2">
        {FONT_PAIRS.map((f) => {
          const active = kit.fontId === f.id
          return (
            <button
              key={f.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => edit('tipografia', { fontId: f.id })}
              className={cn('rounded-xl border p-4 text-left outline-none hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring', active && 'border-primary ring-1 ring-primary')}
            >
              <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                {f.name}
                {active && <Check className="size-4 text-primary" aria-hidden="true" />}
              </span>
              <span className="mt-2 block truncate text-2xl leading-tight font-bold" style={{ fontFamily: f.heading }}>
                {name}
              </span>
              <span className="mt-1.5 block text-sm leading-relaxed" style={{ fontFamily: f.body }}>
                Feito com cuidado, do começo ao fim. 0123456789
              </span>
              <span className="mt-3 block text-xs text-muted-foreground">{f.note}</span>
            </button>
          )
        })}
      </div>
      <p className="mt-4 text-xs text-muted-foreground">Protótipo: as prévias usam fontes do seu aparelho. No produto, cada par vem com as fontes licenciadas.</p>
      <Approval section="tipografia" />
    </Section>
  )
}

const TONES: { value: Voice['tone']; label: string }[] = [
  { value: 'proxima', label: 'Próxima' },
  { value: 'equilibrada', label: 'Equilibrada' },
  { value: 'formal', label: 'Formal' },
]

function VoiceTab() {
  const { kit, edit } = useBrand()
  const { voice } = kit
  const set = (patch: Partial<Voice>) => edit('voz', { voice: { ...voice, ...patch } })
  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Section title="Tom de voz" description="Como a marca fala em posts, respostas e campanhas." className="min-w-0 lg:col-span-3">
        <div className="grid gap-5">
          <TagInput label="Personalidade" hint="Até 5 palavras. Enter adiciona." placeholder="Adicionar palavra" max={5} value={voice.traits} onChange={(traits) => set({ traits })} />
          <div className="grid gap-2">
            <span id="tom-label" className="text-sm font-medium">
              Formalidade
            </span>
            <SegmentedControl<Voice['tone']> aria-labelledby="tom-label" fullWidth value={voice.tone} onChange={(tone) => set({ tone })} options={TONES} />
          </div>
          <TagInput label="A marca fala assim" hint="Regras curtas que a Aura segue." placeholder="Adicionar regra" max={6} value={voice.say} onChange={(say) => set({ say })} />
          <TagInput label="A marca evita" hint="O que nunca deve aparecer no conteúdo." placeholder="Adicionar regra" max={6} value={voice.avoid} onChange={(avoid) => set({ avoid })} />
          <TextArea
            label="Frase de exemplo"
            hint="Um texto curto no jeito da marca. Serve de referência para a Aura."
            minRows={3}
            maxLength={280}
            counter
            value={voice.sample}
            onChange={(e) => set({ sample: e.target.value })}
          />
        </div>
        <Approval section="voz" />
      </Section>
      <div className="min-w-0 lg:col-span-2">
        <h2 className="mb-3 text-sm font-semibold">Como fica num post</h2>
        <PostPreview kit={kit} />
      </div>
    </div>
  )
}

export function Marca() {
  const { kit, approved, reset, update } = useBrand()
  const [tab, setTab] = useTab<Tab>(TABS)
  const locked = !kit.briefingDone
  const panels: Record<Tab, ReactNode> = {
    visao: <Overview go={setTab} />,
    briefing: <BriefingForm onDone={() => setTab('visao')} />,
    logo: <LogoTab />,
    paleta: <PaletteTab />,
    tipografia: <FontsTab />,
    voz: <VoiceTab />,
  }
  const kitTab = tab !== 'visao' && tab !== 'briefing'
  return (
    <div>
      <PageHeader
        title="Marca"
        description={
          locked
            ? 'Seu brand kit: logo, paleta, tipografia e tom de voz. Tudo o que a Aura cria parte daqui.'
            : `Brand kit de ${brandName(kit)}. ${approved} de ${SECTIONS.length} partes aprovadas.`
        }
        actions={
          locked ? (
            tab !== 'briefing' && (
              <Button icon={<Sparkles />} onClick={() => setTab('briefing')}>
                Responder o briefing
              </Button>
            )
          ) : (
            <Button
              variant="ghost"
              onClick={() => {
                const before = kit
                reset()
                setTab('visao')
                toast('Brand kit apagado', { description: 'Responda o briefing para começar de novo.', action: { label: 'Desfazer', onClick: () => update(before) } })
              }}
            >
              Começar do zero
            </Button>
          )
        }
      />
      <SegmentedControl<Tab>
        variant="underline"
        kind="tabs"
        aria-label="Partes do brand kit"
        value={tab}
        onChange={setTab}
        className="mb-6"
        options={[
          { value: 'visao', label: 'Visão geral', controls: 'painel-marca' },
          { value: 'briefing', label: 'Briefing', controls: 'painel-marca' },
          ...SECTIONS.map((s) => ({ value: s.id, label: s.label, controls: 'painel-marca', badge: kit.status[s.id] === 'sugerido' ? <span className="size-1.5 rounded-full bg-warning" aria-label="falta aprovar" /> : undefined })),
        ]}
      />
      <div id="painel-marca" role="tabpanel">
        {kitTab && locked ? <NeedsBriefing onGo={() => setTab('briefing')} /> : panels[tab]}
      </div>
    </div>
  )
}
