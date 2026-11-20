import { AlarmClock, ArrowLeft, Check, ChevronDown, CircleAlert, CircleCheck, Clock, FileText, Inbox, ListChecks, MessageSquarePlus, MoreHorizontal, Paperclip, Plus, RotateCcw, Search, Send, ShieldAlert, Sparkles, StickyNote, UserRound, Users, WandSparkles, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/affect/button'
import { SegmentedControl } from '@/components/affect/segmented-control'
import { Select } from '@/components/affect/select'
import { Switch } from '@/components/affect/switch'
import { TagInput } from '@/components/affect/tag-input'
import { TextArea } from '@/components/affect/text-area'
import { TextField } from '@/components/affect/text-field'
import { ThinkingLoader } from '@/components/affect/thinking-loader'
import { brandName } from '@/components/brand-preview'
import { ChannelIcon } from '@/components/channel'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { useSidebar } from '@/components/ui/sidebar'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useBrand } from '@/lib/brand'
import {
  auraRewrite,
  brl,
  dateLabel,
  isLate,
  lastActivity,
  lastMessage,
  ME,
  memberName,
  messagesOf,
  MSG_CHANNELS,
  NOW_AT,
  QUEUES,
  replyChannel,
  SOURCES,
  stageLabel,
  summarize,
  TEAM,
  THREAD_STATUS,
  timeLabel,
  TODAY,
  useCrm,
  WHATSAPP_TEMPLATES,
  whatsappOpen,
  type AuraAction,
  type Contact,
  type MsgChannel,
  type Thread,
  type ThreadStatus,
  type TimelineItem,
} from '@/lib/crm'
import { initials } from '@/lib/data'
import { cn } from '@/lib/utils'
import { CampaignsPanel } from '@/pages/campanhas'
import { DealCard } from '@/components/deal-card'

/* ------------------------------------------------------------------ filas */

type FilaId = string
type Fila = { id: FilaId; label: string; icon?: ReactNode; match: (t: Thread) => boolean }
const ALL_CHANNELS = Object.keys(MSG_CHANNELS) as MsgChannel[]
const notDone = (t: Thread) => t.status !== 'resolvida'
const FILAS: { group: string; items: Fila[] }[] = [
  {
    group: '',
    items: [
      { id: 'todas', label: 'Todas', icon: <Inbox />, match: notDone },
      { id: 'minhas', label: 'Atribuídas a mim', icon: <UserRound />, match: (t) => notDone(t) && t.assignee === ME },
      { id: 'sem', label: 'Sem responsável', icon: <Users />, match: (t) => notDone(t) && !t.assignee },
      { id: 'atrasadas', label: 'Atrasadas', icon: <CircleAlert />, match: isLate },
    ],
  },
  { group: 'Equipes', items: QUEUES.map((q) => ({ id: `fila:${q.id}`, label: q.name, match: (t: Thread) => notDone(t) && t.queue === q.id })) },
  { group: 'Canais', items: ALL_CHANNELS.map((c) => ({ id: `canal:${c}`, label: MSG_CHANNELS[c], icon: <ChannelIcon channel={c} className="size-4" />, match: (t: Thread) => notDone(t) && messagesOf(t).some((m) => m.channel === c) })) },
  { group: '', items: [{ id: 'resolvidas', label: 'Resolvidas', icon: <ListChecks />, match: (t) => t.status === 'resolvida' }] },
]
const FILA_LIST = FILAS.flatMap((g) => g.items)
const filaOf = (id: string | null) => FILA_LIST.find((f) => f.id === id) ?? FILA_LIST[0]

const firstName = (n: string) => n.split(' ')[0]
const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')

/* Atrasadas primeiro, depois não lidas, depois a atividade mais recente. */
function sortThreads(list: Thread[]) {
  return [...list].sort((a, b) => Number(isLate(b)) - Number(isLate(a)) || Number(b.unread) - Number(a.unread) || lastActivity(b).localeCompare(lastActivity(a)))
}

