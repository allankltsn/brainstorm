import { CalendarClock, Sparkles, Trash2 } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { SegmentedControl } from '@/components/affect/segmented-control'
import { TextArea } from '@/components/affect/text-area'
import { ApprovalList } from '@/components/approval-list'
import { PageHeader, Pill, Section } from '@/components/page'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useContent } from '@/lib/content'
import { brandKit, CHANNELS, KIND_COST, KIND_LABEL, numberFmt, type Channel, type ContentItem, type ContentKind, type ContentStatus } from '@/lib/data'
import { useLoaded } from '@/lib/use-loaded'
import { useTab } from '@/lib/use-tab'

const TABS = ['aprovacao', 'ajuste', 'agendado'] as const
const TAB_LABEL: Record<ContentStatus, string> = { aprovacao: 'Para aprovar', ajuste: 'Em ajuste', agendado: 'Agendados' }
const KINDS = (Object.keys(KIND_LABEL) as ContentKind[]).map((value) => ({ value, label: KIND_LABEL[value] }))
const CHANNEL_OPTIONS = CHANNELS.map((value) => ({ value, label: value }))

function Generator() {
  const { generate, creditsLeft } = useContent()
  const [kind, setKind] = useState<ContentKind>('post')
  const [channel, setChannel] = useState<Channel>('Instagram')
  const [topic, setTopic] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const cost = KIND_COST[kind]
  const short = creditsLeft < cost

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (topic.trim().length < 10) {
      setError('Descreva o tema em pelo menos 10 caracteres.')
      return
    }
    setError('')
    setBusy(true)
    // Protótipo: simula o tempo de geração; o texto vem de um modelo fixo, sem IA.
    window.setTimeout(() => {
      setBusy(false)
      const item = generate({ kind, channel, topic })
      if (!item) {
        toast.error('Créditos insuficientes', { description: 'Escolha um formato mais leve ou aguarde a renovação.' })
        return
      }
      setTopic('')
      toast.success('Sugestão pronta', { description: 'Ela está na aba Para aprovar.' })
    }, 900)
  }

  return (
    <Section title="Gerar com IA" description={`Usa o brand kit de ${brandKit.name}: paleta, tom de voz e palavras da marca.`}>
      <form onSubmit={submit} noValidate className="grid gap-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <Label id="formato-label">Formato</Label>
            <SegmentedControl aria-labelledby="formato-label" options={KINDS} value={kind} onChange={setKind} size="lg" fullWidth />
          </div>
          <div className="grid gap-2">
            <Label id="canal-label">Canal</Label>
            <SegmentedControl aria-labelledby="canal-label" options={CHANNEL_OPTIONS} value={channel} onChange={setChannel} size="lg" fullWidth />
          </div>
        </div>
        <TextArea
          label="Tema"
          hint="Sobre o que é o conteúdo. Ex.: lançamento do lote novo, com frete grátis esta semana."
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          error={error}
          maxLength={300}
          counter
          minRows={3}
        />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground" aria-live="polite">
            Custa {cost} créditos. Você tem {numberFmt.format(creditsLeft)}.{short && <span className="text-destructive"> Saldo insuficiente para este formato.</span>}
          </p>
          <Button type="submit" className="min-h-11" disabled={busy || short}>
            <Sparkles /> {busy ? 'Gerando…' : 'Gerar sugestão'}
          </Button>
        </div>
      </form>
    </Section>
  )
}

function ItemList({ items, empty }: { items: ContentItem[]; empty: string }) {
  const { remove } = useContent()
  if (items.length === 0) return <p className="py-8 text-center text-sm text-muted-foreground">{empty}</p>
  return (
    <ul className="grid gap-3">
      {items.map((i) => (
        <li key={i.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3">
          <div className="min-w-0 flex-1 basis-64">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-medium">{i.title}</p>
              <Pill>{KIND_LABEL[i.kind]}</Pill>
              <Pill>{i.channel}</Pill>
              {i.when && (
                <Pill tone="info" icon={<CalendarClock aria-hidden="true" />}>
                  {i.when}
                </Pill>
              )}
            </div>
            <p className="mt-0.5 text-sm text-muted-foreground">{i.caption}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="size-11"
            aria-label={`Excluir: ${i.title}`}
            onClick={() => {
              remove(i.id)
              toast.success('Conteúdo excluído')
            }}
          >
            <Trash2 />
          </Button>
        </li>
      ))}
    </ul>
  )
}

export function Conteudo() {
  const loaded = useLoaded()
  const { items } = useContent()
  const [tab, setTab] = useTab(TABS)
  const by = (status: ContentStatus) => items.filter((i) => i.status === status)

  return (
    <>
      <PageHeader
        title="Conteúdo"
        description="Gere sugestões a partir do brand kit e aprove antes de publicar."
        actions={
          <Button asChild variant="outline" className="min-h-11">
            <Link to="/marca">Ver brand kit</Link>
          </Button>
        }
      />
      <div className="grid gap-4">
        <Generator />
        <Section title="Seus conteúdos" description="A IA só sugere. Nada é publicado sem a sua aprovação.">
          {!loaded ? (
            <div className="grid gap-3" aria-busy="true" aria-label="Carregando conteúdos">
              <Skeleton className="h-9 w-72 max-w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : (
            <Tabs value={tab} onValueChange={(t) => setTab(t as ContentStatus)}>
              <TabsList className="max-w-full overflow-x-auto">
                {TABS.map((t) => (
                  <TabsTrigger key={t} value={t}>
                    {TAB_LABEL[t]} ({by(t).length})
                  </TabsTrigger>
                ))}
              </TabsList>
              <TabsContent value="aprovacao" className="mt-4">
                <ApprovalList />
              </TabsContent>
              <TabsContent value="ajuste" className="mt-4">
                <ItemList items={by('ajuste')} empty="Nenhum conteúdo em ajuste. Os que você devolver aparecem aqui." />
              </TabsContent>
              <TabsContent value="agendado" className="mt-4">
                <ItemList items={by('agendado')} empty="Nada agendado ainda. Aprove uma sugestão para ela entrar aqui." />
              </TabsContent>
            </Tabs>
          )}
        </Section>
      </div>
    </>
  )
}
