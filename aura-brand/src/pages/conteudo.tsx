import { ArrowLeft, CalendarClock, Check, RefreshCw, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
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
import { approvedKit, channelOf, CHANNELS, draftFrom, formatOf, FORMATS, GOALS, NOW, useContent, whenLabel, type Channel, type ContentItem, type Format, type Goal } from '@/lib/content'

const TABS = ['criar', 'fila', 'agendados'] as const
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

function ItemRow({ item, action }: { item: ContentItem; action: React.ReactNode }) {
  return (
    <li className="flex flex-wrap items-center gap-x-4 gap-y-2.5 px-2 py-3.5">
      <div className="min-w-0 flex-1 basis-64">
        <p className="flex flex-wrap items-center gap-2 text-sm font-medium">
          {item.headline}
          <Pill tone="brand">
            {formatOf(item.format).label} para {channelOf(item.channel).label}
          </Pill>
        </p>
        <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
          <CalendarClock className="size-3.5" aria-hidden="true" />
          {item.status === 'agendado' ? 'Agendado para' : 'Sugerido para'} {whenLabel(item.when)}
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

function Scheduled({ onOpen }: { onOpen: (id: string) => void }) {
  const { scheduled, patch } = useContent()
  if (scheduled.length === 0)
    return (
      <Section title="Agendados">
        <p className="py-6 text-center text-sm text-muted-foreground">Nada agendado. Aprove um rascunho da fila para ele aparecer aqui.</p>
      </Section>
    )
  return (
    <Section title="Agendados" description="Aprovados por você, em ordem de data. A publicação nas redes entra na próxima etapa do produto.">
      <ul className="-mx-2 divide-y">
        {scheduled.map((item) => (
          <ItemRow
            key={item.id}
            item={item}
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
                  Ver
                </Button>
              </>
            }
          />
        ))}
      </ul>
    </Section>
  )
}

function Editor({ item, onBack }: { item: ContentItem; onBack: () => void }) {
  const { kit } = useBrand()
  const { patch, remove, restore } = useContent()
  const [slide, setSlide] = useState(0)
  const [busy, setBusy] = useState(false)
  const channel = channelOf(item.channel)
  const locked = item.status === 'agendado'
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
        {locked ? 'Voltar para os agendados' : 'Voltar para a fila'}
      </button>
      <div className="grid gap-6 lg:grid-cols-5">
        <Section
          title={`${formatOf(item.format).label} para ${channel.label}`}
          description={locked ? `Agendado para ${whenLabel(item.when)}. Para editar, volte o post para a fila.` : 'Ajuste o que quiser. A prévia ao lado muda junto.'}
          className="min-w-0 lg:col-span-3"
          action={locked ? <Pill tone="success" icon={<Check />}>Agendado</Pill> : <Pill tone="warning">Falta aprovar</Pill>}
        >
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
            {locked ? (
              <Button
                variant="secondary"
                onClick={() => {
                  set({ status: 'fila' })
                  toast('Voltou para a fila', { description: 'Edite e aprove de novo para agendar.' })
                }}
              >
                Voltar para a fila
              </Button>
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
                    toast.success(`Aprovado e agendado para ${whenLabel(item.when)}`, { action: { label: 'Desfazer', onClick: () => set({ status: 'fila' }) } })
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
  const { items, queue, scheduled } = useContent()
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
        description={`${queue.length === 0 ? 'Nenhum rascunho espera' : queue.length === 1 ? '1 rascunho espera' : `${queue.length} rascunhos esperam`} a sua aprovação. ${scheduled.length} ${scheduled.length === 1 ? 'agendado' : 'agendados'}.`}
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
        <Editor key={open.id} item={open} onBack={() => go(open.status === 'agendado' ? 'agendados' : 'fila')} />
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
              { value: 'agendados', label: 'Agendados', count: scheduled.length || undefined, controls: 'painel-conteudo' },
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
            {tab === 'agendados' && <Scheduled onOpen={(id) => go('agendados', id)} />}
          </div>
        </>
      )}
    </>
  )
}
