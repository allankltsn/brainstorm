import { ChevronDown, Clock, LifeBuoy, Search, SearchX } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/affect/button'
import { SegmentedControl } from '@/components/affect/segmented-control'
import { Select } from '@/components/affect/select'
import { TextArea } from '@/components/affect/text-area'
import { TextField } from '@/components/affect/text-field'
import { PageHeader, Pill, Section } from '@/components/page'
import { EmptyState, ErrorState, ListSkeleton } from '@/components/states'
import { sessions } from '@/lib/data'
import { dateShort } from '@/lib/format'
import { useRole } from '@/lib/role'
import { faqs, SUPPORT_HOURS, SUPPORT_TOPICS, tickets as seed, type Ticket } from '@/lib/support'
import { useLoad } from '@/lib/use-load'
import { useTab } from '@/lib/use-tab'

const TABS = ['ajuda', 'pedir', 'pedidos'] as const
type Tab = (typeof TABS)[number]

const STATUS = {
  aberto: { label: 'Aguardando o suporte', tone: 'warning' },
  respondido: { label: 'Respondido', tone: 'info' },
  resolvido: { label: 'Resolvido', tone: 'success' },
} as const

const norm = (t: string) =>
  t
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')

export function Suporte() {
  const { role } = useRole()
  const [tab, setTab] = useTab<Tab>(TABS)
  const { state, empty, retry } = useLoad()
  const [q, setQ] = useState('')
  const [tickets, setTickets] = useState<Ticket[]>(seed)
  const [topic, setTopic] = useState<string | null>(null)
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState<{ topic?: string; subject?: string; message?: string }>({})
  const [sending, setSending] = useState(false)

  const mine = faqs.filter((f) => f.roles.includes(role))
  const found = mine.filter((f) => norm(`${f.q} ${f.a}`).includes(norm(q.trim())))
  const myTickets = empty ? [] : tickets

  function send(e: React.FormEvent) {
    e.preventDefault()
    const next = {
      topic: topic ? undefined : 'Escolha o assunto.',
      subject: subject.trim() ? undefined : 'Diga em poucas palavras do que se trata.',
      message: message.trim().length >= 10 ? undefined : 'Conte o que aconteceu, com pelo menos 10 letras.',
    }
    setErrors(next)
    if (next.topic || next.subject || next.message) return
    setSending(true)
    setTimeout(() => {
      const label = SUPPORT_TOPICS.find((t) => t.value === topic)?.label ?? ''
      setTickets((l) => [{ id: String(1043 + l.length), subject: subject.trim(), topic: label, status: 'aberto', updated: '2026-10-16', last: message.trim() }, ...l])
      setSubject('')
      setMessage('')
      setTopic(null)
      setSending(false)
      toast.success('Pedido enviado', { description: `A resposta chega em ${sessions[role].email}.` })
      setTab('pedidos')
    }, 800)
  }

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Ajuda e suporte" description="Encontre a resposta ou fale com a gente." />
      <SegmentedControl<Tab>
        variant="underline"
        kind="tabs"
        aria-label="Seções do suporte"
        value={tab}
        onChange={setTab}
        className="mb-6"
        options={[
          { value: 'ajuda', label: 'Dúvidas comuns', controls: 'painel-suporte' },
          { value: 'pedir', label: 'Falar com o suporte', controls: 'painel-suporte' },
          { value: 'pedidos', label: 'Meus pedidos', count: myTickets.length, controls: 'painel-suporte' },
        ]}
      />
      <div id="painel-suporte" role="tabpanel">
        {tab === 'ajuda' && (
          <>
            <TextField aria-label="Buscar nas dúvidas" placeholder="Buscar nas dúvidas" prefix={<Search className="size-4" />} size="lg" clearable value={q} onChange={(e) => setQ(e.target.value)} className="mb-4" />
            {found.length === 0 ? (
              <EmptyState
                icon={<SearchX />}
                title="Nenhuma dúvida parecida"
                text="Tente outras palavras ou fale direto com o suporte."
                action={<Button onClick={() => setTab('pedir')}>Falar com o suporte</Button>}
              />
            ) : (
              <ul className="divide-y overflow-hidden rounded-xl border bg-card">
                {found.map((f) => (
                  <li key={f.id}>
                    <details className="group">
                      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 px-4 py-3.5 text-sm font-medium hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-inset [&::-webkit-details-marker]:hidden">
                        {f.q}
                        <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180 motion-reduce:transition-none" aria-hidden="true" />
                      </summary>
                      <p className="px-4 pb-4 text-sm text-muted-foreground">{f.a}</p>
                    </details>
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-4 text-sm text-muted-foreground">
              Não achou?{' '}
              <button type="button" className="font-medium text-brand-text underline-offset-4 hover:underline" onClick={() => setTab('pedir')}>
                Fale com o suporte
              </button>
              .
            </p>
          </>
        )}

        {tab === 'pedir' && (
          <Section title="Novo pedido" description={SUPPORT_HOURS}>
            <form className="grid gap-5" onSubmit={send} noValidate>
              <Select label="Assunto" placeholder="Escolha o assunto" value={topic} onChange={(v) => setTopic(v)} options={SUPPORT_TOPICS} error={errors.topic} />
              <TextField label="Resumo" placeholder="Ex.: não consigo convidar um aluno" maxLength={80} value={subject} onChange={(e) => setSubject(e.target.value)} error={errors.subject} />
              <TextArea
                label="O que aconteceu?"
                minRows={4}
                maxRows={10}
                maxLength={1000}
                counter
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                error={errors.message}
                hint="Diga em que tela estava e o que esperava ver. Não envie senhas nem dados de saúde."
              />
              <div className="flex justify-end">
                <Button type="submit" loading={sending}>
                  {sending ? 'Enviando' : 'Enviar pedido'}
                </Button>
              </div>
            </form>
          </Section>
        )}

        {tab === 'pedidos' && (
          <>
            {state === 'carregando' && <ListSkeleton rows={2} label="Carregando seus pedidos" />}
            {state === 'erro' && <ErrorState what="seus pedidos" onRetry={retry} />}
            {state === 'pronto' && myTickets.length === 0 && (
              <EmptyState icon={<LifeBuoy />} title="Nenhum pedido aberto" text="Quando você falar com o suporte, a conversa fica guardada aqui." action={<Button onClick={() => setTab('pedir')}>Falar com o suporte</Button>} />
            )}
            {state === 'pronto' && myTickets.length > 0 && (
              <ul className="grid gap-3">
                {myTickets.map((t) => (
                  <li key={t.id} className="rounded-xl border bg-card p-4">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-medium">{t.subject}</p>
                        <p className="text-xs text-muted-foreground">
                          Pedido {t.id} · {t.topic}
                        </p>
                      </div>
                      <Pill tone={STATUS[t.status].tone}>{STATUS[t.status].label}</Pill>
                    </div>
                    <p className="mt-3 rounded-lg bg-muted px-3 py-2 text-sm">{t.last}</p>
                    <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="size-3.5" /> Atualizado em {dateShort(t.updated)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </div>
  )
}