function Queues({ threads, current, onPick }: { threads: Thread[]; current: FilaId; onPick: (id: FilaId) => void }) {
  return (
    <nav aria-label="Filas de atendimento" className="relative h-full overflow-y-auto px-2 py-3">
      {FILAS.map((g, gi) => {
        const items = g.items.filter((f) => !f.id.startsWith('canal:') || threads.some(f.match))
        if (items.length === 0) return null
        return (
          <div key={gi} className={cn(gi > 0 && 'mt-3 border-t pt-3')}>
            {g.group && <p className="px-2 pb-1 text-xs font-medium text-muted-foreground">{g.group}</p>}
            <ul className="grid gap-0.5">
              {items.map((f) => {
                const n = threads.filter(f.match).length
                const active = current === f.id
                return (
                  <li key={f.id}>
                    <button
                      type="button"
                      onClick={() => onPick(f.id)}
                      aria-current={active ? 'true' : undefined}
                      className={cn(
                        'flex h-9 w-full items-center gap-2.5 rounded-lg px-2 text-left text-sm outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring [&>svg]:size-4 [&>svg]:text-muted-foreground',
                        active && 'bg-muted font-medium [&>svg]:text-primary',
                      )}
                    >
                      {f.icon ?? <span className="size-4" aria-hidden="true" />}
                      <span className="min-w-0 flex-1 truncate">{f.label}</span>
                      {n > 0 && <span className={cn('text-xs tabular-nums', f.id === 'atrasadas' ? 'font-semibold text-destructive' : 'text-muted-foreground')}>{n}</span>}
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        )
      })}
    </nav>
  )
}

/* ------------------------------------------------------------------ lista */

function StatusMark({ t }: { t: Thread }) {
  if (isLate(t))
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-destructive">
        <CircleAlert className="size-3.5" aria-hidden="true" />
        Atrasada
      </span>
    )
  if (t.status === 'resolvida')
    return (
      <span className="inline-flex items-center gap-1 text-xs text-success">
        <CircleCheck className="size-3.5" aria-hidden="true" />
        Resolvida
      </span>
    )
  if (t.status === 'aguardando')
    return (
      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
        <Clock className="size-3.5" aria-hidden="true" />
        Aguardando cliente
      </span>
    )
  return null
}

function ThreadRow({ t, active, onOpen }: { t: Thread; active: boolean; onOpen: () => void }) {
  const { contact, company } = useCrm()
  const who = contact(t.contactId)
  const org = company(who?.companyId ?? null)
  const m = lastMessage(t)
  const ch = replyChannel(t)
  return (
    <li>
      <button
        type="button"
        onClick={onOpen}
        aria-current={active ? 'true' : undefined}
        className={cn('relative flex w-full items-start gap-3 px-4 py-3 text-left outline-none hover:bg-muted/60 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset', active && 'bg-brand-soft/70 hover:bg-brand-soft/70')}
      >
        {active && <span className="absolute inset-y-2 left-0 w-1 rounded-r bg-primary" aria-hidden="true" />}
        <span className="relative mt-0.5">
          <Avatar className="size-10">
            <AvatarFallback className="bg-muted text-xs font-medium">{initials(who?.name ?? '?')}</AvatarFallback>
          </Avatar>
          <ChannelIcon channel={ch} className="absolute -right-1 -bottom-1 ring-2 ring-background" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-baseline justify-between gap-2">
            <span className={cn('min-w-0 truncate text-sm', t.unread ? 'font-semibold' : 'font-medium')}>
              {who?.name ?? 'Contato excluído'}
              <span className="font-normal text-muted-foreground"> › {t.assignee ? firstName(memberName(t.assignee)) : 'sem responsável'}</span>
            </span>
            <span className="shrink-0 text-xs text-muted-foreground tabular-nums">{m ? timeLabel(m.at) : ''}</span>
          </span>
          {org && <span className="block truncate text-xs text-muted-foreground">{org.name}</span>}
          <span className="mt-0.5 flex items-center gap-2">
            <span className={cn('min-w-0 flex-1 truncate text-sm', t.unread ? 'text-foreground' : 'text-muted-foreground')}>{m ? `${m.from === 'equipe' ? 'Você: ' : ''}${m.text}` : 'Sem mensagens ainda'}</span>
            {t.unread && (
              <span className="size-2.5 shrink-0 rounded-full bg-primary">
                <span className="sr-only">não lida</span>
              </span>
            )}
          </span>
          <span className="mt-1 flex">
            <StatusMark t={t} />
          </span>
        </span>
      </button>
    </li>
  )
}

function NewConversationDialog({ open, onOpenChange, onCreated }: { open: boolean; onOpenChange: (o: boolean) => void; onCreated: (threadId: string) => void }) {
  const { contacts, company, openThread } = useCrm()
  const [q, setQ] = useState('')
  const shown = contacts.filter((c) => norm(`${c.name} ${c.email} ${company(c.companyId)?.name ?? ''}`).includes(norm(q.trim()))).slice(0, 8)
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Iniciar conversa</DialogTitle>
          <DialogDescription>Escolha o contato. Se ele já tem conversa, ela abre.</DialogDescription>
        </DialogHeader>
        <TextField aria-label="Buscar contato" placeholder="Nome, e-mail ou empresa" prefix={<Search className="size-4" />} value={q} onChange={(e) => setQ(e.target.value)} autoFocus />
        <ul className="-mx-2 max-h-72 overflow-y-auto">
          {shown.length === 0 && <li className="px-2 py-6 text-center text-sm text-muted-foreground">Nenhum contato com esse nome. Adicione em Clientes.</li>}
          {shown.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => {
                  onCreated(openThread(c.id))
                  onOpenChange(false)
                  setQ('')
                }}
                className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Avatar className="size-8">
                  <AvatarFallback className="bg-muted text-xs">{initials(c.name)}</AvatarFallback>
                </Avatar>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{c.name}</span>
                  <span className="block truncate text-xs text-muted-foreground">{company(c.companyId)?.name ?? (c.email || c.phone)}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  )
}

function ThreadList({ fila, onFila, current, onOpen, showFilaPicker }: { fila: FilaId; onFila: (f: FilaId) => void; current: string | null; onOpen: (id: string) => void; showFilaPicker: boolean }) {
  const { threads, contact, company } = useCrm()
  const [q, setQ] = useState('')
  const [starting, setStarting] = useState(false)
  const f = filaOf(fila)
  const list = sortThreads(
    threads.filter(f.match).filter((t) => {
      if (!q.trim()) return true
      const c = contact(t.contactId)
      return norm(`${c?.name ?? ''} ${company(c?.companyId ?? null)?.name ?? ''} ${messagesOf(t).map((m) => m.text).join(' ')}`).includes(norm(q.trim()))
    }),
  )
  const online = TEAM.filter((m) => m.online)
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="grid gap-2 border-b p-3">
        <div className="flex items-center gap-2">
          {showFilaPicker ? (
            <div className="min-w-0 flex-1">
              <Select
                size="sm"
                aria-label="Fila"
                value={fila}
                onChange={onFila}
                options={FILA_LIST.filter((x) => !x.id.startsWith('canal:') || threads.some(x.match)).map((x) => ({ value: x.id, label: `${x.label} (${threads.filter(x.match).length})` }))}
              />
            </div>
          ) : (
            <h2 className="min-w-0 flex-1 truncate text-sm font-semibold">
              {f.label} <span className="font-normal text-muted-foreground">{list.length}</span>
            </h2>
          )}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="sm" variant="secondary" aria-label="Iniciar conversa" onClick={() => setStarting(true)}>
                <MessageSquarePlus className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Iniciar conversa</TooltipContent>
          </Tooltip>
        </div>
        <TextField size="sm" aria-label="Buscar nas conversas" placeholder="Buscar nome, empresa ou mensagem" prefix={<Search className="size-4" />} clearable value={q} onChange={(e) => setQ(e.target.value)} onClear={() => setQ('')} />
      </div>
      <div className="relative min-h-0 flex-1 overflow-y-auto">
        {list.length === 0 ? (
          <div className="flex flex-col items-center gap-1 px-6 py-12 text-center">
            <CircleCheck className="mb-1 size-6 text-success" aria-hidden="true" />
            <p className="text-sm font-medium">{q ? 'Nada encontrado' : 'Nenhuma conversa aqui'}</p>
            <p className="text-xs text-muted-foreground">{q ? 'Tente outro nome ou outra fila.' : f.id === 'atrasadas' ? 'Ninguém está esperando resposta há mais de 30 minutos.' : 'Quando chegar uma mensagem nesta fila, ela aparece aqui.'}</p>
          </div>
        ) : (
          <ul className="divide-y">
            {list.map((t) => (
              <ThreadRow key={t.id} t={t} active={current === t.id} onOpen={() => onOpen(t.id)} />
            ))}
          </ul>
        )}
      </div>
      <footer className="flex items-center gap-2 border-t px-3 py-2">
        <span className="text-xs text-muted-foreground">Online</span>
        <span className="flex -space-x-1.5">
          {online.map((m) => (
            <Tooltip key={m.id}>
              <TooltipTrigger asChild>
                <span className="relative" tabIndex={0} aria-label={`${m.name}, ${m.team}, online`}>
                  <Avatar className="size-7 ring-2 ring-background">
                    <AvatarFallback className="bg-brand-soft text-[10px] font-medium text-brand-text">{initials(m.name)}</AvatarFallback>
                  </Avatar>
                  <span className="absolute right-0 bottom-0 size-2 rounded-full bg-success ring-2 ring-background" />
                </span>
              </TooltipTrigger>
              <TooltipContent>
                {m.name}, {m.team}
              </TooltipContent>
            </Tooltip>
          ))}
        </span>
      </footer>
      <NewConversationDialog open={starting} onOpenChange={setStarting} onCreated={onOpen} />
    </div>
  )
}

/* ------------------------------------------------------------------ conversa */

/* Destaca as menções (@Nome). O split com grupo de captura deixa as menções nas posições ímpares. */
function withMentions(text: string) {
  return text.split(/(@[A-Za-zÀ-ÿ]+)/).map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} className="rounded bg-brand-soft px-1 font-medium text-brand-text">
        {part}
      </span>
    ) : (
      part
    ),
  )
}

