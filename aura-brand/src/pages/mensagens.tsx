import { ArrowLeft, Megaphone, Plus, Send, Sparkles } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { toast } from 'sonner'
import { Select } from '@/components/affect/select'
import { TextArea } from '@/components/affect/text-area'
import { TextField } from '@/components/affect/text-field'
import { PageHeader, Person, Pill, Section } from '@/components/page'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useCrm } from '@/lib/crm'
import { CAMPAIGN_LABEL, STAGE_LABEL, STAGES, type Campaign, type CampaignStatus, type Conversation } from '@/lib/crm-data'
import { brandKit, firstName, numberFmt } from '@/lib/data'
import { useLoaded } from '@/lib/use-loaded'
import { useTab } from '@/lib/use-tab'
import { cn } from '@/lib/utils'

const TABS = ['conversas', 'campanhas'] as const

function ConversationList({ current, onSelect }: { current: string | null; onSelect: (id: string) => void }) {
  const { conversations } = useCrm()
  return (
    <ul className="grid grid-cols-1 gap-1">
      {conversations.map((c) => {
        const last = c.messages[c.messages.length - 1]
        return (
          <li key={c.id}>
            <button
              type="button"
              onClick={() => onSelect(c.id)}
              aria-current={current === c.id ? 'true' : undefined}
              className={cn(
                'flex min-h-11 w-full items-start gap-3 rounded-lg p-3 text-left outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring',
                current === c.id && 'bg-muted',
              )}
            >
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2">
                  <span className={cn('truncate text-sm', c.unread ? 'font-semibold' : 'font-medium')}>{c.name}</span>
                  {c.unread && <Pill tone="brand">Nova</Pill>}
                </span>
                <span className="mt-0.5 block truncate text-sm text-muted-foreground">{last?.text}</span>
              </span>
              <span className="flex shrink-0 flex-col items-end gap-1">
                <span className="text-xs text-muted-foreground">{last?.time}</span>
                <Pill>{c.channel}</Pill>
              </span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}

function Thread({ conversation, onBack }: { conversation: Conversation; onBack: () => void }) {
  const { reply } = useCrm()
  const [draft, setDraft] = useState('')
  const [error, setError] = useState('')

  const send = (e?: FormEvent) => {
    e?.preventDefault()
    if (!draft.trim()) {
      setError('Escreva uma resposta antes de enviar.')
      return
    }
    reply(conversation.id, draft.trim())
    setDraft('')
    setError('')
    toast.success('Resposta enviada', { description: `Por ${conversation.channel}.` })
  }
  // Protótipo: rascunho fixo no tom do brand kit. Não há IA ligada, e nada é enviado sem o clique em Enviar.
  const suggest = () => {
    setDraft(`Oi, ${firstName(conversation.name)}! Obrigado pela mensagem. Aqui no ${brandKit.name} a gente resolve isso para você hoje mesmo.`)
    setError('')
  }

  return (
    <div className="flex min-w-0 flex-col gap-4">
      <header className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="size-11 md:hidden" onClick={onBack} aria-label="Voltar para as conversas">
          <ArrowLeft />
        </Button>
        <Person name={conversation.name} sub={conversation.channel} />
      </header>
      <ol className="grid grid-cols-1 gap-2" aria-label={`Mensagens com ${conversation.name}`}>
        {conversation.messages.map((m) => (
          <li key={m.id} className={cn('flex', m.from === 'marca' && 'justify-end')}>
            <div className={cn('max-w-4/5 rounded-2xl px-3 py-2 text-sm', m.from === 'marca' ? 'bg-brand-soft text-foreground' : 'bg-muted')}>
              <span className="sr-only">{m.from === 'marca' ? 'Você: ' : `${conversation.name}: `}</span>
              {m.text}
              <span className="mt-1 block text-xs text-muted-foreground">{m.time}</span>
            </div>
          </li>
        ))}
      </ol>
      <form onSubmit={send} noValidate className="grid gap-3">
        <TextArea label="Resposta" value={draft} onChange={(e) => setDraft(e.target.value)} error={error} minRows={2} maxRows={6} onSubmitShortcut={() => send()} />
        <div className="flex flex-wrap justify-end gap-2">
          <Button type="button" variant="outline" className="min-h-11" onClick={suggest}>
            <Sparkles /> Sugerir resposta
          </Button>
          <Button type="submit" className="min-h-11">
            <Send /> Enviar
          </Button>
        </div>
      </form>
    </div>
  )
}

function Inbox() {
  const { conversations, markRead } = useCrm()
  const [current, setCurrent] = useState<string | null>(null)
  const open = conversations.find((c) => c.id === current)
  const select = (id: string) => {
    setCurrent(id)
    markRead(id)
  }
  if (conversations.length === 0) return <p className="py-10 text-center text-sm text-muted-foreground">Nenhuma conversa ainda. As mensagens dos seus canais aparecem aqui.</p>
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
      {/* No celular, a lista some quando uma conversa está aberta. */}
      <section aria-label="Conversas" className={cn('min-w-0 rounded-xl border bg-card p-2 md:col-span-2', open && 'hidden md:block')}>
        <ConversationList current={current} onSelect={select} />
      </section>
      <section aria-label="Conversa aberta" className={cn('min-w-0 rounded-xl border bg-card p-4 md:col-span-3', !open && 'hidden md:block')}>
        {open ? <Thread key={open.id} conversation={open} onBack={() => setCurrent(null)} /> : <p className="py-16 text-center text-sm text-muted-foreground">Escolha uma conversa para responder.</p>}
      </section>
    </div>
  )
}

const STATUS_TONE: Record<CampaignStatus, 'neutral' | 'info' | 'success'> = { rascunho: 'neutral', agendada: 'info', enviada: 'success' }
const segmentLabel = (s: Campaign['segment']) => (s === 'todos' ? 'Todos os leads' : STAGE_LABEL[s])
const SEGMENT_OPTIONS = [{ value: 'todos', label: 'Todos os leads' }, ...STAGES.filter((s) => s !== 'perdido').map((value) => ({ value, label: STAGE_LABEL[value] }))]
const CHANNEL_OPTIONS = [
  { value: 'E-mail', label: 'E-mail' },
  { value: 'WhatsApp', label: 'WhatsApp' },
]

function Campaigns({ onNew }: { onNew: () => void }) {
  const { campaigns } = useCrm()
  return (
    <Section
      title="Campanhas"
      description="Só recebem campanhas os leads que autorizaram o contato."
      action={
        <Button variant="outline" className="min-h-11" onClick={onNew}>
          <Plus /> Nova campanha
        </Button>
      }
    >
      {campaigns.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-8 text-center">
          <Megaphone className="size-8 text-muted-foreground" aria-hidden="true" />
          <p className="text-sm text-muted-foreground">Nenhuma campanha ainda. Crie a primeira para falar com seus leads.</p>
        </div>
      ) : (
        <ul className="grid gap-3">
          {campaigns.map((c) => (
            <li key={c.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3">
              <div className="min-w-0 flex-1 basis-56">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-medium">{c.name}</p>
                  <Pill tone={STATUS_TONE[c.status]}>{CAMPAIGN_LABEL[c.status]}</Pill>
                </div>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {c.channel} · {segmentLabel(c.segment)} · {numberFmt.format(c.recipients)} destinatários
                </p>
              </div>
              {c.opened !== undefined && c.recipients > 0 && (
                <p className="text-sm tabular-nums">
                  {Math.round((c.opened / c.recipients) * 100)}% <span className="text-muted-foreground">de abertura</span>
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </Section>
  )
}

function NewCampaignDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const { addCampaign, audience } = useCrm()
  const [name, setName] = useState('')
  const [channel, setChannel] = useState<Campaign['channel']>('E-mail')
  const [segment, setSegment] = useState<Campaign['segment']>('todos')
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState<{ name?: string; message?: string }>({})
  const reach = audience(segment).length

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const found: typeof errors = {}
    if (!name.trim()) found.name = 'Dê um nome à campanha.'
    if (message.trim().length < 10) found.message = 'Escreva a mensagem, com pelo menos 10 caracteres.'
    setErrors(found)
    if (Object.keys(found).length > 0) return
    addCampaign({ name: name.trim(), channel, segment })
    toast.success('Campanha salva como rascunho', { description: 'Nada foi enviado. O envio é uma etapa separada.' })
    setName('')
    setMessage('')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={submit} noValidate className="grid gap-4">
          <DialogHeader>
            <DialogTitle>Nova campanha</DialogTitle>
            <DialogDescription>Ela é salva como rascunho. Nada é enviado agora.</DialogDescription>
          </DialogHeader>
          <TextField label="Nome" value={name} onChange={(e) => setName(e.target.value)} error={errors.name} size="lg" autoComplete="off" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Select label="Canal" options={CHANNEL_OPTIONS} value={channel} onChange={(v) => setChannel(v as Campaign['channel'])} size="lg" />
            <Select label="Para quem" options={SEGMENT_OPTIONS} value={segment} onChange={(v) => setSegment(v as Campaign['segment'])} size="lg" />
          </div>
          <TextArea label="Mensagem" value={message} onChange={(e) => setMessage(e.target.value)} error={errors.message} minRows={3} maxLength={500} counter />
          <p className="text-sm text-muted-foreground" aria-live="polite">
            {reach === 0 ? 'Nenhum lead deste grupo autorizou o contato.' : `${numberFmt.format(reach)} ${reach === 1 ? 'lead autorizou' : 'leads autorizaram'} o contato neste grupo.`}
          </p>
          <DialogFooter>
            <Button type="button" variant="outline" className="min-h-11" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="min-h-11">
              Salvar rascunho
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function Mensagens() {
  const loaded = useLoaded()
  const { conversations } = useCrm()
  const [tab, setTab] = useTab(TABS)
  const [newCampaign, setNewCampaign] = useState(false)
  const unread = conversations.filter((c) => c.unread).length

  return (
    <>
      <PageHeader title="Mensagens" description={unread === 0 ? 'Tudo respondido.' : `${unread} ${unread === 1 ? 'conversa espera' : 'conversas esperam'} resposta.`} />
      {!loaded ? (
        <div className="grid gap-4" aria-busy="true" aria-label="Carregando mensagens">
          <Skeleton className="h-9 w-56" />
          <Skeleton className="h-72 w-full rounded-xl" />
        </div>
      ) : (
        <Tabs value={tab} onValueChange={(t) => setTab(t as (typeof TABS)[number])}>
          <TabsList>
            <TabsTrigger value="conversas">Conversas</TabsTrigger>
            <TabsTrigger value="campanhas">Campanhas</TabsTrigger>
          </TabsList>
          <TabsContent value="conversas" className="mt-4">
            <Inbox />
          </TabsContent>
          <TabsContent value="campanhas" className="mt-4">
            <Campaigns onNew={() => setNewCampaign(true)} />
          </TabsContent>
        </Tabs>
      )}
      <NewCampaignDialog open={newCampaign} onOpenChange={setNewCampaign} />
    </>
  )
}
