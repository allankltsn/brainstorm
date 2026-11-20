import { ArrowLeft, Plus, Send, ShieldAlert, Sparkles, User } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/affect/button'
import { SegmentedControl } from '@/components/affect/segmented-control'
import { Select } from '@/components/affect/select'
import { TextArea } from '@/components/affect/text-area'
import { TextField } from '@/components/affect/text-field'
import { ThinkingLoader } from '@/components/affect/thinking-loader'
import { brandName } from '@/components/brand-preview'
import { PageHeader, Pill, Section } from '@/components/page'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useBrand } from '@/lib/brand'
import { whenLabel } from '@/lib/content'
import { audienceOf, AUDIENCES, MSG_CHANNELS, stageLabel, suggestCampaign, timeLabel, TODAY, useCrm, type Audience, type Campaign, type MsgChannel, type Thread } from '@/lib/crm'
import { initials } from '@/lib/data'
import { cn } from '@/lib/utils'

const TABS = ['caixa', 'campanhas'] as const
type Tab = (typeof TABS)[number]
type Filter = 'todas' | MsgChannel

const CHANNEL_TONE = { whatsapp: 'success', instagram: 'brand', email: 'info' } as const
const last = (t: Thread) => t.messages[t.messages.length - 1]

function ThreadList({ threads, current, onOpen }: { threads: Thread[]; current: string | null; onOpen: (id: string) => void }) {
  const { contact } = useCrm()
  if (threads.length === 0) return <p className="px-4 py-10 text-center text-sm text-muted-foreground">Nenhuma conversa neste canal.</p>
  return (
    <ul className="divide-y">
      {threads.map((t) => {
        const who = contact(t.contactId)
        const m = last(t)
        return (
          <li key={t.id}>
            <button
              type="button"
              onClick={() => onOpen(t.id)}
              aria-current={current === t.id ? 'true' : undefined}
              className={cn('flex w-full items-start gap-3 px-4 py-3 text-left outline-none hover:bg-muted/60 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset', current === t.id && 'bg-muted')}
            >
              <Avatar className="mt-0.5 size-9">
                <AvatarFallback className="bg-muted text-xs font-medium">{initials(who?.name ?? '?')}</AvatarFallback>
              </Avatar>
              <span className="min-w-0 flex-1">
                <span className="flex items-baseline justify-between gap-2">
                  <span className={cn('truncate text-sm', t.unread ? 'font-semibold' : 'font-medium')}>{who?.name ?? 'Contato excluído'}</span>
                  {m && <span className="shrink-0 text-xs text-muted-foreground tabular-nums">{timeLabel(m.at)}</span>}
                </span>
                <span className={cn('mt-0.5 block truncate text-xs', t.unread ? 'text-foreground' : 'text-muted-foreground')}>{m ? `${m.from === 'marca' ? 'Você: ' : ''}${m.text}` : 'Sem mensagens ainda'}</span>
                <span className="mt-1.5 flex flex-wrap items-center gap-1.5">
                  <Pill tone={CHANNEL_TONE[t.channel]}>{MSG_CHANNELS[t.channel]}</Pill>
                  {t.unread && <Pill tone="warning">Sem resposta</Pill>}
                </span>
              </span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}

function Conversation({ thread, onBack }: { thread: Thread; onBack: () => void }) {
  const { contact, send, markRead } = useCrm()
  const navigate = useNavigate()
  const who = contact(thread.contactId)
  const [draft, setDraft] = useState('')
  const [usedSuggestion, setUsedSuggestion] = useState(false)
  const end = useRef<HTMLDivElement>(null)
  useEffect(() => {
    end.current?.scrollIntoView({ block: 'nearest' })
  }, [thread.messages.length])
  // abrir a conversa não marca como respondida: só deixa de ser "nova" quando você responde ou marca como lida
  const submit = () => {
    const text = draft.trim()
    if (!text) return
    send(thread.id, text)
    setDraft('')
    setUsedSuggestion(false)
    toast.success(`Resposta enviada por ${MSG_CHANNELS[thread.channel]}`)
  }
  return (
    <div className="flex h-full min-h-[28rem] flex-col">
      <header className="flex flex-wrap items-center gap-3 border-b px-4 py-3">
        <span className="lg:hidden">
          <Button size="sm" variant="ghost" aria-label="Voltar para a lista de conversas" onClick={onBack}>
            <ArrowLeft className="size-4" />
          </Button>
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-sm font-semibold">{who?.name ?? 'Contato excluído'}</h2>
          <p className="text-xs text-muted-foreground">
            {MSG_CHANNELS[thread.channel]}
            {who && `, etapa ${stageLabel(who.stage)}`}
          </p>
        </div>
        {thread.unread && (
          <Button size="sm" variant="ghost" onClick={() => markRead(thread.id)}>
            Marcar como lida
          </Button>
        )}
        {who && (
          <Button size="sm" variant="secondary" icon={<User />} onClick={() => navigate(`/clientes?aba=contatos&contato=${who.id}`)}>
            Ver contato
          </Button>
        )}
      </header>

      <ol className="flex-1 space-y-3 overflow-y-auto px-4 py-4" aria-label="Mensagens">
        {thread.messages.length === 0 && <li className="py-8 text-center text-sm text-muted-foreground">Nenhuma mensagem ainda. Escreva a primeira abaixo.</li>}
        {thread.messages.map((m) => (
          <li key={m.id} className={cn('flex', m.from === 'marca' && 'justify-end')}>
            <div className={cn('max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed', m.from === 'marca' ? 'rounded-br-md bg-primary text-primary-foreground' : 'rounded-bl-md bg-muted')}>
              <p className="whitespace-pre-line">{m.text}</p>
              <p className={cn('mt-1 text-[11px] tabular-nums', m.from === 'marca' ? 'text-primary-foreground/80' : 'text-muted-foreground')}>
                <span className="sr-only">{m.from === 'marca' ? 'Você, ' : `${who?.name ?? 'Cliente'}, `}</span>
                {timeLabel(m.at)}
                {m.auto && ', automação'}
              </p>
            </div>
          </li>
        ))}
        <div ref={end} />
      </ol>

      <footer className="border-t p-3">
        {who && !who.consent && (
          <p className="mb-3 flex items-start gap-2 rounded-lg bg-warning-soft px-3 py-2 text-xs text-warning">
            <ShieldAlert className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
            {who.name} não aceitou receber mensagens da marca. Responder a uma mensagem dele é permitido; campanhas e automações, não.
          </p>
        )}
        {thread.suggestion && !usedSuggestion && (
          <div className="mb-3 rounded-lg border bg-brand-soft/60 p-3">
            <p className="flex items-center gap-1.5 text-xs font-medium text-brand-text">
              <Sparkles className="size-3.5" aria-hidden="true" />
              Sugestão da Aura
            </p>
            <p className="mt-1.5 text-sm leading-relaxed">{thread.suggestion}</p>
            <div className="mt-2.5 flex flex-wrap items-center gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  setDraft(thread.suggestion ?? '')
                  setUsedSuggestion(true)
                }}
              >
                Usar esta sugestão
              </Button>
              <span className="text-xs text-muted-foreground">Ela vai para o campo abaixo. Você revisa e envia.</span>
            </div>
          </div>
        )}
        <form
          // espaço à direita para o botão flutuante da Aura não cobrir "Enviar"
          className="flex items-end gap-2 pr-16 md:pr-20"
          onSubmit={(e) => {
            e.preventDefault()
            submit()
          }}
        >
          <TextArea aria-label={`Resposta para ${who?.name ?? 'o contato'}`} placeholder="Escreva a resposta" minRows={1} maxRows={6} maxLength={1000} value={draft} onChange={(e) => setDraft(e.target.value)} onSubmitShortcut={submit} className="flex-1" />
          <Button type="submit" icon={<Send />} disabled={!draft.trim()}>
            Enviar
          </Button>
        </form>
      </footer>
    </div>
  )
}

function Inbox({ openId, onOpen }: { openId: string | null; onOpen: (id: string | null) => void }) {
  const { threads } = useCrm()
  const [filter, setFilter] = useState<Filter>('todas')
  // sem resposta primeiro; depois, a mais recente
  const sorted = [...threads].filter((t) => filter === 'todas' || t.channel === filter).sort((a, b) => Number(b.unread) - Number(a.unread) || (last(b)?.at ?? '').localeCompare(last(a)?.at ?? ''))
  const open = threads.find((t) => t.id === openId) ?? null
  return (
    <div className="grid overflow-hidden rounded-xl border bg-card lg:grid-cols-[22rem_1fr]">
      <div className={cn('min-w-0 lg:border-r', open && 'hidden lg:block')}>
        <div className="border-b p-3">
          <SegmentedControl<Filter>
            aria-label="Filtrar conversas por canal"
            size="sm"
            fullWidth
            value={filter}
            onChange={setFilter}
            options={[{ value: 'todas', label: 'Todas' }, ...(Object.keys(MSG_CHANNELS) as MsgChannel[]).map((c) => ({ value: c as Filter, label: MSG_CHANNELS[c] }))]}
          />
        </div>
        <ThreadList threads={sorted} current={open?.id ?? null} onOpen={onOpen} />
      </div>
      <div className={cn('min-w-0', !open && 'hidden lg:block')}>
        {open ? (
          <Conversation key={open.id} thread={open} onBack={() => onOpen(null)} />
        ) : (
          <div className="flex h-full min-h-[28rem] flex-col items-center justify-center gap-1.5 px-6 text-center">
            <p className="font-medium">Escolha uma conversa</p>
            <p className="max-w-xs text-sm text-muted-foreground">WhatsApp, Instagram e e-mail chegam todos aqui. As sem resposta ficam no topo.</p>
          </div>
        )}
      </div>
    </div>
  )
}

const CAMPAIGN_LABEL: Record<Campaign['status'], string> = { rascunho: 'Rascunho', agendada: 'Agendada', enviada: 'Enviada' }
const CAMPAIGN_TONE = { rascunho: 'neutral', agendada: 'brand', enviada: 'success' } as const
const pct = (n: number, of: number) => (of ? `${Math.round((n / of) * 100)}%` : 'sem dados')
/* Campanha recém-enviada ainda não tem leitura: mostra "aguardando" em vez de 0%. */
const fresh = (g: Campaign) => g.sent > 0 && g.opened + g.clicked + g.replied === 0
const EMPTY_CAMPAIGN: Campaign = { id: '', name: '', channel: 'email', audience: 'todos', subject: '', body: '', status: 'rascunho', when: `${TODAY}T15:00`, sent: 0, opened: 0, clicked: 0, replied: 0 }

function CampaignEditor({ initial, onDone }: { initial: Campaign; onDone: () => void }) {
  const { kit } = useBrand()
  const { contacts, campaigns, saveCampaign, removeCampaign, sendCampaign, restore, snapshot } = useCrm()
  // campanha nova ganha o id uma vez só, quando a tela abre
  const [g, setG] = useState(() => (initial.id ? initial : { ...initial, id: `g${Date.now().toString(36)}` }))
  const [tried, setTried] = useState(false)
  const [thinking, setThinking] = useState(false)
  const [confirm, setConfirm] = useState(false)
  const set = (p: Partial<Campaign>) => setG((cur) => ({ ...cur, ...p }))
  const isNew = !campaigns.some((x) => x.id === g.id)
  const sent = g.status === 'enviada'
  const { reach, blocked } = audienceOf(contacts, g.audience)
  const past = g.when < `${TODAY}T10:00`
  const missing = { name: !g.name.trim(), subject: g.channel === 'email' && !g.subject.trim(), body: !g.body.trim() }
  const invalid = Object.values(missing).some(Boolean)
  const limit = g.channel === 'whatsapp' ? 600 : 2000

  if (sent)
    return (
      <Section title={g.name} description={`Enviada por ${g.channel === 'email' ? 'e-mail' : 'WhatsApp'} em ${whenLabel(g.when)} para ${g.sent} ${g.sent === 1 ? 'contato' : 'contatos'}.`} action={<Pill tone="success">Enviada</Pill>}>
        <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            ['Enviadas', String(g.sent)],
            ['Abertas', fresh(g) ? 'Aguardando' : pct(g.opened, g.sent)],
            ['Cliques', fresh(g) ? 'Aguardando' : pct(g.clicked, g.sent)],
            ['Respostas', fresh(g) ? 'Aguardando' : pct(g.replied, g.sent)],
          ].map(([k, v]) => (
            <div key={k} className="rounded-lg border p-3">
              <dt className="text-xs text-muted-foreground">{k}</dt>
              <dd className="mt-1 text-xl font-semibold tabular-nums">{v}</dd>
            </div>
          ))}
        </dl>
        {fresh(g) && <p className="mt-3 text-xs text-muted-foreground">Os números de abertura e clique aparecem conforme as pessoas leem.</p>}
        {g.subject && <p className="mt-5 text-sm font-medium">{g.subject}</p>}
        <p className="mt-2 text-sm leading-relaxed whitespace-pre-line text-muted-foreground">{g.body}</p>
        <div className="mt-5 flex justify-end border-t pt-4">
          <Button variant="secondary" onClick={onDone}>
            Voltar para as campanhas
          </Button>
        </div>
      </Section>
    )

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-5">
        <Section title={isNew ? 'Nova campanha' : g.name} description="Uma mensagem para vários contatos de uma vez. Nada sai sem você confirmar." className="min-w-0 lg:col-span-3">
          <form
            className="grid gap-5"
            noValidate
            onSubmit={(e) => {
              e.preventDefault()
              setTried(true)
              if (invalid || past) return
              saveCampaign({ ...g, status: 'agendada' })
              toast.success(`Campanha agendada para ${whenLabel(g.when)}`)
              onDone()
            }}
          >
            <TextField label="Nome da campanha" hint="Só você vê." value={g.name} onChange={(e) => set({ name: e.target.value })} maxLength={60} error={tried && missing.name ? 'Dê um nome à campanha.' : undefined} />
            <div className="grid gap-2">
              <span id="canal-label" className="text-sm font-medium">
                Canal
              </span>
              <SegmentedControl<Campaign['channel']>
                aria-labelledby="canal-label"
                fullWidth
                value={g.channel}
                onChange={(channel) => set({ channel })}
                options={[
                  { value: 'email', label: 'E-mail' },
                  { value: 'whatsapp', label: 'WhatsApp' },
                ]}
              />
            </div>
            <Select label="Para quem" options={AUDIENCES} value={g.audience} onChange={(v) => set({ audience: v as Audience })} hint={`${reach.length} ${reach.length === 1 ? 'contato vai receber' : 'contatos vão receber'}.${blocked ? ` ${blocked} ${blocked === 1 ? 'fica de fora por não ter dado' : 'ficam de fora por não terem dado'} consentimento.` : ''}`} />
            {thinking ? (
              <ThinkingLoader phases={['Lendo o tom de voz', 'Escrevendo a mensagem']} interval={600} />
            ) : (
              <>
                {g.channel === 'email' && <TextField label="Assunto" value={g.subject} onChange={(e) => set({ subject: e.target.value })} maxLength={50} counter hint="Até 50 caracteres aparecem inteiros no celular." error={tried && missing.subject ? 'Escreva o assunto do e-mail.' : undefined} />}
                <TextArea label="Mensagem" minRows={5} maxRows={14} maxLength={limit} counter value={g.body} onChange={(e) => set({ body: e.target.value })} error={tried && missing.body ? 'Escreva a mensagem.' : undefined} />
                <div>
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    icon={<Sparkles />}
                    onClick={() => {
                      setThinking(true)
                      setTimeout(() => {
                        set(suggestCampaign(g.name, g.channel, brandName(kit)))
                        setThinking(false)
                        toast('A Aura escreveu um rascunho', { description: 'Revise o texto antes de agendar. Usou 5 créditos de IA.' })
                      }, 1300)
                    }}
                  >
                    {g.body.trim() ? 'Pedir outro texto à Aura' : 'Pedir um texto à Aura'}
                  </Button>
                </div>
              </>
            )}
            <TextField label="Enviar em" type="datetime-local" value={g.when} onChange={(e) => set({ when: e.target.value })} error={tried && past ? 'Escolha uma data e hora no futuro.' : undefined} className="max-w-xs" />
            <div className="flex flex-wrap items-center justify-end gap-2 border-t pt-4">
              {!isNew && (
                <Button
                  type="button"
                  variant="ghost"
                  className="mr-auto"
                  onClick={() => {
                    const before = snapshot()
                    removeCampaign(g.id)
                    onDone()
                    toast(`"${g.name}" foi excluída`, { action: { label: 'Desfazer', onClick: () => restore(before) } })
                  }}
                >
                  Excluir campanha
                </Button>
              )}
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  if (!g.name.trim()) return setTried(true)
                  saveCampaign({ ...g, status: 'rascunho' })
                  toast('Rascunho salvo')
                  onDone()
                }}
              >
                Salvar rascunho
              </Button>
              <Button
                type="button"
                variant="secondary"
                disabled={reach.length === 0}
                onClick={() => {
                  setTried(true)
                  if (!invalid) setConfirm(true)
                }}
              >
                Enviar agora
              </Button>
              <Button type="submit" disabled={reach.length === 0}>
                Agendar envio
              </Button>
            </div>
            {reach.length === 0 && (
              <p role="alert" className="text-sm text-destructive">
                Ninguém neste público pode receber a campanha. Escolha outro público ou registre o consentimento dos contatos.
              </p>
            )}
          </form>
        </Section>
        <div className="min-w-0 lg:col-span-2">
          <h2 className="mb-3 text-sm font-semibold">Como chega</h2>
          <div className="rounded-xl border bg-card p-4">
            <p className="text-xs text-muted-foreground">
              {g.channel === 'email' ? 'E-mail' : 'WhatsApp'} de {brandName(kit)}
            </p>
            {g.channel === 'email' && <p className="mt-2 text-sm font-semibold">{g.subject || 'Assunto do e-mail'}</p>}
            <p className={cn('mt-2 text-sm leading-relaxed whitespace-pre-line', g.channel === 'whatsapp' && 'rounded-2xl rounded-bl-md bg-muted px-3.5 py-2.5')}>{g.body || 'A mensagem aparece aqui.'}</p>
            {g.channel === 'email' && <p className="mt-4 border-t pt-3 text-xs text-muted-foreground">Você recebe este e-mail porque aceitou mensagens de {brandName(kit)}. Sair da lista.</p>}
          </div>
        </div>
      </div>

      <Dialog open={confirm} onOpenChange={setConfirm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              Enviar agora para {reach.length} {reach.length === 1 ? 'contato' : 'contatos'}?
            </DialogTitle>
            <DialogDescription>
              "{g.name}" sai por {g.channel === 'email' ? 'e-mail' : 'WhatsApp'} na hora. Depois de enviada, não dá para cancelar nem editar.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setConfirm(false)}>
              Continuar editando
            </Button>
            <Button
              onClick={() => {
                const n = sendCampaign(g)
                toast.success(`Campanha enviada para ${n} ${n === 1 ? 'contato' : 'contatos'}`)
                setConfirm(false)
                onDone()
              }}
            >
              Enviar campanha
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

