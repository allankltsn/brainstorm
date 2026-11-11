import { ArrowLeft, MessageSquareOff, Send } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/affect/button'
import { TextArea } from '@/components/affect/text-area'
import { PageHeader, Person } from '@/components/page'
import { EmptyState, ErrorState, ListSkeleton } from '@/components/states'
import { useLoad } from '@/lib/use-load'
import { cn } from '@/lib/utils'

type Msg = { me: boolean; text: string; at: string }
const START: { id: string; name: string; unread: boolean; msgs: Msg[] }[] = [
  {
    id: 'c1',
    name: 'Marina Lopes',
    unread: true,
    msgs: [
      { me: true, text: 'Oi, Marina! Vi que a semana foi corrida. Como você está?', at: 'ontem, 18:20' },
      { me: false, text: 'Oi, Carla! Foi puxado no trabalho. Consigo voltar na quinta.', at: 'hoje, 09:12' },
    ],
  },
  { id: 'c2', name: 'Felipe Almeida', unread: false, msgs: [{ me: false, text: 'O tornozelo melhorou, posso fazer bicicleta.', at: 'ontem, 20:05' }] },
  { id: 'c3', name: 'Carlos Nunes', unread: false, msgs: [{ me: true, text: 'Boa! Semana que vem aumentamos a carga.', at: 'seg, 08:30' }] },
]

export function Mensagens() {
  const { state, empty, retry } = useLoad()
  const [chats, setChats] = useState(START)
  const [id, setId] = useState<string | null>(null)
  const [draft, setDraft] = useState('')
  const chat = chats.find((c) => c.id === id)

  const send = () => {
    const text = draft.trim()
    if (!text || !chat) return
    setChats((l) => l.map((c) => (c.id === chat.id ? { ...c, msgs: [...c.msgs, { me: true, text, at: 'agora' }] } : c)))
    setDraft('')
  }
  const open = (cid: string) => {
    setId(cid)
    setChats((l) => l.map((c) => (c.id === cid ? { ...c, unread: false } : c)))
  }

  return (
    <>
      <PageHeader title="Mensagens" description="Conversas com seus alunos." className={cn(chat && 'hidden md:flex')} />
      {state === 'carregando' && <ListSkeleton rows={3} label="Carregando suas conversas" />}
      {state === 'erro' && <ErrorState what="suas conversas" onRetry={retry} />}
      {state === 'pronto' && empty && <EmptyState icon={<MessageSquareOff />} title="Nenhuma conversa ainda" text="As conversas começam quando você ou a outra pessoa manda a primeira mensagem." />}
      {state === 'pronto' && !empty && (
      <div className="grid gap-4 md:h-[min(34rem,calc(100svh-15rem))] md:grid-cols-[18rem_minmax(0,1fr)]">
        <ul className={cn('grid content-start gap-1 overflow-y-auto rounded-xl border bg-card p-2', chat && 'hidden md:grid')}>
          {chats.map((c) => {
            const last = c.msgs[c.msgs.length - 1]
            return (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => open(c.id)}
                  aria-current={c.id === id}
                  className={cn('flex w-full items-center gap-2 rounded-lg p-2.5 text-left outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring', c.id === id && 'bg-muted')}
                >
                  <span className="min-w-0 flex-1">
                    <Person name={c.name} sub={`${last.me ? 'Você: ' : ''}${last.text}`} />
                  </span>
                  {c.unread && <span className="size-2.5 shrink-0 rounded-full bg-primary" aria-label="Não lida" />}
                </button>
              </li>
            )
          })}
        </ul>

        {chat ? (
          <section className="flex min-h-[26rem] flex-col overflow-hidden rounded-xl border bg-card" aria-label={`Conversa com ${chat.name}`}>
            <header className="flex items-center gap-2 border-b p-3">
              <button type="button" className="rounded-md p-1.5 text-muted-foreground hover:bg-muted md:hidden" aria-label="Voltar para as conversas" onClick={() => setId(null)}>
                <ArrowLeft className="size-4" />
              </button>
              <Person name={chat.name} size="sm" />
            </header>
            <ol className="flex-1 space-y-3 overflow-y-auto p-4">
              {chat.msgs.map((m, i) => (
                <li key={i} className={cn('flex flex-col', m.me ? 'items-end' : 'items-start')}>
                  <p className={cn('max-w-[80%] rounded-2xl px-3.5 py-2 text-sm', m.me ? 'rounded-br-md bg-primary text-primary-foreground' : 'rounded-bl-md bg-muted')}>{m.text}</p>
                  <span className="mt-1 px-1 text-[11px] text-muted-foreground">{m.at}</span>
                </li>
              ))}
            </ol>
            <footer className="flex items-end gap-2 border-t p-3">
              <TextArea aria-label="Escrever mensagem" placeholder="Escreva uma mensagem" minRows={1} maxRows={4} value={draft} onChange={(e) => setDraft(e.target.value)} onSubmitShortcut={send} className="flex-1" />
              <Button icon={<Send />} disabled={!draft.trim()} onClick={send}>
                Enviar
              </Button>
            </footer>
          </section>
        ) : (
          <div className="hidden items-center justify-center rounded-xl border border-dashed text-sm text-muted-foreground md:flex">Escolha uma conversa para ler e responder.</div>
        )}
      </div>
      )}
    </>
  )
}