function dayLabel(at: string) {
  const d = at.slice(0, 10)
  if (d === TODAY) return 'Hoje'
  const y = new Date(`${TODAY}T00:00`)
  y.setDate(y.getDate() - 1)
  if (d === `${y.getFullYear()}-${String(y.getMonth() + 1).padStart(2, '0')}-${String(y.getDate()).padStart(2, '0')}`) return 'Ontem'
  return dateLabel(d)
}

function TimelineEntry({ item, contact, onToggle }: { item: TimelineItem; contact?: Contact; onToggle: () => void }) {
  if (item.kind === 'evento')
    return (
      <li className="flex justify-center">
        <span className="rounded-full bg-muted px-3 py-1 text-center text-xs text-muted-foreground">
          {item.text} · {timeLabel(item.at)}
        </span>
      </li>
    )
  if (item.kind === 'nota')
    return (
      <li className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl border border-warning/30 bg-warning-soft px-3.5 py-2.5 text-sm">
          <p className="flex items-center gap-1.5 text-xs font-medium text-warning">
            <StickyNote className="size-3.5" aria-hidden="true" />
            Nota interna de {firstName(memberName(item.author))} · só a equipe vê
          </p>
          <p className="mt-1 leading-relaxed text-foreground">{withMentions(item.text)}</p>
          <p className="mt-1 text-right text-[11px] text-muted-foreground tabular-nums">{timeLabel(item.at)}</p>
        </div>
      </li>
    )
  if (item.kind === 'lembrete')
    return (
      <li className="flex justify-end">
        <label className={cn('flex max-w-[85%] cursor-pointer items-start gap-2.5 rounded-2xl border bg-card px-3.5 py-2.5 text-sm', item.done && 'opacity-70')}>
          <input type="checkbox" checked={item.done} onChange={onToggle} className="mt-0.5 size-4 accent-[var(--primary)]" />
          <span>
            <span className="flex items-center gap-1.5 text-xs font-medium text-brand-text">
              <AlarmClock className="size-3.5" aria-hidden="true" />
              Lembrete de {firstName(memberName(item.author))} para {timeLabel(item.due)}
            </span>
            <span className={cn('mt-0.5 block', item.done && 'line-through')}>{item.text}</span>
          </span>
        </label>
      </li>
    )
  const mine = item.from === 'equipe'
  return (
    <li className={cn('flex items-end gap-2', mine && 'justify-end')}>
      {!mine && (
        <Avatar className="size-7">
          <AvatarFallback className="bg-muted text-[10px]">{initials(contact?.name ?? '?')}</AvatarFallback>
        </Avatar>
      )}
      <div className={cn('max-w-[80%]', mine && 'text-right')}>
        {item.postRef && <p className="mb-1 text-xs text-muted-foreground">Comentou em: {item.postRef}</p>}
        <div className={cn('inline-block rounded-2xl px-3.5 py-2.5 text-left text-sm leading-relaxed', mine ? 'rounded-br-md bg-primary text-primary-foreground' : 'rounded-bl-md bg-muted')}>
          <p className="whitespace-pre-line">{item.text}</p>
          {item.attachment && (
            <span className={cn('mt-2 flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium', mine ? 'bg-primary-foreground/15' : 'bg-background')}>
              <FileText className="size-4 shrink-0" aria-hidden="true" />
              {item.attachment}
            </span>
          )}
        </div>
        <p className="mt-1 flex flex-wrap items-center gap-1 text-[11px] text-muted-foreground">
          <span className={cn('flex items-center gap-1', mine && 'ml-auto')}>
            <ChannelIcon channel={item.channel} className="size-3.5 [&_svg]:size-2.5" />
            {mine ? (item.auto ? `Automação por ${MSG_CHANNELS[item.channel]}` : `${firstName(memberName(item.author ?? ME))} por ${MSG_CHANNELS[item.channel]}`) : `Pelo ${MSG_CHANNELS[item.channel]}`}
            {' · '}
            {timeLabel(item.at)}
            {mine && item.read && (
              <>
                {' · '}
                <Check className="size-3" aria-hidden="true" /> Lida
              </>
            )}
          </span>
        </p>
      </div>
      {mine && (
        <Avatar className="size-7">
          <AvatarFallback className="bg-brand-soft text-[10px] text-brand-text">{item.auto ? 'A' : initials(memberName(item.author ?? ME))}</AvatarFallback>
        </Avatar>
      )}
    </li>
  )
}