function Campaigns({ onOpen }: { onOpen: (id: string) => void }) {
  const { campaigns, contacts } = useCrm()
  return (
    <Section
      title="Campanhas"
      description="E-mail e WhatsApp para vários contatos. Só recebe quem aceitou mensagens da marca."
    >
      {campaigns.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">Nenhuma campanha ainda. Crie a primeira para falar com vários contatos de uma vez.</p>
      ) : (
        <ul className="-mx-2 divide-y">
          {campaigns.map((g) => (
            <li key={g.id} className="flex flex-wrap items-center gap-x-4 gap-y-2.5 px-2 py-3.5">
              <div className="min-w-0 flex-1 basis-64">
                <p className="flex flex-wrap items-center gap-2 text-sm font-medium">
                  {g.name}
                  <Pill>{g.channel === 'email' ? 'E-mail' : 'WhatsApp'}</Pill>
                  <Pill tone={CAMPAIGN_TONE[g.status]}>{CAMPAIGN_LABEL[g.status]}</Pill>
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground tabular-nums">
                  {g.status === 'enviada' && (fresh(g) ? `${g.sent} enviadas em ${whenLabel(g.when)}. Aguardando as primeiras aberturas.` : `${g.sent} enviadas em ${whenLabel(g.when)}. ${pct(g.opened, g.sent)} abertas, ${pct(g.clicked, g.sent)} cliques, ${pct(g.replied, g.sent)} respostas.`)}
                  {g.status === 'agendada' && `Sai em ${whenLabel(g.when)} para ${audienceOf(contacts, g.audience).reach.length} contatos.`}
                  {g.status === 'rascunho' && (g.body.trim() ? 'Falta agendar.' : 'Falta escrever a mensagem.')}
                </p>
              </div>
              <Button size="sm" variant="secondary" onClick={() => onOpen(g.id)}>
                {g.status === 'enviada' ? 'Ver resultado' : 'Editar'}
              </Button>
            </li>
          ))}
        </ul>
      )}
    </Section>
  )
}

