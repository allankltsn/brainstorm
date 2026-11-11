import { CheckCircle2, Clock, MessageSquare, Send, TrendingDown, TriangleAlert } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/affect/button'
import { SegmentedControl } from '@/components/affect/segmented-control'
import { PageHeader, Person, Pill, Section } from '@/components/page'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { BarsChart, HBars, TrendChart } from '@/components/charts/charts'
import { NumberTicker } from '@/components/affect/number-ticker'
import { adherenceByPlan, avgByWeekday, students, trend8 } from '@/lib/data'
import { useTab } from '@/lib/use-tab'

const TABS = ['alertas', 'frequencia', 'relatorios', 'feitos', 'questionarios'] as const
type Tab = (typeof TABS)[number]

const ALERTS = [
  { id: 'a1', name: 'Marina Lopes', sid: 's01', text: 'Faltou 2 das últimas 4 sessões', when: 'há 2 dias' },
  { id: 'a2', name: 'Felipe Almeida', sid: 's02', text: 'Relatou dor no tornozelo no questionário', when: 'ontem' },
]
const DONE = [
  ['Carlos Nunes', 'Força base · Treino A', 'Hoje, 07:40', '52 min', 'Moderado'],
  ['Beatriz Cunha', 'Treino A/B · Treino B', 'Hoje, 06:55', '47 min', 'Leve'],
  ['Helena Matos', 'ABC · Treino C', 'Ontem, 19:10', '58 min', 'Intenso'],
  ['Júlia Campos', 'ABC · Treino A', 'Ontem, 18:02', '44 min', 'Moderado'],
  ['Larissa Prado', 'Treino A/B · Treino A', 'Ontem, 07:15', '50 min', 'Moderado'],
] as const
const FORMS = [
  { name: 'Marina Lopes', form: 'Rotina da semana', status: 'respondido', when: 'há 20 min' },
  { name: 'Felipe Almeida', form: 'Rotina da semana', status: 'respondido', when: 'ontem' },
  { name: 'Carlos Nunes', form: 'Rotina da semana', status: 'pendente', when: 'enviado há 3 dias' },
  { name: 'Paulo Ramos', form: 'Primeira avaliação', status: 'pendente', when: 'enviado há 5 dias' },
] as const

