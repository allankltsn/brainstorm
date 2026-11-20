import { Check, Sparkles } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'
import { toast } from 'sonner'
import { Button } from '@/components/affect/button'
import { NumberTicker } from '@/components/affect/number-ticker'
import { SegmentedControl } from '@/components/affect/segmented-control'
import { PageHeader, Pill, Section } from '@/components/page'
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart'
import { Progress } from '@/components/ui/progress'
import { SECTIONS, useBrand } from '@/lib/brand'
import { channelOf, formatOf, useContent, whenLabel } from '@/lib/content'
import { isLate, lastMessage, MSG_CHANNELS, replyChannel, SOURCES, timeLabel, TODAY, useCrm, type Source } from '@/lib/crm'
import { AI_CREDITS, firstName, session, TODAY_LABEL } from '@/lib/data'
import { useTab } from '@/lib/use-tab'
import { Relatorios } from '@/pages/relatorios'

const TABS = ['hoje', 'relatorios'] as const
type Tab = (typeof TABS)[number]

function Kpi({ label, children, foot }: { label: string; children: React.ReactNode; foot?: React.ReactNode }) {
  return (
    <div className="min-w-0 rounded-xl border bg-card p-4 sm:p-5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight tabular-nums sm:text-3xl">{children}</p>
      {foot && <div className="mt-3 text-xs text-muted-foreground">{foot}</div>}
    </div>
  )
}

const chartConfig = { leads: { label: 'Contatos', color: 'var(--chart-1)' } } satisfies ChartConfig
const STATUS_LABEL = { vazio: 'Falta fazer', sugerido: 'Falta aprovar', aprovado: 'Aprovado' } as const
const STATUS_TONE = { vazio: 'neutral', sugerido: 'warning', aprovado: 'success' } as const
const WEEKDAY = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

