import { CheckCircle2, Clock, MessageSquare, Send, TrendingDown, TriangleAlert } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/affect/button'
import { SegmentedControl } from '@/components/affect/segmented-control'
import { PageHeader, Person, Pill } from '@/components/page'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Progress } from '@/components/ui/progress'
import { students } from '@/lib/data'
import { useTab } from '@/lib/use-tab'

const TABS = ['alertas', 'frequencia', 'feitos', 'questionarios'] as const
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
      <ol className="overflow-hidden rounded-xl border bg-card">
        {rows.map((r, i) => {
          const pct = Math.round((r.done / r.planned) * 100)
          return (
            <li key={r.s.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b px-4 py-3 last:border-b-0 sm:px-5">
              <span className="w-5 text-sm font-medium text-muted-foreground tabular-nums">{i + 1}</span>
              <div className="min-w-0 flex-1 basis-40">
                <Person name={r.s.name} sub={r.s.plan} size="sm" />
              </div>
              <div className="flex min-w-40 flex-1 items-center gap-3">
                <Progress value={pct} className="h-2" aria-label={`${r.done} de ${r.planned} treinos`} />
                <span className="w-20 shrink-0 text-right text-sm tabular-nums">
                  {r.done} de {r.planned}
                </span>
              </div>
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
            </li>
          )
        })}
      </ol>
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
                    <Button size="sm" variant="secondary" onClick={() => navigate(`/acompanhamento/respostas/${students.find((s) => s.name === f.name)?.id}`)}>
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
