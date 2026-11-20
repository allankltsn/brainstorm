import { ArrowLeft, CalendarClock, Check, ChevronLeft, ChevronRight, CircleAlert, RefreshCw, Send, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/affect/button'
import { SegmentedControl } from '@/components/affect/segmented-control'
import { Select } from '@/components/affect/select'
import { TagInput } from '@/components/affect/tag-input'
import { TextArea } from '@/components/affect/text-area'
import { TextField } from '@/components/affect/text-field'
import { ThinkingLoader } from '@/components/affect/thinking-loader'
import { PostPreview } from '@/components/brand-preview'
import { PageHeader, Pill, Section } from '@/components/page'
import { SECTIONS, useBrand } from '@/lib/brand'
import { approvedKit, channelOf, CHANNELS, draftFrom, formatOf, FORMATS, GOALS, networkProblem, NOW, useContent, whenLabel, type Channel, type ContentItem, type Format, type Goal } from '@/lib/content'
import { cn } from '@/lib/utils'

const TABS = ['criar', 'fila', 'agenda', 'publicados'] as const
type Tab = (typeof TABS)[number]

const GEN_COST = 5

/* Aviso do que ainda sai neutro: a Aura só usa as partes do kit que foram aprovadas. */
function KitNotice() {
  const { kit } = useBrand()
  const missing = SECTIONS.filter((s) => kit.status[s.id] !== 'aprovado')
  if (missing.length === 0) return null
  const names = missing.map((s) => s.label.toLowerCase())
  const list = names.length > 1 ? `${names.slice(0, -1).join(', ')} e ${names[names.length - 1]}` : names[0]
  return (
    <div role="note" className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-warning-soft px-4 py-3 text-sm text-warning">
      <p className="min-w-0 flex-1 basis-64">
        Falta aprovar: {list}. Até lá, os rascunhos usam visual e tom neutros nessas partes.
      </p>
      <Link to="/marca" className="font-medium underline underline-offset-4">
        Revisar a marca
      </Link>
    </div>
  )
}

function Create({ onCreated }: { onCreated: (item: ContentItem) => void }) {
  const { kit } = useBrand()
  const { add } = useContent()
  const [format, setFormat] = useState<Format>('post')
  const [channel, setChannel] = useState<Channel>('instagram')
  const [goal, setGoal] = useState<Goal>('novidade')
  const [topic, setTopic] = useState('')
  const [tried, setTried] = useState(false)
  const [busy, setBusy] = useState(false)
  const empty = topic.trim().length < 3
  const preview = approvedKit(kit)

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Section title="Novo rascunho" description="Diga o assunto. A Aura escreve no tom da marca e você revisa antes de agendar." className="min-w-0 lg:col-span-3">
        {busy ? (
          <ThinkingLoader phases={['Lendo o brand kit', 'Escrevendo a legenda', 'Montando a arte']} interval={650} />
        ) : (
          <form
            className="grid gap-5"
            noValidate
            onSubmit={(e) => {
              e.preventDefault()
              setTried(true)
              if (empty) return
              setBusy(true)
              setTimeout(() => {
                const item = add(draftFrom({ format, channel, goal, topic }, kit))
                setBusy(false)
                setTopic('')
                setTried(false)
                toast.success('Rascunho criado', { description: 'Está na fila de aprovação. Nada é publicado sem você aprovar.' })
                onCreated(item)
              }, 2000)
            }}
          >
            <div className="grid gap-2">
              <span id="formato-label" className="text-sm font-medium">
                Formato
              </span>
              <SegmentedControl<Format> aria-labelledby="formato-label" fullWidth value={format} onChange={setFormat} options={FORMATS} />
            </div>
            <Select label="Rede" options={CHANNELS.map((c) => ({ value: c.value, label: c.label, description: c.note }))} value={channel} onChange={(v) => setChannel(v as Channel)} hint={channelOf(channel).note} />
            <Select label="Objetivo" options={GOALS} value={goal} onChange={(v) => setGoal(v as Goal)} />
            <TextArea
              label="Assunto"
              hint="Ex.: novo blend de inverno, oficina de sábado, kit presente de fim de ano."
              minRows={2}
              maxLength={160}
              counter
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              error={tried && empty ? 'Escreva o assunto do post, com pelo menos 3 letras.' : undefined}
            />
            <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-4">
              <p className="text-xs text-muted-foreground">Criar um rascunho usa {GEN_COST} créditos de IA.</p>
              <Button type="submit" icon={<Sparkles />}>
                Criar rascunho
              </Button>
            </div>
          </form>
        )}
      </Section>
      <div className="min-w-0 lg:col-span-2">
        <h2 className="mb-3 text-sm font-semibold">Como a marca aparece hoje</h2>
        <PostPreview kit={preview} headline={topic.trim() ? topic.trim()[0].toUpperCase() + topic.trim().slice(1) : undefined} />
      </div>
    </div>
  )
}

