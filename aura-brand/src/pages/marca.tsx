import { ImagePlus, Plus, Sparkles, Trash2 } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { toast } from 'sonner'
import { SegmentedControl } from '@/components/affect/segmented-control'
import { TagInput } from '@/components/affect/tag-input'
import { TextArea } from '@/components/affect/text-area'
import { TextField } from '@/components/affect/text-field'
import { PageHeader, Section } from '@/components/page'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { brandKit, type BrandColor, type BrandKit, type Tone } from '@/lib/data'
import { useLoaded } from '@/lib/use-loaded'

const TONES: { value: Tone; label: string }[] = [
  { value: 'proximo', label: 'Próximo' },
  { value: 'neutro', label: 'Neutro' },
  { value: 'formal', label: 'Formal' },
]

const TONE_SAMPLE: Record<Tone, string> = {
  proximo: 'Chegou café novo! Torramos ontem e ele já está a caminho da sua casa.',
  neutro: 'Novo lote disponível. Torrado ontem e enviado em até 24 horas.',
  formal: 'Informamos que um novo lote, torrado na data de ontem, encontra-se disponível para envio.',
}

const HEX = /^#[0-9a-f]{6}$/i
type Errors = Partial<Record<'name' | 'description' | 'audience' | 'colors', string>>

function validate(kit: BrandKit): Errors {
  const e: Errors = {}
  if (!kit.name.trim()) e.name = 'Informe o nome da marca.'
  if (kit.description.trim().length < 20) e.description = 'Descreva a marca em pelo menos 20 caracteres.'
  if (!kit.audience.trim()) e.audience = 'Diga para quem a marca vende.'
  if (kit.colors.some((c) => !HEX.test(c.hex))) e.colors = 'Use cores no formato #RRGGBB.'
  else if (kit.colors.length < 3) e.colors = 'Adicione pelo menos 3 cores.'
  return e
}

function Palette({ colors, error, onChange }: { colors: BrandColor[]; error?: string; onChange: (c: BrandColor[]) => void }) {
  const patch = (id: string, next: Partial<BrandColor>) => onChange(colors.map((c) => (c.id === id ? { ...c, ...next } : c)))
  return (
    <Section
      title="Paleta"
      description="As cores que a IA usa nas imagens e nos posts."
      action={
        <Button type="button" variant="outline" className="min-h-11" disabled={colors.length >= 6} onClick={() => onChange([...colors, { id: crypto.randomUUID(), name: 'Nova cor', hex: '#888888' }])}>
          <Plus /> Adicionar cor
        </Button>
      }
    >
      {colors.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">Nenhuma cor ainda. Adicione a primeira ou peça uma sugestão à IA.</p>
      ) : (
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {colors.map((c) => (
            <li key={c.id} className="flex min-w-0 flex-wrap items-end gap-3 rounded-lg border p-3">
              {/* A cor vem do conteúdo da marca do cliente, por isso entra por style e não por token. */}
              <input
                type="color"
                value={HEX.test(c.hex) ? c.hex : '#000000'}
                onChange={(e) => patch(c.id, { hex: e.target.value })}
                aria-label={`Escolher cor: ${c.name}`}
                className="size-11 shrink-0 cursor-pointer rounded-lg border bg-transparent p-0.5"
              />
              <TextField label="Nome" value={c.name} onChange={(e) => patch(c.id, { name: e.target.value })} className="min-w-0 flex-1 basis-32" />
              <TextField label="Hex" value={c.hex} onChange={(e) => patch(c.id, { hex: e.target.value })} error={!HEX.test(c.hex)} className="w-24 shrink-0" />
              <Button type="button" variant="ghost" size="icon" className="size-11 shrink-0" onClick={() => onChange(colors.filter((x) => x.id !== c.id))} aria-label={`Remover cor ${c.name}`}>
                <Trash2 />
              </Button>
            </li>
          ))}
        </ul>
      )}
      {error && (
        <p role="alert" className="mt-3 text-sm text-destructive">
          {error}
        </p>
      )}
    </Section>
  )
}

function Loading() {
  return (
    <div className="grid gap-4" aria-busy="true" aria-label="Carregando brand kit">
      <Skeleton className="h-10 w-72 max-w-full" />
      <Skeleton className="h-64 w-full rounded-xl" />
    </div>
  )
}

