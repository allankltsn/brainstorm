import { Check, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'
import { toast } from 'sonner'
import { Button } from '@/components/affect/button'
import { NumberTicker } from '@/components/affect/number-ticker'
import { TextArea } from '@/components/affect/text-area'
import { PageHeader, Pill, Section } from '@/components/page'
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { SECTIONS, useBrand } from '@/lib/brand'
import { channelOf, formatOf, useContent, whenLabel } from '@/lib/content'
import { AI_CREDITS, firstName, leadSources, leadsWeek, replyDrafts, session, TODAY_LABEL, type ReplyDraft } from '@/lib/data'

function Kpi({ label, children, foot }: { label: string; children: React.ReactNode; foot?: React.ReactNode }) {
  return (
    <div className="min-w-0 rounded-xl border bg-card p-4 sm:p-5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight tabular-nums sm:text-3xl">{children}</p>
      {foot && <div className="mt-3 text-xs text-muted-foreground">{foot}</div>}
    </div>
  )
}

const chartConfig = { leads: { label: 'Leads', color: 'var(--chart-1)' } } satisfies ChartConfig

const STATUS_LABEL = { vazio: 'Falta fazer', sugerido: 'Falta aprovar', aprovado: 'Aprovado' } as const
const STATUS_TONE = { vazio: 'neutral', sugerido: 'warning', aprovado: 'success' } as const

export function Inicio() {
  const navigate = useNavigate()
  const { kit, approved } = useBrand()
  const { queue, scheduled, remove, restore } = useContent()
  const [replies, setReplies] = useState(replyDrafts)
  const [open, setOpen] = useState<ReplyDraft | null>(null)
  const pendingCount = queue.length + replies.length
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const totalLeads = leadSources.reduce((n, s) => n + s.leads, 0)
  const topSource = Math.max(...leadSources.map((s) => s.leads))

  const done = (d: ReplyDraft, message: string) => {
    setReplies((l) => l.filter((x) => x.id !== d.id))
    toast.success(message, { action: { label: 'Desfazer', onClick: () => setReplies((l) => [d, ...l.filter((x) => x.id !== d.id)]) } })
  }

  return (
    <>
      <PageHeader
        title={`Olá, ${firstName(session.name)}`}
        description={
          <>
            Hoje é {TODAY_LABEL}.{' '}
            <strong className="font-medium text-foreground">
              {pendingCount === 0 ? 'Nada pendente' : `${pendingCount} ${pendingCount === 1 ? 'rascunho espera' : 'rascunhos esperam'} a sua aprovação`}
            </strong>
            .
          </>
        }
        actions={
          <Button icon={<Sparkles />} onClick={() => navigate('/conteudo')}>
            Criar rascunho
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Section title="Precisa de você" description="A Aura só sugere. Nada é publicado ou enviado sem a sua aprovação." className="min-w-0 lg:col-span-2">
          {pendingCount === 0 ? (
            <div className="flex flex-col items-center gap-1.5 py-8 text-center">
              <span className="flex size-10 items-center justify-center rounded-full bg-success-soft text-success">
                <Check className="size-5" />
              </span>
              <p className="font-medium">Tudo em dia</p>
              <p className="text-sm text-muted-foreground">Nenhum rascunho espera por você agora.</p>
            </div>
          ) : (
            <ul className="-mx-2 divide-y">
              {queue.map((c) => (
                <li key={c.id} className="flex flex-wrap items-center gap-x-4 gap-y-2.5 px-2 py-3.5">
                  <div className="min-w-0 flex-1 basis-64">
                    <p className="flex flex-wrap items-center gap-2 text-sm font-medium">
                      {c.headline}
                      <Pill tone="brand">
                        {formatOf(c.format).label} para {channelOf(c.channel).label}
                      </Pill>
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">Sugerido para {whenLabel(c.when)}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        remove(c.id)
                        toast(`"${c.headline}" foi descartado`, { action: { label: 'Desfazer', onClick: () => restore(c) } })
                      }}
                    >
                      Descartar
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => navigate(`/conteudo?aba=fila&id=${c.id}`)}>
                      Revisar
                    </Button>
                  </div>
                </li>
              ))}
              {replies.map((d) => (
                <li key={d.id} className="flex flex-wrap items-center gap-x-4 gap-y-2.5 px-2 py-3.5">
                  <div className="min-w-0 flex-1 basis-64">
                    <p className="flex flex-wrap items-center gap-2 text-sm font-medium">
                      {d.title}
                      <Pill tone="info">Resposta no {d.channel}</Pill>
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{d.when}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" onClick={() => done(d, `"${d.title}" foi descartada`)}>
                      Descartar
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        setText(d.text)
                        setOpen(d)
                      }}
                    >
                      Revisar
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Section>

        <Section
          title="Brand kit"
          description={kit.briefingDone ? `${approved} de ${SECTIONS.length} partes aprovadas` : 'Comece pelo briefing'}
          className="min-w-0"
          action={
            <Link to="/marca" className="text-sm font-medium text-brand-text underline-offset-4 hover:underline">
              Abrir
            </Link>
          }
        >
          <Progress value={(approved / SECTIONS.length) * 100} className="mb-4 h-1.5" aria-label={`${approved} de ${SECTIONS.length} partes do brand kit aprovadas`} />
          <ul className="grid gap-3">
            {SECTIONS.map((s) => (
              <li key={s.id} className="flex items-center justify-between gap-3 text-sm">
                <Link to={`/marca?aba=${s.id}`} className="font-medium underline-offset-4 hover:underline">
                  {s.label}
                </Link>
                <Pill tone={STATUS_TONE[kit.status[s.id]]}>{STATUS_LABEL[kit.status[s.id]]}</Pill>
              </li>
            ))}
          </ul>
        </Section>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <Kpi label="Leads em 7 dias" foot="12 a mais que na semana passada">
          <NumberTicker value={totalLeads} />
        </Kpi>
        <Kpi label="Posts publicados no mês" foot={`${scheduled.length} ${scheduled.length === 1 ? 'agendado' : 'agendados'} para os próximos dias`}>
          <NumberTicker value={14} />
        </Kpi>
        <Kpi label="Conversas sem resposta" foot="A mais antiga chegou há 40 min">
          <NumberTicker value={1} />
        </Kpi>
        <Kpi
          label="Créditos de IA"
          foot={
            <>
              <Progress value={(AI_CREDITS.used / AI_CREDITS.total) * 100} className="mb-2 h-1.5" aria-label={`${AI_CREDITS.used} de ${AI_CREDITS.total} créditos usados`} />
              Renovam em 03/12
            </>
          }
        >
          <NumberTicker value={AI_CREDITS.used} /> <span className="text-base font-normal text-muted-foreground">de {AI_CREDITS.total.toLocaleString('pt-BR')}</span>
        </Kpi>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Section title="Leads por dia" description="Últimos 7 dias, todos os canais" className="min-w-0 lg:col-span-2">
          <ChartContainer config={chartConfig} className="h-52 w-full">
            <BarChart data={leadsWeek} margin={{ top: 8, left: 0, right: 0 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="dia" tickLine={false} axisLine={false} tickMargin={8} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideIndicator />} />
              <Bar dataKey="leads" fill="var(--color-leads)" radius={6} maxBarSize={44} />
            </BarChart>
          </ChartContainer>
        </Section>
        <Section title="De onde vêm os leads" description="Origem registrada em cada contato" className="min-w-0">
          <ul className="grid gap-3.5">
            {leadSources.map((s) => (
              <li key={s.source}>
                <div className="mb-1.5 flex justify-between text-sm">
                  <span>{s.source}</span>
                  <span className="text-muted-foreground tabular-nums">{s.leads}</span>
                </div>
                <Progress value={(s.leads / topSource) * 100} className="h-1.5" aria-label={`${s.source}: ${s.leads} leads`} />
              </li>
            ))}
          </ul>
        </Section>
      </div>

      <Dialog open={open !== null} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{open?.title}</DialogTitle>
            <DialogDescription>
Resposta no {open?.channel}. A Aura escreveu no tom de voz da sua marca. Ajuste o que quiser antes de enviar.
            </DialogDescription>
          </DialogHeader>
          <TextArea aria-label="Texto do rascunho" minRows={4} maxRows={10} maxLength={600} counter value={text} onChange={(e) => setText(e.target.value)} />
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(null)}>
              Agora não
            </Button>
            <Button
              loading={sending}
              disabled={!text.trim()}
              onClick={() => {
                setSending(true)
                setTimeout(() => {
                  setSending(false)
                  if (open) done(open, 'Resposta enviada')
                  setOpen(null)
                }, 800)
              }}
            >
              {sending ? 'Enviando' : 'Aprovar e enviar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