const WHEN_PREFIX = { fila: 'Sugerido para', agendado: 'Agendado para', publicado: 'Publicado em', falhou: 'Era para sair em' } as const

function ItemRow({ item, action, note }: { item: ContentItem; action: React.ReactNode; note?: React.ReactNode }) {
  return (
    <li className="flex flex-wrap items-center gap-x-4 gap-y-2.5 px-2 py-3.5">
      <div className="min-w-0 flex-1 basis-64">
        <p className="flex flex-wrap items-center gap-2 text-sm font-medium">
          {item.headline}
          <Pill tone="brand">
            {formatOf(item.format).label} para {channelOf(item.channel).label}
          </Pill>
          {note}
        </p>
        <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
          <CalendarClock className="size-3.5" aria-hidden="true" />
          {WHEN_PREFIX[item.status]} {whenLabel(item.publishedAt ?? item.when)}
        </p>
      </div>
      <div className="flex gap-1">{action}</div>
    </li>
  )
}

function Queue({ onOpen, onCreate }: { onOpen: (id: string) => void; onCreate: () => void }) {
  const { queue, remove, restore } = useContent()
  if (queue.length === 0)
    return (
      <Section title="Fila de aprovação">
        <div className="flex flex-col items-center gap-1.5 py-8 text-center">
          <span className="flex size-10 items-center justify-center rounded-full bg-success-soft text-success">
            <Check className="size-5" />
          </span>
          <p className="font-medium">Nenhum rascunho na fila</p>
          <p className="mb-3 max-w-sm text-sm text-muted-foreground">Os rascunhos que a Aura cria aparecem aqui para você revisar e aprovar.</p>
          <Button icon={<Sparkles />} onClick={onCreate}>
            Criar rascunho
          </Button>
        </div>
      </Section>
    )
  return (
    <Section title="Fila de aprovação" description="Revise o texto e a arte. Só o que você aprovar é agendado.">
      <ul className="-mx-2 divide-y">
        {queue.map((item) => (
          <ItemRow
            key={item.id}
            item={item}
            action={
              <>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    remove(item.id)
                    toast(`"${item.headline}" foi descartado`, { action: { label: 'Desfazer', onClick: () => restore(item) } })
                  }}
                >
                  Descartar
                </Button>
                <Button size="sm" variant="secondary" onClick={() => onOpen(item.id)}>
                  Revisar
                </Button>
              </>
            }
          />
        ))}
      </ul>
    </Section>
  )
}

/* Publica na hora e avisa o resultado. Se a rede não estiver pronta, o aviso leva até Redes. */
function usePublish() {
  const { publish } = useContent()
  const navigate = useNavigate()
  return (item: ContentItem) => {
    const before = item.status
    const problem = publish(item.id)
    if (problem) toast.error(`Não deu para publicar "${item.headline}"`, { description: `${problem} Conecte a rede e tente de novo.`, action: { label: 'Abrir redes', onClick: () => navigate('/configuracoes?aba=redes') } })
    else toast.success(`Publicado no ${channelOf(item.channel).label}`, { description: before === 'agendado' ? 'Saiu antes do horário agendado.' : undefined, action: { label: 'Ver publicados', onClick: () => navigate('/conteudo?aba=publicados') } })
    return problem
  }
}