export function Marca() {
  const loaded = useLoaded()
  const [kit, setKit] = useState<BrandKit>(brandKit)
  const [errors, setErrors] = useState<Errors>({})
  const [tab, setTab] = useState('identidade')
  const [saving, setSaving] = useState(false)
  const set = <K extends keyof BrandKit>(key: K, value: BrandKit[K]) => setKit((k) => ({ ...k, [key]: value }))

  const save = (e: FormEvent) => {
    e.preventDefault()
    const found = validate(kit)
    setErrors(found)
    if (Object.keys(found).length > 0) {
      setTab(found.colors && Object.keys(found).length === 1 ? 'visual' : 'identidade')
      toast.error('Revise os campos destacados')
      return
    }
    setSaving(true)
    // Protótipo: não há servidor; simula o tempo de gravação.
    window.setTimeout(() => {
      setSaving(false)
      toast.success('Brand kit salvo', { description: 'Os próximos conteúdos já usam esta versão.' })
    }, 700)
  }

  const suggest = () => toast.info('Sugestão com IA ainda não está ligada', { description: 'Neste protótipo, preencha os campos manualmente.' })

  return (
    <form onSubmit={save} noValidate>
      <PageHeader
        title="Brand kit"
        description="A base de tudo o que a IA cria para a sua marca."
        actions={
          <>
            <Button type="button" variant="outline" className="min-h-11" onClick={suggest}>
              <Sparkles /> Sugerir com IA
            </Button>
            <Button type="submit" className="min-h-11" disabled={!loaded || saving}>
              {saving ? 'Salvando…' : 'Salvar'}
            </Button>
          </>
        }
      />
      {!loaded ? (
        <Loading />
      ) : (
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="identidade">Identidade</TabsTrigger>
            <TabsTrigger value="visual">Visual</TabsTrigger>
            <TabsTrigger value="voz">Tom de voz</TabsTrigger>
          </TabsList>

          <TabsContent value="identidade" className="mt-4">
            <Section title="Identidade" description="Quem é a marca e para quem ela vende.">
              <div className="grid gap-4 md:grid-cols-2">
                <TextField label="Nome da marca" value={kit.name} onChange={(e) => set('name', e.target.value)} error={errors.name} size="lg" />
                <TextField label="Segmento" optional value={kit.segment} onChange={(e) => set('segment', e.target.value)} size="lg" />
                <TextArea
                  label="Descrição"
                  hint="O que a marca faz, em uma ou duas frases."
                  value={kit.description}
                  onChange={(e) => set('description', e.target.value)}
                  error={errors.description}
                  maxLength={280}
                  counter
                  minRows={3}
                  className="md:col-span-2"
                />
                <TextArea
                  label="Público"
                  hint="Quem compra de você."
                  value={kit.audience}
                  onChange={(e) => set('audience', e.target.value)}
                  error={errors.audience}
                  minRows={2}
                  className="md:col-span-2"
                />
              </div>
            </Section>
          </TabsContent>

          <TabsContent value="visual" className="mt-4 grid gap-4">
            <Palette colors={kit.colors} error={errors.colors} onChange={(c) => set('colors', c)} />
            <Section title="Tipografia" description="As fontes dos títulos e dos textos.">
              <div className="grid gap-4 md:grid-cols-2">
                <TextField label="Fonte de títulos" value={kit.headingFont} onChange={(e) => set('headingFont', e.target.value)} size="lg" />
                <TextField label="Fonte de textos" value={kit.bodyFont} onChange={(e) => set('bodyFont', e.target.value)} size="lg" />
              </div>
            </Section>
            <Section title="Logo" description="PNG ou SVG com fundo transparente.">
              {kit.hasLogo ? (
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm">Logo enviado.</p>
                  <Button type="button" variant="outline" className="min-h-11" onClick={() => set('hasLogo', false)}>
                    Remover
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed py-8 text-center">
                  <ImagePlus className="size-8 text-muted-foreground" aria-hidden="true" />
                  <p className="text-sm text-muted-foreground">Nenhum logo enviado ainda.</p>
                  {/* Protótipo: marca o logo como enviado, sem upload real. */}
                  <Button type="button" variant="outline" className="min-h-11" onClick={() => set('hasLogo', true)}>
                    Enviar logo
                  </Button>
                </div>
              )}
            </Section>
          </TabsContent>

          <TabsContent value="voz" className="mt-4">
            <Section title="Tom de voz" description="Como a marca fala com o público.">
              <div className="grid gap-5">
                <div className="grid gap-2">
                  <Label id="tom-label">Tom</Label>
                  <SegmentedControl aria-labelledby="tom-label" options={TONES} value={kit.tone} onChange={(v) => set('tone', v)} size="lg" />
                  <p className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Exemplo: </span>
                    {TONE_SAMPLE[kit.tone]}
                  </p>
                </div>
                <TagInput label="Palavras que definem a marca" hint="Pressione Enter para adicionar." value={kit.values} onChange={(v) => set('values', v)} max={8} />
                <TagInput label="Palavras a evitar" optional hint="A IA não usa estas palavras." value={kit.avoid} onChange={(v) => set('avoid', v)} max={8} />
              </div>
            </Section>
          </TabsContent>
        </Tabs>
      )}
    </form>
  )
}