export function Conversas() {
  const { unread, campaigns } = useCrm()
  const [params, setParams] = useSearchParams()
  const raw = params.get('aba') as Tab | null
  const tab: Tab = raw && TABS.includes(raw) ? raw : 'caixa'
  const threadId = params.get('id')
  const campaignId = params.get('campanha')
  const go = (t: Tab, extra: Record<string, string> = {}) => setParams({ ...(t === 'caixa' ? {} : { aba: t }), ...extra }, { replace: Object.keys(extra).length === 0 })
  const editing = campaignId ? (campaigns.find((g) => g.id === campaignId) ?? EMPTY_CAMPAIGN) : null

  return (
    <>
      <PageHeader
        title="Conversas"
        description={unread === 0 ? 'Todas as conversas estão respondidas.' : `${unread === 1 ? '1 conversa espera' : `${unread} conversas esperam`} a sua resposta.`}
        actions={
          tab === 'campanhas' &&
          !editing && (
            <Button icon={<Plus />} onClick={() => go('campanhas', { campanha: 'nova' })}>
              Criar campanha
            </Button>
          )
        }
      />
      {editing ? (
        <>
          <button type="button" onClick={() => go('campanhas')} className="mb-4 inline-flex items-center gap-1.5 rounded-md text-sm font-medium text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring">
            <ArrowLeft className="size-4" />
            Voltar para as campanhas
          </button>
          <CampaignEditor key={campaignId} initial={editing} onDone={() => go('campanhas')} />
        </>
      ) : (
        <>
          <SegmentedControl<Tab>
            variant="underline"
            kind="tabs"
            aria-label="Seções de conversas"
            value={tab}
            onChange={(t) => go(t)}
            className="mb-6"
            options={[
              { value: 'caixa', label: 'Caixa de entrada', count: unread || undefined, controls: 'painel-conversas' },
              { value: 'campanhas', label: 'Campanhas', controls: 'painel-conversas' },
            ]}
          />
          <div id="painel-conversas" role="tabpanel">
            {tab === 'caixa' && <Inbox openId={threadId} onOpen={(id) => go('caixa', id ? { id } : {})} />}
            {tab === 'campanhas' && <Campaigns onOpen={(id) => go('campanhas', { campanha: id })} />}
          </div>
        </>
      )}
    </>
  )
}