/* Relatórios: números do período, tendência contra o período anterior, dias fortes e adesão por plano. */
function Relatorios() {
  const [weeks, setWeeks] = useState<'4' | '8'>('8')
  const data = trend8.slice(-Number(weeks))
  const total = data.reduce((t, d) => t + d.feitos, 0)
  const before = data.reduce((t, d) => t + d.anterior, 0)
  const growth = Math.round(((total - before) / before) * 100)
  const adherence = Math.round(adherenceByPlan.reduce((t, p) => t + p.pct * p.students, 0) / adherenceByPlan.reduce((t, p) => t + p.students, 0))
  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">Passe o mouse sobre os gráficos para ver os valores de cada ponto.</p>
        <SegmentedControl aria-label="Período" size="sm" value={weeks} onChange={setWeeks} options={[{ value: '4', label: '4 semanas' }, { value: '8', label: '8 semanas' }]} />
      </div>
      <dl className="grid gap-4 sm:grid-cols-3">
        {[
          ['Treinos concluídos', <NumberTicker key="t" value={total} />, <Pill key="p" tone={growth >= 0 ? 'success' : 'warning'}>{growth >= 0 ? '+' : ''}{growth}% sobre o período anterior</Pill>],
          ['Adesão média', <NumberTicker key="a" value={adherence} format={{ style: 'unit', unit: 'percent' }} />, <span key="s">dos treinos programados</span>],
          ['Duração média', <NumberTicker key="d" value={46} format={{ style: 'unit', unit: 'minute', unitDisplay: 'narrow' }} />, <span key="s">por sessão</span>],
        ].map(([k, v, f]) => (
          <div key={String(k)} className="rounded-xl border bg-card p-4 sm:p-5">
            <dt className="text-sm text-muted-foreground">{k}</dt>
            <dd className="mt-2 text-3xl font-semibold tracking-tight tabular-nums">{v}</dd>
            <dd className="mt-3 text-xs text-muted-foreground">{f}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        <Section title="Treinos por semana" description="Semana atual contra a mesma janela do período anterior" className="min-w-0 lg:col-span-3">
          <TrendChart
            key={weeks}
            data={data}
            xKey="semana"
            series={[
              { key: 'feitos', label: 'Este período', color: 'var(--chart-1)' },
              { key: 'anterior', label: 'Período anterior', color: 'var(--chart-4)', dashed: true },
            ]}
          />
          <ul className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
            <li className="inline-flex items-center gap-1.5"><span className="h-0.5 w-4 rounded bg-[var(--chart-1)]" /> Este período</li>
            <li className="inline-flex items-center gap-1.5"><span className="h-0.5 w-4 rounded border-t-2 border-dashed border-[var(--chart-4)]" /> Período anterior</li>
          </ul>
        </Section>
        <Section title="Dias mais fortes" description="Média de treinos por dia da semana" className="min-w-0 lg:col-span-2">
          <BarsChart data={avgByWeekday} xKey="dia" yKey="treinos" label="Média" highlight={2} format={(v) => `${v.toLocaleString('pt-BR')} treinos`} />
        </Section>
      </div>
      <Section title="Adesão por plano" description="Treinos feitos sobre os programados, nas últimas 4 semanas" className="mt-6">
        <HBars rows={adherenceByPlan.map((p) => ({ id: p.plan, label: p.plan, sub: `${p.students} ${p.students === 1 ? 'aluno' : 'alunos'}`, value: p.pct, max: 100 }))} />
      </Section>
    </>
  )
}

/* Frequência: quem mais treinou no período e quem está caindo, para agir antes de o aluno parar. */
function Frequencia() {
  const navigate = useNavigate()
  const [period, setPeriod] = useState<'semana' | 'mes'>('semana')
  const k = period === 'semana' ? 1 : 4
  const rows = students
    .filter((s) => s.status === 'ativo' && s.plan)
    .map((s, i) => {
      const planned = (3 + (i % 3)) * k
      const missed = Math.min(planned, Math.round(((s.lastSessionDays ?? 0) / 7) * (planned / k)) + (period === 'mes' ? i % 3 : 0))
      return { s, planned, done: planned - missed, falling: (s.lastSessionDays ?? 0) >= 7 }
    })
    .sort((a, b) => b.done / b.planned - a.done / a.planned)
  const falling = rows.filter((r) => r.falling)
  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {falling.length} de {rows.length} alunos estão com a frequência caindo.
        </p>
        <SegmentedControl
          aria-label="Período"
          size="sm"
          value={period}
          onChange={setPeriod}
          options={[
            { value: 'semana', label: 'Esta semana' },
            { value: 'mes', label: 'Este mês' },
          ]}
        />
      </div>
      <div className="rounded-xl border bg-card p-2 sm:p-3">
        <HBars
          key={period}
          format={(v) => `${v}%`}
          rows={rows.map((r, i) => ({
            id: r.s.id,
            label: <Person name={r.s.name} sub={`${r.done} de ${r.planned} treinos · ${r.s.plan}`} size="sm" />,
            value: Math.round((r.done / r.planned) * 100),
            max: 100,
            right: (
              <div className="flex w-full items-center justify-end gap-2 sm:w-44">
                {r.falling ? (
                  <>
                    <Pill tone="warning" icon={<TrendingDown />}>
                      Caindo
                    </Pill>
                    <Button size="sm" variant="secondary" onClick={() => navigate('/mensagens')}>
                      Conversar
                    </Button>
                  </>
                ) : (
                  i < 3 && <Pill tone="success">Em alta</Pill>
                )}
              </div>
            ),
          }))}
        />
      </div>
    </>
  )
}

export function Acompanhamento() {
  const navigate = useNavigate()
  const [tab, setTab] = useTab<Tab>(TABS)
  const [alerts, setAlerts] = useState(ALERTS)
  return (
    <>
      <PageHeader
        title="Acompanhar"
        description="O que pede sua atenção e como os alunos estão treinando."
        actions={
          <Button icon={<Send />} onClick={() => toast.success('Questionário enviado')}>
            Enviar questionário
          </Button>
        }
      />
      <SegmentedControl<Tab>
        variant="underline"
        kind="tabs"
        aria-label="Seções de acompanhamento"
        value={tab}
        onChange={setTab}
        className="mb-6"
        options={[
          { value: 'alertas', label: 'Alertas', count: alerts.length, controls: 'painel-acomp' },
          { value: 'frequencia', label: 'Frequência', controls: 'painel-acomp' },
          { value: 'relatorios', label: 'Relatórios', controls: 'painel-acomp' },
          { value: 'feitos', label: 'Treinos feitos', controls: 'painel-acomp' },
          { value: 'questionarios', label: 'Questionários', controls: 'painel-acomp' },
        ]}
      />
      <div id="painel-acomp" role="tabpanel">
        {tab === 'alertas' &&
          (alerts.length === 0 ? (
            <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed px-6 py-16 text-center">
              <CheckCircle2 className="size-8 text-success" />
              <p className="font-medium">Nenhum alerta aberto</p>
              <p className="text-sm text-muted-foreground">Tudo em dia com seus alunos.</p>
            </div>
          ) : (
            <ul className="grid gap-3">
              {alerts.map((a) => (
                <li key={a.id} className="flex flex-wrap items-center gap-x-4 gap-y-3 rounded-xl border bg-card p-4">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-warning-soft text-warning">
                    <TriangleAlert className="size-4.5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{a.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {a.text} · {a.when}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="ghost" onClick={() => navigate(`/alunos/${a.sid}`)}>
                      Ver aluno
                    </Button>
                    <Button size="sm" variant="secondary" icon={<MessageSquare />} onClick={() => navigate('/mensagens')}>
                      Conversar
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        setAlerts((l) => l.filter((x) => x.id !== a.id))
                        toast.success('Alerta resolvido')
                      }}
                    >
                      Marcar como resolvido
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          ))}
        {tab === 'frequencia' && <Frequencia />}
        {tab === 'relatorios' && <Relatorios />}
        {tab === 'feitos' && (
          <div className="overflow-hidden rounded-xl border bg-card">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-5">Aluno</TableHead>
                  <TableHead>Treino</TableHead>
                  <TableHead>Quando</TableHead>
                  <TableHead className="hidden sm:table-cell">Duração</TableHead>
                  <TableHead className="hidden pr-5 sm:table-cell">Esforço</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {DONE.map((d) => (
                  <TableRow key={d[0] + d[2]}>
                    <TableCell className="py-3 pl-5">
                      <Person name={d[0]} size="sm" />
                    </TableCell>
                    <TableCell className="text-sm">{d[1]}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{d[2]}</TableCell>
                    <TableCell className="hidden text-sm text-muted-foreground sm:table-cell">{d[3]}</TableCell>
                    <TableCell className="hidden pr-5 sm:table-cell">
                      <Pill tone={d[4] === 'Intenso' ? 'warning' : 'neutral'}>{d[4]}</Pill>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        {tab === 'questionarios' && (
          <ul className="grid gap-3">
            {FORMS.map((f) => (
              <li key={f.name} className="flex flex-wrap items-center gap-x-4 gap-y-3 rounded-xl border bg-card p-4">
                <div className="min-w-0 flex-1">
                  <Person name={f.name} sub={`${f.form} · ${f.when}`} />
                </div>
                {f.status === 'respondido' ? (
                  <>
                    <Pill tone="success" icon={<CheckCircle2 />}>
                      Respondido
                    </Pill>
                    <Button size="sm" variant="secondary" onClick={() => toast(`Abrindo respostas de ${f.name.split(' ')[0]}`)}>
                      Ver respostas
                    </Button>
                  </>
                ) : (
                  <>
                    <Pill icon={<Clock />}>Aguardando</Pill>
                    <Button size="sm" variant="ghost" onClick={() => toast.success('Lembrete enviado')}>
                      Lembrar aluno
                    </Button>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  )
}