/* O que não saiu: motivo em texto e o próximo passo. */
function FailedList({ onOpen }: { onOpen: (id: string) => void }) {
  const { failed, networks } = useContent()
  const publishNow = usePublish()
  if (failed.length === 0) return null
  return (
    <section aria-labelledby="falhas-titulo" className="mb-6 rounded-xl border border-destructive/30 bg-destructive/5 px-5 py-4">
      <h2 id="falhas-titulo" className="flex items-center gap-2 text-sm font-semibold text-destructive">
        <CircleAlert className="size-4" aria-hidden="true" />
        {failed.length === 1 ? '1 post não foi publicado' : `${failed.length} posts não foram publicados`}
      </h2>
      <ul className="mt-2 divide-y divide-destructive/15">
        {failed.map((item) => {
          const problem = networkProblem(item.channel, networks)
          return (
            <li key={item.id} className="flex flex-wrap items-center gap-x-4 gap-y-2.5 py-3">
              <div className="min-w-0 flex-1 basis-64">
                <p className="text-sm font-medium">{item.headline}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {formatOf(item.format).label} para {channelOf(item.channel).label}, era para sair em {whenLabel(item.when)}. {problem ?? 'A rede já está conectada: é só publicar.'}
                </p>
              </div>
              <div className="flex gap-1">
                <Button size="sm" variant="ghost" onClick={() => onOpen(item.id)}>
                  Ver
                </Button>
                {problem ? (
                  <Link to="/configuracoes?aba=redes" className="inline-flex h-8 items-center rounded-lg border bg-background px-3 text-sm font-medium outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring">
                    Conectar {channelOf(item.channel).label}
                  </Link>
                ) : (
                  <Button size="sm" variant="secondary" icon={<Send />} onClick={() => publishNow(item)}>
                    Publicar agora
                  </Button>
                )}
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const CHIP = {
  agendado: 'bg-brand-soft text-brand-text',
  publicado: 'bg-success-soft text-success',
  falhou: 'bg-destructive/10 text-destructive',
  fila: 'bg-muted text-muted-foreground',
} as const
const CHIP_WORD = { agendado: 'agendado', publicado: 'publicado', falhou: 'não publicado', fila: 'na fila' } as const
const pad = (n: number) => String(n).padStart(2, '0')

function Agenda({ onOpen, onCreate }: { onOpen: (id: string) => void; onCreate: () => void }) {
  const { scheduled, published, failed, networks, patch } = useContent()
  const [month, setMonth] = useState(NOW.slice(0, 7))
  const [y, m] = month.split('-').map(Number)
  const first = new Date(y, m - 1, 1)
  const days = new Date(y, m, 0).getDate()
  const title = first.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
  const shift = (d: number) => {
    const n = new Date(y, m - 1 + d, 1)
    setMonth(`${n.getFullYear()}-${pad(n.getMonth() + 1)}`)
  }
  const onCalendar = [...scheduled, ...published, ...failed]
  const byDay = (day: number) => onCalendar.filter((i) => (i.publishedAt ?? i.when).startsWith(`${month}-${pad(day)}`)).sort((a, b) => a.when.localeCompare(b.when))
  const cells: (number | null)[] = [...Array<null>(first.getDay()).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)]
  const today = NOW.slice(0, 10)
  const blockedCount = scheduled.filter((i) => networkProblem(i.channel, networks)).length

  return (
    <>
      <FailedList onOpen={onOpen} />
      {blockedCount > 0 && (
        <div role="note" className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-warning-soft px-4 py-3 text-sm text-warning">
          <p className="min-w-0 flex-1 basis-64">
            {blockedCount === 1 ? '1 post agendado é de uma rede que não está conectada' : `${blockedCount} posts agendados são de redes que não estão conectadas`}. Sem conectar, eles não saem no horário.
          </p>
          <Link to="/configuracoes?aba=redes" className="font-medium underline underline-offset-4">
            Abrir redes
          </Link>
        </div>
      )}

      <Section
        title="Calendário"
        description="Agendados, publicados e o que não saiu. Toque num post para abrir."
        className="mb-6 hidden md:block"
        action={
          <div className="flex items-center gap-1">
            <Button size="sm" variant="ghost" aria-label="Mês anterior" onClick={() => shift(-1)}>
              <ChevronLeft className="size-4" />
            </Button>
            <span className="min-w-36 text-center text-sm font-medium first-letter:uppercase" aria-live="polite">
              {title}
            </span>
            <Button size="sm" variant="ghost" aria-label="Próximo mês" onClick={() => shift(1)}>
              <ChevronRight className="size-4" />
            </Button>
          </div>
        }
      >
        <div className="grid grid-cols-7 overflow-hidden rounded-lg border text-sm" role="grid" aria-label={`Calendário de ${title}`}>
          {WEEKDAYS.map((d) => (
            <div key={d} role="columnheader" className="border-b bg-muted/50 px-2 py-1.5 text-xs font-medium text-muted-foreground">
              {d}
            </div>
          ))}
          {cells.map((day, i) => {
            const date = day ? `${month}-${pad(day)}` : ''
            const list = day ? byDay(day) : []
            return (
              <div key={i} role="gridcell" className={cn('min-h-24 min-w-0 border-b border-l p-1.5 [&:nth-child(7n+1)]:border-l-0', !day && 'bg-muted/30', date && date < today && 'bg-muted/20')}>
                {day && (
                  <>
                    <span className={cn('mb-1 inline-flex size-6 items-center justify-center rounded-full text-xs tabular-nums', date === today ? 'bg-primary font-semibold text-primary-foreground' : 'text-muted-foreground')}>
                      {day}
                      {date === today && <span className="sr-only"> (hoje)</span>}
                    </span>
                    <ul className="grid min-w-0 gap-1">
                      {list.map((item) => (
                        <li key={item.id} className="min-w-0">
                          <button
                            type="button"
                            onClick={() => onOpen(item.id)}
                            aria-label={`${item.headline}, ${formatOf(item.format).label} para ${channelOf(item.channel).label}, ${CHIP_WORD[item.status]}, ${whenLabel(item.publishedAt ?? item.when)}`}
                            className={cn('flex w-full min-w-0 items-center gap-1 rounded-md px-1.5 py-1 text-left text-xs font-medium outline-none hover:brightness-95 focus-visible:ring-2 focus-visible:ring-ring', CHIP[item.status])}
                          >
                            {item.status === 'publicado' && <Check className="size-3 shrink-0" aria-hidden="true" />}
                            {item.status === 'falhou' && <CircleAlert className="size-3 shrink-0" aria-hidden="true" />}
                            <span className="shrink-0 tabular-nums">{(item.publishedAt ?? item.when).slice(11, 16)}</span>
                            <span className="min-w-0 truncate">{item.headline}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            )
          })}
        </div>
        <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-brand-soft ring-1 ring-brand-text/40" /> Agendado</span>
          <span className="inline-flex items-center gap-1.5"><Check className="size-3 text-success" aria-hidden="true" /> Publicado</span>
          <span className="inline-flex items-center gap-1.5"><CircleAlert className="size-3 text-destructive" aria-hidden="true" /> Não publicado</span>
        </p>
      </Section>

      <Section title="Próximos posts" description="Aprovados por você, em ordem de data.">
        {scheduled.length === 0 ? (
          <div className="flex flex-col items-center gap-1.5 py-6 text-center">
            <p className="font-medium">Nada agendado</p>
            <p className="mb-3 max-w-sm text-sm text-muted-foreground">Aprove um rascunho da fila e ele aparece aqui, com data e hora.</p>
            <Button variant="secondary" icon={<Sparkles />} onClick={onCreate}>
              Criar rascunho
            </Button>
          </div>
        ) : (
          <ul className="-mx-2 divide-y">
            {scheduled.map((item) => {
              const problem = networkProblem(item.channel, networks)
              return (
                <ItemRow
                  key={item.id}
                  item={item}
                  note={problem ? <Pill tone="warning">{problem.replace(/\.$/, '')}</Pill> : undefined}
                  action={
                    <>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          patch(item.id, { status: 'fila' })
                          toast(`"${item.headline}" voltou para a fila`, { action: { label: 'Desfazer', onClick: () => patch(item.id, { status: 'agendado' }) } })
                        }}
                      >
                        Voltar para a fila
                      </Button>
                      <Button size="sm" variant="secondary" onClick={() => onOpen(item.id)}>
                        Abrir
                      </Button>
                    </>
                  }
                />
              )
            })}
          </ul>
        )}
      </Section>
    </>
  )
}

function Published({ onOpen }: { onOpen: (id: string) => void }) {
  const { published } = useContent()
  if (published.length === 0)
    return (
      <Section title="Publicados">
        <p className="py-6 text-center text-sm text-muted-foreground">Nada publicado ainda. Os posts aparecem aqui depois que saem nas redes.</p>
      </Section>
    )
  return (
    <Section title="Publicados" description="O que já saiu nas redes, do mais recente ao mais antigo.">
      <ul className="-mx-2 divide-y">
        {published.map((item) => (
          <ItemRow
            key={item.id}
            item={item}
            action={
              <Button size="sm" variant="secondary" onClick={() => onOpen(item.id)}>
                Ver
              </Button>
            }
          />
        ))}
      </ul>
    </Section>
  )
}

const BACK_LABEL = { fila: 'Voltar para a fila', agendado: 'Voltar para a agenda', falhou: 'Voltar para a agenda', publicado: 'Voltar para os publicados' } as const
const STATUS_PILL = {
  fila: <Pill tone="warning">Falta aprovar</Pill>,
  agendado: (
    <Pill tone="brand" icon={<CalendarClock />}>
      Agendado
    </Pill>
  ),
  publicado: (
    <Pill tone="success" icon={<Check />}>
      Publicado
    </Pill>
  ),
  falhou: (
    <Pill tone="danger" icon={<CircleAlert />}>
      Não publicado
    </Pill>
  ),
} as const
const EDITOR_NOTE: Record<ContentItem['status'], (i: ContentItem) => string> = {
  fila: () => 'Ajuste o que quiser. A prévia ao lado muda junto.',
  agendado: (i) => `Agendado para ${whenLabel(i.when)}. Para editar, volte o post para a fila.`,
  falhou: (i) => `Era para sair em ${whenLabel(i.when)}. ${i.failure ?? ''}`,
  publicado: () => 'Este post já saiu. O conteúdo fica só para consulta.',
}

function Editor({ item, onBack }: { item: ContentItem; onBack: () => void }) {
  const { kit } = useBrand()
  const { patch, remove, restore, networks } = useContent()
  const publishNow = usePublish()
  const problem = networkProblem(item.channel, networks)
  const [slide, setSlide] = useState(0)
  const [busy, setBusy] = useState(false)
  const channel = channelOf(item.channel)
  const locked = item.status !== 'fila'
  const carousel = item.format === 'carrossel'
  const current = Math.min(slide, Math.max(item.slides.length - 1, 0))
  const past = !item.when || item.when < NOW
  const tooLong = item.caption.length > channel.limit
  const blocked = !item.headline.trim() || !item.caption.trim() || tooLong || past
  const set = (p: Partial<ContentItem>) => patch(item.id, p)
  const setSlideField = (field: 'title' | 'text', value: string) => {
    const slides = item.slides.map((s, i) => (i === current ? { ...s, [field]: value } : s))
    set({ slides, ...(current === 0 && field === 'title' ? { headline: value } : {}) })
  }

  return (
    <>
      <button type="button" onClick={onBack} className="mb-4 inline-flex items-center gap-1.5 rounded-md text-sm font-medium text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring">
        <ArrowLeft className="size-4" />
        {BACK_LABEL[item.status]}
      </button>
      <div className="grid gap-6 lg:grid-cols-5">
        <Section
          title={`${formatOf(item.format).label} para ${channel.label}`}
          description={EDITOR_NOTE[item.status](item)}
          className="min-w-0 lg:col-span-3"
          action={STATUS_PILL[item.status]}
        >
          {locked && item.status !== 'publicado' && problem && (
            <div role="note" className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-warning-soft px-3.5 py-2.5 text-sm text-warning">
              <p className="min-w-0 flex-1 basis-56">{problem} Sem conectar, o post não sai.</p>
              <Link to="/configuracoes?aba=redes" className="font-medium underline underline-offset-4">
                Conectar {channel.label}
              </Link>
            </div>
          )}
          <fieldset disabled={locked || busy} className="grid gap-5 disabled:opacity-70">
            <legend className="sr-only">Conteúdo do rascunho</legend>
            {carousel ? (
              <div className="grid gap-4 rounded-lg border p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium" aria-live="polite">
                    Tela {current + 1} de {item.slides.length}
                  </span>
                  <span className="flex gap-1">
                    <Button type="button" size="sm" variant="secondary" disabled={current === 0} onClick={() => setSlide(current - 1)}>
                      Anterior
                    </Button>
                    <Button type="button" size="sm" variant="secondary" disabled={current === item.slides.length - 1} onClick={() => setSlide(current + 1)}>
                      Próxima
                    </Button>
                  </span>
                </div>
                <TextField label="Título da tela" maxLength={60} counter value={item.slides[current]?.title ?? ''} onChange={(e) => setSlideField('title', e.target.value)} />
                <TextArea label="Texto da tela" minRows={2} maxLength={140} counter value={item.slides[current]?.text ?? ''} onChange={(e) => setSlideField('text', e.target.value)} />
              </div>
            ) : (
              <TextField
                label="Título na arte"
                hint="A frase grande da imagem."
                maxLength={60}
                counter
                value={item.headline}
                onChange={(e) => set({ headline: e.target.value })}
                error={!item.headline.trim() ? 'Escreva o título da arte.' : undefined}
              />
            )}
            <TextArea
              label="Legenda"
              hint={`Até ${channel.limit.toLocaleString('pt-BR')} caracteres no ${channel.label}.`}
              minRows={5}
              maxRows={12}
              counter
              maxLength={channel.limit}
              value={item.caption}
              onChange={(e) => set({ caption: e.target.value })}
              error={!item.caption.trim() ? 'Escreva a legenda.' : tooLong ? `A legenda passa do limite do ${channel.label}. Encurte o texto.` : undefined}
            />
            {item.channel !== 'facebook' && (
              <TagInput
                label="Hashtags"
                optional
                hint="Até 5. Enter adiciona."
                placeholder="Adicionar hashtag"
                max={5}
                normalize={(t) => '#' + t.trim().replace(/^#+/, '').replace(/\s+/g, '')}
                value={item.hashtags}
                onChange={(hashtags) => set({ hashtags })}
              />
            )}
            <TextField
              label="Publicar em"
              type="datetime-local"
              min={NOW}
              value={item.when}
              onChange={(e) => set({ when: e.target.value })}
              error={past ? 'Escolha uma data e hora no futuro.' : undefined}
              className="max-w-xs"
            />
          </fieldset>
          <div className="mt-6 flex flex-wrap items-center justify-end gap-2 border-t pt-4">
            {item.status === 'publicado' ? (
              <p className="mr-auto text-sm text-muted-foreground">Publicado no {channel.label} em {whenLabel(item.publishedAt ?? item.when)}.</p>
            ) : locked ? (
              <>
                <Button
                  variant="secondary"
                  onClick={() => {
                    set({ status: 'fila', failure: undefined })
                    toast('Voltou para a fila', { description: 'Edite e aprove de novo para agendar.' })
                  }}
                >
                  Voltar para a fila
                </Button>
                <Button icon={<Send />} onClick={() => publishNow(item)}>
                  Publicar agora
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  disabled={busy}
                  onClick={() => {
                    remove(item.id)
                    onBack()
                    toast(`"${item.headline}" foi descartado`, { action: { label: 'Desfazer', onClick: () => restore(item) } })
                  }}
                >
                  Descartar
                </Button>
                <Button
                  variant="secondary"
                  icon={<RefreshCw />}
                  loading={busy}
                  onClick={() => {
                    setBusy(true)
                    setTimeout(() => {
                      const before = item
                      set(draftFrom({ ...item, version: item.version + 1 }, kit))
                      setSlide(0)
                      setBusy(false)
                      toast('Nova versão criada', { description: `Usou ${GEN_COST} créditos de IA.`, action: { label: 'Voltar à anterior', onClick: () => restore(before) } })
                    }, 1400)
                  }}
                >
                  {busy ? 'Criando' : 'Criar outra versão'}
                </Button>
                <Button
                  disabled={blocked || busy}
                  onClick={() => {
                    set({ status: 'agendado' })
                    onBack()
                    toast.success(`Aprovado e agendado para ${whenLabel(item.when)}`, { description: problem ? `${problem} Conecte a rede para o post sair no horário.` : undefined, action: { label: 'Desfazer', onClick: () => set({ status: 'fila' }) } })
                  }}
                >
                  Aprovar e agendar
                </Button>
              </>
            )}
          </div>
        </Section>
        <div className="min-w-0 lg:col-span-2">
          <h2 className="mb-3 text-sm font-semibold">Prévia</h2>
          <PostPreview
            kit={approvedKit(kit)}
            headline={item.headline || 'Título da arte'}
            caption={item.caption}
            hashtags={item.hashtags}
            slides={carousel ? item.slides : undefined}
            slide={current}
            onSlide={setSlide}
          />
        </div>
      </div>
    </>
  )
}

export function Conteudo() {
  const { kit } = useBrand()
  const { items, queue, scheduled, failed } = useContent()
  const [params, setParams] = useSearchParams()
  const raw = params.get('aba') as Tab | null
  const tab: Tab = raw && TABS.includes(raw) ? raw : 'criar'
  const open = items.find((i) => i.id === params.get('id'))
  const go = (t: Tab, id?: string) => setParams({ ...(t === 'criar' ? {} : { aba: t }), ...(id ? { id } : {}) }, { replace: !id })

  if (!kit.briefingDone)
    return (
      <>
        <PageHeader title="Conteúdo" description="Posts e carrosséis escritos pela Aura a partir do seu brand kit." />
        <Section title="Primeiro, o brand kit" description="A Aura precisa conhecer a marca para escrever no tom certo. O briefing leva cinco respostas.">
          <Link to="/marca?aba=briefing" className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground outline-none hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
            <Sparkles className="size-4" aria-hidden="true" />
            Responder o briefing
          </Link>
        </Section>
      </>
    )

  return (
    <>
      <PageHeader
        title="Conteúdo"
        description={`${queue.length === 0 ? 'Nenhum rascunho espera' : queue.length === 1 ? '1 rascunho espera' : `${queue.length} rascunhos esperam`} a sua aprovação. ${scheduled.length} ${scheduled.length === 1 ? 'agendado' : 'agendados'}${failed.length ? `, ${failed.length} não ${failed.length === 1 ? 'publicado' : 'publicados'}` : ''}.`}
        actions={
          tab !== 'criar' &&
          !open && (
            <Button icon={<Sparkles />} onClick={() => go('criar')}>
              Criar rascunho
            </Button>
          )
        }
      />
      {open ? (
        <Editor key={open.id} item={open} onBack={() => go(open.status === 'fila' ? 'fila' : open.status === 'publicado' ? 'publicados' : 'agenda')} />
      ) : (
        <>
          <SegmentedControl<Tab>
            variant="underline"
            kind="tabs"
            aria-label="Seções de conteúdo"
            value={tab}
            onChange={(t) => go(t)}
            className="mb-6"
            options={[
              { value: 'criar', label: 'Criar', controls: 'painel-conteudo' },
              { value: 'fila', label: 'Fila de aprovação', count: queue.length || undefined, controls: 'painel-conteudo' },
              { value: 'agenda', label: 'Agenda', count: scheduled.length + failed.length || undefined, controls: 'painel-conteudo' },
              { value: 'publicados', label: 'Publicados', controls: 'painel-conteudo' },
            ]}
          />
          <div id="painel-conteudo" role="tabpanel">
            {tab === 'criar' && (
              <>
                <KitNotice />
                <Create onCreated={(item) => go('fila', item.id)} />
              </>
            )}
            {tab === 'fila' && <Queue onOpen={(id) => go('fila', id)} onCreate={() => go('criar')} />}
            {tab === 'agenda' && <Agenda onOpen={(id) => go('agenda', id)} onCreate={() => go('criar')} />}
            {tab === 'publicados' && <Published onOpen={(id) => go('publicados', id)} />}
          </div>
        </>
      )}
    </>
  )
}