function Today() {
  const navigate = useNavigate()
  const { kit, approved } = useBrand()
  const { queue, scheduled, published, failed, remove, restore } = useContent()
  const { threads, contacts, contact } = useCrm()
  // conversas que esperam resposta: não lidas ou atrasadas, sem as resolvidas; atrasadas primeiro
  const waiting = threads.filter((t) => t.status !== 'resolvida' && (t.unread || isLate(t))).sort((a, b) => Number(isLate(b)) - Number(isLate(a)))
  const pendingCount = queue.length + waiting.length + failed.length

  // últimos 7 dias, terminando em "hoje"
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(`${TODAY}T00:00`)
    d.setDate(d.getDate() - (6 - i))
    return d
  })
  const week = contacts.filter((x) => x.createdAt >= iso(days[0]))
  const perDay = days.map((d) => ({ dia: WEEKDAY[d.getDay()], leads: contacts.filter((x) => x.createdAt === iso(d)).length }))
  const sources = (Object.keys(SOURCES) as Source[])
    .map((s) => ({ source: SOURCES[s], leads: week.filter((x) => x.source === s).length }))
    .filter((s) => s.leads > 0)
    .sort((a, b) => b.leads - a.leads)
  const topSource = Math.max(1, ...sources.map((s) => s.leads))
  const oldest = waiting.map((t) => lastMessage(t)?.at ?? '').sort()[0]

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-3">
        <Section title="Precisa de você" description="O que não saiu vem primeiro. A Aura só sugere: nada é publicado ou enviado sem a sua aprovação." className="min-w-0 lg:col-span-2">
          {pendingCount === 0 ? (
            <div className="flex flex-col items-center gap-1.5 py-8 text-center">
              <span className="flex size-10 items-center justify-center rounded-full bg-success-soft text-success">
                <Check className="size-5" />
              </span>
              <p className="font-medium">Tudo em dia</p>
              <p className="text-sm text-muted-foreground">Nada espera por você agora.</p>
            </div>
          ) : (
            <ul className="-mx-2 divide-y">
              {failed.map((c) => (
                <li key={c.id} className="flex flex-wrap items-center gap-x-4 gap-y-2.5 px-2 py-3.5">
                  <div className="min-w-0 flex-1 basis-64">
                    <p className="flex flex-wrap items-center gap-2 text-sm font-medium">
                      {c.headline}
                      <Pill tone="danger">Não publicado no {channelOf(c.channel).label}</Pill>
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Era para sair em {whenLabel(c.when)}. {c.failure}
                    </p>
                  </div>
                  <Button size="sm" variant="secondary" onClick={() => navigate('/conteudo?aba=agenda')}>
                    Resolver
                  </Button>
                </li>
              ))}
              {waiting.map((t) => {
                const who = contact(t.contactId)
                return (
                  <li key={t.id} className="flex flex-wrap items-center gap-x-4 gap-y-2.5 px-2 py-3.5">
                    <div className="min-w-0 flex-1 basis-64">
                      <p className="flex flex-wrap items-center gap-2 text-sm font-medium">
                        Mensagem de {who?.name ?? 'um contato'}
                        <Pill tone="info">{MSG_CHANNELS[replyChannel(t)]}</Pill>
                        {isLate(t) && <Pill tone="danger">Atrasada</Pill>}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">{t.suggestion ? 'A Aura deixou uma resposta sugerida para você revisar.' : lastMessage(t)?.text}</p>
                    </div>
                    <Button size="sm" variant="secondary" onClick={() => navigate(`/atendimento?id=${t.id}`)}>
                      Responder
                    </Button>
                  </li>
                )
              })}
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
        <Kpi
          label="Contatos novos em 7 dias"
          foot={
            <Link to="/clientes" className="font-medium text-brand-text hover:underline">
              Abrir o funil
            </Link>
          }
        >
          <NumberTicker value={week.length} />
        </Kpi>
        <Kpi label="Posts publicados" foot={`${scheduled.length} ${scheduled.length === 1 ? 'agendado' : 'agendados'} para os próximos dias`}>
          <NumberTicker value={published.length} />
        </Kpi>
        <Kpi label="Conversas sem resposta" foot={oldest ? `A mais antiga chegou às ${timeLabel(oldest)}` : 'Tudo respondido'}>
          <NumberTicker value={waiting.length} />
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
        <Section title="Contatos por dia" description="Últimos 7 dias, todas as origens" className="min-w-0 lg:col-span-2">
          <ChartContainer config={chartConfig} className="h-52 w-full">
            <BarChart data={perDay} margin={{ top: 8, left: 0, right: 0 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="dia" tickLine={false} axisLine={false} tickMargin={8} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideIndicator />} />
              <Bar dataKey="leads" fill="var(--color-leads)" radius={6} maxBarSize={44} />
            </BarChart>
          </ChartContainer>
        </Section>
        <Section title="De onde vêm os contatos" description="Origem registrada em cada contato, últimos 7 dias" className="min-w-0">
          {sources.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">Nenhum contato novo nesta semana.</p>
          ) : (
            <ul className="grid gap-3.5">
              {sources.map((s) => (
                <li key={s.source}>
                  <div className="mb-1.5 flex justify-between text-sm">
                    <span>{s.source}</span>
                    <span className="text-muted-foreground tabular-nums">{s.leads}</span>
                  </div>
                  <Progress value={(s.leads / topSource) * 100} className="h-1.5" aria-label={`${s.source}: ${s.leads} contatos`} />
                </li>
              ))}
            </ul>
          )}
        </Section>
      </div>
    </>
  )
}

export function Inicio() {
  const navigate = useNavigate()
  const { queue, failed } = useContent()
  const { unread } = useCrm()
  const [tab, setTab] = useTab<Tab>(TABS)
  const pendingCount = queue.length + unread + failed.length
  return (
    <>
      <PageHeader
        title={`Olá, ${firstName(session.name)}`}
        description={
          <>
            Hoje é {TODAY_LABEL}.{' '}
            <strong className="font-medium text-foreground">{pendingCount === 0 ? 'Nada pendente' : `${pendingCount} ${pendingCount === 1 ? 'item espera' : 'itens esperam'} por você`}</strong>.
          </>
        }
        actions={
          <Button icon={<Sparkles />} onClick={() => navigate('/conteudo')}>
            Criar rascunho
          </Button>
        }
      />
      <SegmentedControl<Tab>
        variant="underline"
        kind="tabs"
        aria-label="Seções do início"
        value={tab}
        onChange={setTab}
        className="mb-6"
        options={[
          { value: 'hoje', label: 'Hoje', controls: 'painel-inicio' },
          { value: 'relatorios', label: 'Relatórios', controls: 'painel-inicio' },
        ]}
      />
      <div id="painel-inicio" role="tabpanel">
        {tab === 'relatorios' ? <Relatorios /> : <Today />}
      </div>
    </>
  )
}