const MATERIALS = ['Proposta comercial (modelo da marca).pdf', 'Catálogo de cafés.pdf', 'Apresentação para empresas.pdf']
type Mode = 'responder' | 'nota' | 'lembrete'

function Composer({ thread, contact }: { thread: Thread; contact?: Contact }) {
  const { kit } = useBrand()
  const { send, addNote, addReminder, quickReplies } = useCrm()
  const [mode, setMode] = useState<Mode>('responder')
  const [text, setText] = useState('')
  const [channel, setChannel] = useState<MsgChannel>(replyChannel(thread))
  const [attachment, setAttachment] = useState<string | null>(null)
  const [due, setDue] = useState(`${TODAY}T15:00`)
  const [thinking, setThinking] = useState(false)
  const used = useMemo(() => [...new Set(messagesOf(thread).map((m) => m.channel))], [thread])
  const options: MsgChannel[] = [...new Set<MsgChannel>([...used, ...(contact?.phone ? (['whatsapp'] as const) : []), ...(contact?.email ? (['email'] as const) : [])])]
  const waClosed = mode === 'responder' && channel === 'whatsapp' && !whatsappOpen(thread)
  const near = kit.status.voz === 'aprovado' ? kit.voice.tone === 'proxima' : true
  const showSuggestion = mode === 'responder' && thread.suggestion && !text.trim()

  const aura = (action: AuraAction | 'sugerir') => {
    setThinking(true)
    setTimeout(() => {
      setThinking(false)
      if (action === 'sugerir') setText(thread.suggestion ?? `Oi, ${firstName(contact?.name ?? '')}! Obrigado pela mensagem. Já vou te ajudar com isso.`)
      else setText((cur) => auraRewrite(cur, action, { near, brand: brandName(kit) }))
    }, 700)
  }

  const submit = () => {
    const v = text.trim()
    if (mode === 'lembrete') {
      if (!v) return toast.error('Escreva do que é o lembrete.')
      if (due <= NOW_AT) return toast.error('Escolha uma data e hora no futuro.')
      addReminder(thread.id, v, due)
      toast.success(`Lembrete criado para ${timeLabel(due)}`)
    } else if (mode === 'nota') {
      if (!v) return
      addNote(thread.id, v)
      toast.success('Nota interna salva', { description: 'Só a equipe vê.' })
    } else {
      if (!v && !attachment) return
      send(thread.id, v || 'Segue o arquivo.', channel, attachment ?? undefined)
      toast.success(`Resposta enviada pelo ${MSG_CHANNELS[channel]}`)
      setAttachment(null)
    }
    setText('')
  }

  return (
    <div className="border-t bg-background">
      {showSuggestion && (
        <div className="mx-3 mt-3 rounded-lg border bg-brand-soft/60 p-3">
          <p className="flex items-center gap-1.5 text-xs font-medium text-brand-text">
            <Sparkles className="size-3.5" aria-hidden="true" />
            Sugestão da Aura
          </p>
          <p className="mt-1.5 text-sm leading-relaxed">{thread.suggestion}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Button size="sm" variant="secondary" onClick={() => setText(thread.suggestion ?? '')}>
              Usar esta sugestão
            </Button>
            <span className="text-xs text-muted-foreground">Vai para o campo abaixo. Você revisa e envia.</span>
          </div>
        </div>
      )}
      <div className="flex flex-wrap items-center gap-1.5 px-3 pt-3">
        <SegmentedControl<Mode>
          size="sm"
          aria-label="Tipo de mensagem"
          value={mode}
          onChange={setMode}
          options={[
            { value: 'responder', label: 'Responder' },
            { value: 'nota', label: 'Nota' },
            { value: 'lembrete', label: 'Lembrete' },
          ]}
        />
        <span className="flex-1" />
        {mode === 'responder' && !waClosed && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="ghost" iconRight={<ChevronDown />}>
                Respostas prontas
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72">
              {quickReplies.map((r) => (
                <DropdownMenuItem key={r.id} onSelect={() => setText((cur) => (cur.trim() ? `${cur.trim()} ${r.text}` : r.text))} className="flex-col items-start gap-0.5">
                  <span className="font-medium">{r.title}</span>
                  <span className="line-clamp-2 text-xs text-muted-foreground">{r.text}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        {mode !== 'lembrete' && !waClosed && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="ghost" icon={<WandSparkles />} iconRight={<ChevronDown />} disabled={thinking}>
                Aura
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60">
              <DropdownMenuLabel className="text-xs text-muted-foreground">O texto vai para o campo. Você revisa antes de enviar.</DropdownMenuLabel>
              {mode === 'responder' && (
                <DropdownMenuItem onSelect={() => aura('sugerir')}>
                  <Sparkles /> Sugerir resposta
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              {(
                [
                  ['tom', 'Reescrever no tom da marca'],
                  ['expandir', 'Expandir'],
                  ['encurtar', 'Encurtar'],
                  ['corrigir', 'Corrigir'],
                ] as const
              ).map(([a, label]) => (
                <DropdownMenuItem key={a} disabled={!text.trim()} onSelect={() => aura(a)}>
                  {label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <form
        className="grid gap-2 p-3 pr-16 md:pr-20"
        onSubmit={(e) => {
          e.preventDefault()
          submit()
        }}
      >
        {waClosed ? (
          <div className="rounded-lg border bg-warning-soft px-3 py-2.5 text-sm text-warning">
            <p className="font-medium">A janela do WhatsApp está fechada</p>
            <p className="mt-0.5 text-xs">O cliente não escreve pelo WhatsApp há mais de 24 horas. Por lá, só dá para enviar um modelo aprovado; ou troque o canal.</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {WHATSAPP_TEMPLATES.map((w) => (
                <Button
                  key={w.id}
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    send(thread.id, w.text, 'whatsapp')
                    toast.success('Modelo enviado pelo WhatsApp')
                  }}
                >
                  Enviar modelo: {w.title}
                </Button>
              ))}
            </div>
          </div>
        ) : thinking ? (
          <ThinkingLoader size="sm" phases={['Lendo a conversa', 'Aplicando o tom da marca']} interval={350} />
        ) : mode === 'nota' ? (
          <>
            <TextArea aria-label="Nota interna" placeholder="Só a equipe vê. Use @ para mencionar alguém." minRows={2} maxRows={6} maxLength={1000} value={text} onChange={(e) => setText(e.target.value)} onSubmitShortcut={submit} inputClassName="bg-warning-soft/60" />
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
              Mencionar:
              {TEAM.filter((m) => m.id !== ME).map((m) => (
                <button key={m.id} type="button" onClick={() => setText((cur) => `${cur}${cur && !cur.endsWith(' ') ? ' ' : ''}@${firstName(m.name)} `)} className="rounded-full border px-2 py-0.5 outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring">
                  @{firstName(m.name)}
                </button>
              ))}
            </div>
          </>
        ) : mode === 'lembrete' ? (
          <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
            <TextField aria-label="Do que é o lembrete" placeholder="Ex.: ligar para confirmar a proposta" value={text} onChange={(e) => setText(e.target.value)} maxLength={140} />
            <TextField aria-label="Quando" type="datetime-local" min={NOW_AT} value={due} onChange={(e) => setDue(e.target.value)} />
          </div>
        ) : (
          <TextArea aria-label={`Resposta para ${contact?.name ?? 'o contato'}`} placeholder="Escreva a resposta" minRows={2} maxRows={8} maxLength={2000} value={text} onChange={(e) => setText(e.target.value)} onSubmitShortcut={submit} />
        )}

        {!waClosed && !thinking && (
          <div className="flex flex-wrap items-center gap-2">
            {mode === 'responder' && (
              <>
                <div className="w-44">
                  <Select size="sm" aria-label="Canal da resposta" value={channel} onChange={(v) => setChannel(v as MsgChannel)} options={options.map((c) => ({ value: c, label: `Por ${MSG_CHANNELS[c]}` }))} />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button type="button" size="sm" variant="ghost" icon={<Paperclip />}>
                      Anexar material
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-72">
                    <DropdownMenuLabel className="text-xs text-muted-foreground">Materiais da marca</DropdownMenuLabel>
                    {MATERIALS.map((m) => (
                      <DropdownMenuItem key={m} onSelect={() => setAttachment(m)}>
                        <FileText /> {m}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                {attachment && (
                  <span className="inline-flex h-7 items-center gap-1.5 rounded-full bg-muted pr-1 pl-2.5 text-xs">
                    <FileText className="size-3.5" aria-hidden="true" />
                    <span className="max-w-40 truncate">{attachment}</span>
                    <button type="button" aria-label="Remover anexo" onClick={() => setAttachment(null)} className="flex size-5 items-center justify-center rounded-full outline-none hover:bg-background focus-visible:ring-2 focus-visible:ring-ring">
                      <X className="size-3" />
                    </button>
                  </span>
                )}
              </>
            )}
            <span className="flex-1" />
            <Button type="submit" size="sm" icon={mode === 'responder' ? <Send /> : mode === 'nota' ? <StickyNote /> : <AlarmClock />} disabled={mode === 'responder' ? !text.trim() && !attachment : !text.trim()}>
              {mode === 'responder' ? 'Enviar' : mode === 'nota' ? 'Salvar nota' : 'Criar lembrete'}
            </Button>
          </div>
        )}
      </form>
    </div>
  )
}

function Conversation({ thread, onBack, onClient, clientInline }: { thread: Thread; onBack: () => void; onClient: () => void; clientInline: boolean }) {
  const { contact, company, dealsOf, setStatus, markRead, toggleReminder } = useCrm()
  const who = contact(thread.contactId)
  const org = company(who?.companyId ?? null)
  const deal = dealsOf(thread.contactId).filter((d) => d.stage !== 'ganho' && d.stage !== 'perdido').at(-1) ?? dealsOf(thread.contactId).at(-1)
  const [summary, setSummary] = useState(false)
  const end = useRef<HTMLDivElement>(null)
  useEffect(() => {
    end.current?.scrollIntoView({ block: 'nearest' })
  }, [thread.items.length])
  // abrir a conversa marca como lida
  useEffect(() => {
    if (thread.unread) markRead(thread.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [thread.id])

  const status = (s: ThreadStatus, label: string) => {
    const before = thread.status
    setStatus(thread.id, s)
    toast.success(label, { action: { label: 'Desfazer', onClick: () => setStatus(thread.id, before) } })
  }

  let lastDay = ''
  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className="flex items-center gap-2 border-b px-3 py-2.5 md:px-4">
        <span className="xl:hidden">
          <Button size="sm" variant="ghost" aria-label="Voltar para a lista de conversas" onClick={onBack}>
            <ArrowLeft className="size-4" />
          </Button>
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-sm font-semibold">{who?.name ?? 'Contato excluído'}</h2>
          <p className="truncate text-xs text-muted-foreground">{[org?.name, deal ? stageLabel(deal.stage) : null, THREAD_STATUS[thread.status]].filter(Boolean).join(' · ')}</p>
        </div>
        <span className="hidden md:inline-flex">
          <Button size="sm" variant="ghost" icon={<Sparkles />} onClick={() => setSummary((v) => !v)} disabled={thread.items.length === 0} aria-pressed={summary}>
            Resumo
          </Button>
        </span>
        {thread.status === 'aberta' && (
          <span className="hidden md:inline-flex">
            <Button size="sm" variant="secondary" icon={<Clock />} onClick={() => status('aguardando', 'Conversa aguardando o cliente')}>
              Aguardando
            </Button>
          </span>
        )}
        {thread.status === 'resolvida' ? (
          <Button size="sm" variant="secondary" icon={<RotateCcw />} onClick={() => status('aberta', 'Conversa reaberta')}>
            Reabrir
          </Button>
        ) : (
          <Button size="sm" icon={<CircleCheck />} onClick={() => status('resolvida', 'Conversa resolvida')}>
            Resolver
          </Button>
        )}
        {!clientInline && (
          <Button size="sm" variant="secondary" aria-label="Ver cliente" onClick={onClient}>
            <UserRound className="size-4" />
          </Button>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="ghost" aria-label="Mais ações da conversa">
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem className="md:hidden" disabled={thread.items.length === 0} onSelect={() => setSummary(true)}>
              <Sparkles /> Ver resumo da Aura
            </DropdownMenuItem>
            {thread.status === 'aberta' && (
              <DropdownMenuItem className="md:hidden" onSelect={() => status('aguardando', 'Conversa aguardando o cliente')}>
                <Clock /> Aguardando cliente
              </DropdownMenuItem>
            )}
            <DropdownMenuItem disabled={thread.status === 'resolvida'} onSelect={() => (markRead(thread.id, true), toast('Marcada como não lida'))}>
              <Inbox /> Marcar como não lida
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      <div className="relative min-h-0 flex-1 overflow-y-auto px-3 py-4 md:px-5">
        {thread.items.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted-foreground">Nenhuma mensagem ainda. Escreva a primeira abaixo.</p>
        ) : (
          <ol className="grid gap-3" aria-label="Linha do tempo da conversa">
            {thread.items.map((item) => {
              const day = item.at.slice(0, 10)
              const sep = day !== lastDay
              lastDay = day
              return (
                <ConversationDay key={item.id} label={sep ? dayLabel(item.at) : null}>
                  <TimelineEntry item={item} contact={who} onToggle={() => toggleReminder(thread.id, item.id)} />
                </ConversationDay>
              )
            })}
          </ol>
        )}
        <div ref={end} />
      </div>

      <div>
        {summary && (
          <div role="region" aria-label="Resumo da conversa" className="mx-3 mt-3 rounded-lg border bg-card p-3 text-sm">
            <div className="flex items-start justify-between gap-2">
              <p className="flex items-center gap-1.5 text-xs font-medium text-brand-text">
                <Sparkles className="size-3.5" aria-hidden="true" />
                Resumo da Aura
              </p>
              <button type="button" aria-label="Fechar resumo" onClick={() => setSummary(false)} className="flex size-6 items-center justify-center rounded-md text-muted-foreground outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring">
                <X className="size-3.5" />
              </button>
            </div>
            <p className="mt-1.5 leading-relaxed">{summarize(thread, who, deal)}</p>
          </div>
        )}
        <Composer key={thread.id} thread={thread} contact={who} />
      </div>
    </div>
  )
}

function ConversationDay({ label, children }: { label: string | null; children: ReactNode }) {
  return (
    <>
      {label && (
        <li className="flex items-center gap-3 py-1 text-xs font-medium text-muted-foreground" aria-hidden="false">
          <span className="h-px flex-1 bg-border" />
          {label}
          <span className="h-px flex-1 bg-border" />
        </li>
      )}
      {children}
    </>
  )
}

/* ------------------------------------------------------------------ painel do cliente */

function Block({ title, children, defaultOpen = true }: { title: string; children: ReactNode; defaultOpen?: boolean }) {
  return (
    <details open={defaultOpen} className="group border-b">
      <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-semibold outline-none hover:bg-muted/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset [&::-webkit-details-marker]:hidden">
        {title}
        <ChevronDown className="size-4 text-muted-foreground transition-transform group-open:rotate-180" aria-hidden="true" />
      </summary>
      <div className="px-4 pb-4">{children}</div>
    </details>
  )
}

function DataEditor({ contact }: { contact: Contact }) {
  const { patchContact } = useCrm()
  const [k, setK] = useState('')
  const [v, setV] = useState('')
  const entries = Object.entries(contact.data)
  return (
    <div className="grid gap-2">
      {entries.length === 0 && <p className="text-xs text-muted-foreground">Nenhum dado extra. Guarde aqui o que a equipe precisa lembrar.</p>}
      {entries.length > 0 && (
        <dl className="overflow-hidden rounded-lg border text-sm">
          {entries.map(([key, val]) => (
            <div key={key} className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)_auto] items-center border-b last:border-b-0">
              <dt className="truncate border-l-2 border-primary px-2.5 py-2 font-medium">{key}</dt>
              <dd className="truncate px-2.5 py-2 text-muted-foreground">{val}</dd>
              <button
                type="button"
                aria-label={`Remover ${key}`}
                onClick={() => {
                  const rest = { ...contact.data }
                  delete rest[key]
                  patchContact(contact.id, { data: rest })
                }}
                className="mr-1 flex size-6 items-center justify-center rounded text-muted-foreground outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
              >
                <X className="size-3.5" />
              </button>
            </div>
          ))}
        </dl>
      )}
      <form
        className="grid grid-cols-[1fr_1fr_auto] gap-1.5"
        onSubmit={(e) => {
          e.preventDefault()
          if (!k.trim() || !v.trim()) return
          patchContact(contact.id, { data: { ...contact.data, [k.trim()]: v.trim() } })
          setK('')
          setV('')
        }}
      >
        <TextField size="sm" aria-label="Nome do dado" placeholder="Dado" value={k} onChange={(e) => setK(e.target.value)} maxLength={30} />
        <TextField size="sm" aria-label="Valor do dado" placeholder="Valor" value={v} onChange={(e) => setV(e.target.value)} maxLength={60} />
        <Button type="submit" size="sm" variant="secondary" aria-label="Adicionar dado" disabled={!k.trim() || !v.trim()}>
          <Plus className="size-4" />
        </Button>
      </form>
    </div>
  )
}

function ClientPanel({ thread }: { thread: Thread }) {
  const navigate = useNavigate()
  const { contact, company, dealsOf, assign, setQueue, patchContact, addDeal } = useCrm()
  const who = contact(thread.contactId)
  const [newDeal, setNewDeal] = useState(false)
  const [dealTitle, setDealTitle] = useState('')
  if (!who) return <p className="p-4 text-sm text-muted-foreground">Este contato foi excluído.</p>
  const org = company(who.companyId)
  const deals = dealsOf(who.id)
  const history = thread.items.filter((i): i is Extract<TimelineItem, { kind: 'evento' }> => i.kind === 'evento' && i.text.startsWith('Recebeu a campanha'))
  const won = deals.filter((d) => d.stage === 'ganho')
  return (
    <div className="relative h-full overflow-y-auto pb-24">
      <div className="border-b p-4">
        <div className="flex items-start gap-3">
          <Avatar className="size-12">
            <AvatarFallback className="bg-brand-soft text-sm font-semibold text-brand-text">{initials(who.name)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate font-semibold">{who.name}</p>
            {org && (
              <p className="truncate text-sm text-muted-foreground">
                {who.role ? `${who.role}, ` : ''}
                {org.name}
              </p>
            )}
            {who.email && <p className="truncate text-sm text-brand-text">{who.email}</p>}
            <p className="text-sm text-muted-foreground">{[who.phone, who.city].filter(Boolean).join(' · ')}</p>
          </div>
        </div>
        <Button variant="secondary" icon={<UserRound />} className="mt-3 w-full" onClick={() => navigate(`/clientes?aba=contatos&contato=${who.id}`)}>
          Abrir ficha completa
        </Button>
      </div>

      <Block title="Atendimento">
        <div className="grid gap-2.5">
          <Select size="sm" label="Responsável" value={thread.assignee ?? ''} options={[{ value: '', label: 'Sem responsável' }, ...TEAM.map((m) => ({ value: m.id, label: `${m.name}${m.online ? '' : ' (offline)'}`, description: m.team }))]} onChange={(v) => (assign(thread.id, v || null), toast(`Conversa com ${v ? memberName(v) : 'ninguém'}`))} />
          <Select size="sm" label="Fila" value={thread.queue} options={QUEUES.map((q) => ({ value: q.id, label: q.name }))} onChange={(v) => setQueue(thread.id, v)} />
        </div>
      </Block>

      <Block title={`Negócios (${deals.length})`}>
        <div className="grid gap-2">
          {deals.length === 0 && <p className="text-xs text-muted-foreground">Nenhum negócio com este contato ainda.</p>}
          {[...deals].reverse().map((d) => (
            <DealCard key={d.id} deal={d} />
          ))}
          {newDeal ? (
            <form
              className="grid gap-2 rounded-lg border border-dashed p-3"
              onSubmit={(e) => {
                e.preventDefault()
                if (dealTitle.trim().length < 3) return
                addDeal(who.id, dealTitle.trim(), 0)
                setDealTitle('')
                setNewDeal(false)
                toast.success('Negócio criado em Novo')
              }}
            >
              <TextField size="sm" label="Novo negócio" placeholder="Ex.: café para o evento de dezembro" value={dealTitle} onChange={(e) => setDealTitle(e.target.value)} maxLength={80} autoFocus />
              <div className="flex gap-1.5">
                <Button type="submit" size="sm" disabled={dealTitle.trim().length < 3}>
                  Criar negócio
                </Button>
                <Button type="button" size="sm" variant="ghost" onClick={() => setNewDeal(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          ) : (
            <Button size="sm" variant="ghost" icon={<Plus />} onClick={() => setNewDeal(true)}>
              Novo negócio
            </Button>
          )}
        </div>
      </Block>

      <Block title="Origem">
        <p className="text-sm">{who.sourceDetail}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {SOURCES[who.source]}, desde {dateLabel(who.createdAt)}
        </p>
      </Block>

      <Block title="Consentimento">
        <Switch
          placement="end"
          size="sm"
          checked={who.consent}
          onChange={(e) => patchContact(who.id, { consent: e.target.checked })}
          label="Aceitou receber mensagens"
          description={who.consent ? 'Pode receber campanhas e automações.' : 'Fica fora de campanhas e automações (LGPD). Responder às mensagens dele continua permitido.'}
        />
        {!who.consent && (
          <p className="mt-2 flex items-start gap-1.5 text-xs text-warning">
            <ShieldAlert className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
            Registre o aceite só se a pessoa pediu ou concordou.
          </p>
        )}
      </Block>

      <Block title="Etiquetas">
        <TagInput aria-label="Etiquetas do contato" placeholder="Adicionar etiqueta" max={8} value={who.tags} onChange={(tags) => patchContact(who.id, { tags })} normalize={(t) => t.trim().toLowerCase()} />
      </Block>

      <Block title="Dados" defaultOpen={Object.keys(who.data).length > 0}>
        <DataEditor contact={who} />
      </Block>

      <Block title="Histórico" defaultOpen={false}>
        <ul className="grid gap-1.5 text-sm">
          <li>Contato desde {dateLabel(who.createdAt)}</li>
          <li>
            {won.length === 0 ? 'Nenhuma compra fechada' : `${won.length} ${won.length === 1 ? 'negócio fechado' : 'negócios fechados'}, ${brl(won.reduce((n, d) => n + d.value, 0))}`}
          </li>
          {history.map((h) => (
            <li key={h.id} className="text-muted-foreground">
              {h.text} em {dateLabel(h.at)}
            </li>
          ))}
          {who.note && <li className="mt-1 rounded-md bg-muted/60 p-2 text-xs">{who.note}</li>}
        </ul>
      </Block>
    </div>
  )
}

/* ------------------------------------------------------------------ página */

/* Larguras: com 4 colunas a partir de 1400px, 3 a partir de 1280px (fila vira seletor), 2 abaixo disso e 1 no celular. */
function useWide(min: number) {
  const [ok, setOk] = useState(() => typeof window !== 'undefined' && window.matchMedia(`(min-width: ${min}px)`).matches)
  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${min}px)`)
    const on = (e: MediaQueryListEvent) => setOk(e.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [min])
  return ok
}

function InboxView() {
  const { threads } = useCrm()
  const [params, setParams] = useSearchParams()
  const fila = params.get('fila') ?? 'todas'
  const openId = params.get('id')
  const open = threads.find((t) => t.id === openId) ?? null
  const [clientSheet, setClientSheet] = useState(false)
  const four = useWide(1400)
  const three = useWide(1280)
  const two = useWide(1024)
  const set = (patch: Record<string, string | null>) => {
    const next = new URLSearchParams(params)
    for (const [k, v] of Object.entries(patch)) {
      if (v === null) next.delete(k)
      else next.set(k, v)
    }
    setParams(next, { replace: !('id' in patch) })
  }

  // No desktop, abre a primeira conversa da fila para a tela não começar vazia
  useEffect(() => {
    if (!open && two) {
      const f = filaOf(fila)
      const first = sortThreads(threads.filter(f.match))[0]
      if (first) set({ id: first.id })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fila, two])

  const listVisible = two || !open
  return (
    <div className={cn('grid h-full min-h-0 overflow-hidden', four ? 'grid-cols-[13rem_21rem_minmax(0,1fr)_20rem]' : three ? 'grid-cols-[21rem_minmax(0,1fr)_20rem]' : two ? 'grid-cols-[20rem_minmax(0,1fr)]' : 'grid-cols-1')}>
      {four && (
        <div className="min-h-0 border-r bg-muted/30">
          <Queues threads={threads} current={fila} onPick={(f) => set({ fila: f === 'todas' ? null : f, id: null })} />
        </div>
      )}
      {listVisible && (
        <div className="min-h-0 border-r">
          <ThreadList fila={fila} onFila={(f) => set({ fila: f === 'todas' ? null : f, id: null })} current={open?.id ?? null} onOpen={(id) => set({ id })} showFilaPicker={!four} />
        </div>
      )}
      {(two || open) && (
        <div className="min-h-0">
          {open ? (
            <Conversation key={open.id} thread={open} onBack={() => set({ id: null })} onClient={() => setClientSheet(true)} clientInline={three} />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-1.5 px-6 text-center">
              <Inbox className="size-6 text-muted-foreground" aria-hidden="true" />
              <p className="font-medium">Escolha uma conversa</p>
              <p className="max-w-xs text-sm text-muted-foreground">Todos os canais chegam aqui, numa conversa por cliente. As atrasadas ficam no topo.</p>
            </div>
          )}
        </div>
      )}
      {three && <div className="min-h-0 border-l">{open ? <ClientPanel key={open.id} thread={open} /> : null}</div>}
      {!three && open && (
        <Sheet open={clientSheet} onOpenChange={setClientSheet}>
          <SheetContent className="w-full p-0 sm:max-w-sm">
            <SheetHeader className="sr-only">
              <SheetTitle>Cliente</SheetTitle>
              <SheetDescription>Dados, negócios e histórico do cliente desta conversa.</SheetDescription>
            </SheetHeader>
            <ClientPanel thread={open} />
          </SheetContent>
        </Sheet>
      )}
    </div>
  )
}

const TABS = ['caixa', 'campanhas'] as const
type Tab = (typeof TABS)[number]

export function Atendimento() {
  const { unread, threads } = useCrm()
  const [params, setParams] = useSearchParams()
  const raw = params.get('aba') as Tab | null
  const tab: Tab = raw && TABS.includes(raw) ? raw : 'caixa'
  const late = threads.filter(isLate).length
  const { open, setOpen, isMobile } = useSidebar()

  // Na caixa de entrada, o menu do app recolhe para ícones para caberem as quatro colunas; ao sair, volta como estava.
  useEffect(() => {
    if (isMobile || tab !== 'caixa') return
    const was = open
    setOpen(false)
    return () => setOpen(was)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, isMobile])

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b px-4 py-2.5 md:px-5">
        <div className="min-w-0">
          <h1 className="text-lg font-semibold tracking-tight">Atendimento</h1>
          <p className="text-xs text-muted-foreground">
            {unread === 0 ? 'Todas as conversas estão respondidas.' : `${unread} ${unread === 1 ? 'conversa não lida' : 'conversas não lidas'}`}
            {late > 0 && <span className="font-medium text-destructive">{`, ${late} ${late === 1 ? 'atrasada' : 'atrasadas'}`}</span>}
            {unread > 0 && '.'}
          </p>
        </div>
        <SegmentedControl<Tab>
          variant="underline"
          kind="tabs"
          aria-label="Seções do atendimento"
          value={tab}
          onChange={(t) => setParams(t === 'caixa' ? {} : { aba: t }, { replace: true })}
          options={[
            { value: 'caixa', label: 'Caixa de entrada', count: unread || undefined, controls: 'painel-atendimento' },
            { value: 'campanhas', label: 'Campanhas', controls: 'painel-atendimento' },
          ]}
        />
        {tab === 'campanhas' && !params.get('campanha') && (
          <div className="ml-auto">
            <Button icon={<Plus />} onClick={() => setParams({ aba: 'campanhas', campanha: 'nova' })}>
              Criar campanha
            </Button>
          </div>
        )}
      </div>
      <div id="painel-atendimento" role="tabpanel" className="min-h-0 flex-1">
        {tab === 'caixa' ? (
          <InboxView />
        ) : (
          <div className="relative h-full overflow-y-auto">
            <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-8">
              <CampaignsPanel campaignId={params.get('campanha')} onOpen={(id) => setParams({ aba: 'campanhas', campanha: id })} onClose={() => setParams({ aba: 'campanhas' })} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
