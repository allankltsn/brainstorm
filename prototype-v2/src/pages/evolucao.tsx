import { ArrowLeft, Camera, ClipboardList, Dumbbell, Ruler, TriangleAlert } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Bar, BarChart, CartesianGrid, Line, LineChart, ReferenceLine, XAxis, YAxis } from 'recharts'
import { Button } from '@/components/affect/button'
import { NumberTicker } from '@/components/affect/number-ticker'
import { SegmentedControl } from '@/components/affect/segmented-control'
import { Select } from '@/components/affect/select'
import { PageHeader, Pill, Section } from '@/components/page'
import { EmptyState, ErrorState, ListSkeleton } from '@/components/states'
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { firstName, sessions, students } from '@/lib/data'
import { cm, dateDayMonth, dateLong, dateShort, decimal, kg } from '@/lib/format'
import { checkIns, loadByExercise, pastSessions, WEEKLY_GOAL, weeklyFrequency } from '@/lib/progress'
import { useLoad } from '@/lib/use-load'
import { useRole } from '@/lib/role'
import { useTab } from '@/lib/use-tab'
import { NaoEncontrada } from '@/pages/nao-encontrada'

const TABS = ['resumo', 'treinos', 'medidas'] as const
type Tab = (typeof TABS)[number]

const loadConfig = { carga: { label: 'Carga (kg)', color: 'var(--chart-1)' } } satisfies ChartConfig
const freqConfig = { treinos: { label: 'Treinos', color: 'var(--chart-1)' } } satisfies ChartConfig
const weightConfig = { peso: { label: 'Peso (kg)', color: 'var(--chart-1)' } } satisfies ChartConfig

const EFFORT_TONE = { Leve: 'neutral', Moderado: 'info', Intenso: 'warning' } as const

function Stat({ label, children, foot }: { label: string; children: React.ReactNode; foot: string }) {
  return (
    <div className="min-w-0 rounded-xl border bg-card p-4 sm:p-5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight tabular-nums sm:text-3xl">{children}</p>
      <p className="mt-3 text-xs text-muted-foreground">{foot}</p>
    </div>
  )
}

/* Uma tela, dois públicos: o aluno vê a própria evolução (/evolucao); o personal vê a de um aluno (/alunos/:id/evolucao). */
export function Evolucao() {
  const { id } = useParams()
  const { role } = useRole()
  const navigate = useNavigate()
  const [tab, setTab] = useTab<Tab>(TABS)
  const [exercise, setExercise] = useState(loadByExercise[0].id)
  const { state, empty, retry } = useLoad()

  const student = id ? students.find((s) => s.id === id) : undefined
  if (id && !student) return <NaoEncontrada />
  const own = !student
  const name = student?.name ?? sessions.aluno.name
  const hidden = student ? student.health !== 'liberado' : false

  const sessionsList = empty ? [] : pastSessions
  const entries = empty ? [] : checkIns
  const series = loadByExercise.find((e) => e.id === exercise) ?? loadByExercise[0]
  const gain = series.series[series.series.length - 1].carga - series.series[0].carga
  const weightSeries = [...entries].reverse().map((c) => ({ dia: dateDayMonth(c.date), peso: c.weight }))
  const weightDelta = entries.length > 1 ? entries[0].weight - entries[entries.length - 1].weight : 0
  const hitWeeks = weeklyFrequency.filter((w) => w.treinos >= WEEKLY_GOAL).length

  return (
    <div className="mx-auto max-w-4xl">
      {student && (
        <Link to={`/alunos/${student.id}`} className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> {student.name}
        </Link>
      )}
      <PageHeader
        title={own ? 'Minha evolução' : `Evolução de ${firstName(name)}`}
        description={own ? 'Seus treinos, suas cargas e suas medidas ao longo do tempo.' : 'Treinos feitos, cargas e medidas das últimas 8 semanas.'}
        actions={
          own && role === 'aluno' ? (
            <Button icon={<Ruler />} onClick={() => navigate('/check-in')}>
              Fazer check-in
            </Button>
          ) : undefined
        }
      />

      {hidden ? (
        <EmptyState
          icon={<TriangleAlert />}
          title="Dados ocultos"
          text={`A evolução aparece quando ${firstName(name)} liberar os dados de saúde. Só o aluno pode fazer isso.`}
          action={
            <Button variant="secondary" onClick={() => navigate('/mensagens')}>
              Enviar mensagem
            </Button>
          }
        />
      ) : (
        <>
          <SegmentedControl<Tab>
            variant="underline"
            kind="tabs"
            aria-label="Seções da evolução"
            value={tab}
            onChange={setTab}
            className="mb-6"
            options={[
              { value: 'resumo', label: 'Resumo', controls: 'painel-evolucao' },
              { value: 'treinos', label: 'Treinos feitos', count: sessionsList.length, controls: 'painel-evolucao' },
              { value: 'medidas', label: 'Peso e medidas', controls: 'painel-evolucao' },
            ]}
          />
          <div id="painel-evolucao" role="tabpanel">
            {state === 'carregando' && <ListSkeleton label="Carregando a evolução" />}
            {state === 'erro' && <ErrorState what="a evolução" onRetry={retry} />}
            {state === 'pronto' && sessionsList.length === 0 && (
              <EmptyState
                icon={<Dumbbell />}
                title="Ainda sem treinos registrados"
                text={own ? 'Conclua seu primeiro treino para começar a ver sua evolução aqui.' : `Quando ${firstName(name)} concluir um treino, a evolução aparece aqui.`}
                action={own ? <Button onClick={() => navigate('/treino')}>Abrir treino de hoje</Button> : undefined}
              />
            )}

            {state === 'pronto' && sessionsList.length > 0 && tab === 'resumo' && (
              <div className="grid gap-6">
                <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                  <Stat label="Treinos em outubro" foot="2 a mais que em setembro até o dia 16">
                    <NumberTicker value={5} />
                  </Stat>
                  <Stat label="Semanas na meta" foot={`Meta de ${WEEKLY_GOAL} treinos por semana`}>
                    <NumberTicker value={hitWeeks} /> <span className="text-base font-normal text-muted-foreground">de {weeklyFrequency.length}</span>
                  </Stat>
                  <Stat label="Tempo médio" foot="Por treino, nas últimas 8 semanas">
                    <NumberTicker value={48} /> <span className="text-base font-normal text-muted-foreground">min</span>
                  </Stat>
                  <Stat label="Peso" foot={weightDelta ? `${decimal(Math.abs(weightDelta))} kg ${weightDelta < 0 ? 'a menos' : 'a mais'} desde o primeiro check-in` : 'Sem check-in anterior'}>
                    {decimal(checkIns[0].weight)} <span className="text-base font-normal text-muted-foreground">kg</span>
                  </Stat>
                </div>

                <Section
                  title="Evolução de carga"
                  description={`${gain > 0 ? `+${decimal(gain, 0)} kg` : 'Sem mudança'} em 8 semanas · maior carga de cada semana`}
                  action={<Select aria-label="Exercício" size="sm" className="w-56 max-w-full" value={exercise} onChange={setExercise} options={loadByExercise.map((e) => ({ value: e.id, label: e.name }))} />}
                  className="min-w-0 [&>header]:flex-wrap"
                >
                  <ChartContainer config={loadConfig} className="h-56 w-full">
                    <LineChart data={series.series} margin={{ top: 8, left: 0, right: 12 }}>
                      <CartesianGrid vertical={false} />
                      <XAxis dataKey="semana" tickLine={false} axisLine={false} tickMargin={8} />
                      <YAxis width={36} tickLine={false} axisLine={false} domain={['dataMin - 4', 'dataMax + 4']} />
                      <ChartTooltip content={<ChartTooltipContent hideIndicator />} />
                      <Line dataKey="carga" type="monotone" stroke="var(--color-carga)" strokeWidth={2} dot={{ r: 3, fill: 'var(--color-carga)' }} activeDot={{ r: 5 }} />
                    </LineChart>
                  </ChartContainer>
                </Section>

                <Section title="Frequência por semana" description={`A linha marca a meta de ${WEEKLY_GOAL} treinos`} className="min-w-0">
                  <ChartContainer config={freqConfig} className="h-48 w-full">
                    <BarChart data={weeklyFrequency} margin={{ top: 8, left: 0, right: 0 }}>
                      <CartesianGrid vertical={false} />
                      <XAxis dataKey="semana" tickLine={false} axisLine={false} tickMargin={8} />
                      <ChartTooltip cursor={false} content={<ChartTooltipContent hideIndicator />} />
                      <ReferenceLine y={WEEKLY_GOAL} stroke="var(--muted-foreground)" strokeDasharray="4 4" />
                      <Bar dataKey="treinos" fill="var(--color-treinos)" radius={6} maxBarSize={40} />
                    </BarChart>
                  </ChartContainer>
                </Section>
              </div>
            )}

            {state === 'pronto' && sessionsList.length > 0 && tab === 'treinos' && (
              <ul className="divide-y overflow-hidden rounded-xl border bg-card">
                {sessionsList.map((s) => (
                  <li key={s.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3.5">
                    <div className="min-w-0 flex-1 basis-56">
                      <p className="text-sm font-medium">{s.workout}</p>
                      <p className="text-xs text-muted-foreground first-letter:uppercase">
                        {dateLong(s.date)} · {s.minutes} min · {s.volume.toLocaleString('pt-BR')} kg movidos
                      </p>
                      {s.pain && (
                        <p className="mt-1.5 flex items-start gap-1.5 text-xs text-warning">
                          <TriangleAlert className="mt-0.5 size-3.5 shrink-0" /> {s.pain}
                        </p>
                      )}
                    </div>
                    <Pill tone={EFFORT_TONE[s.effort]}>Esforço {s.effort.toLowerCase()}</Pill>
                  </li>
                ))}
              </ul>
            )}

            {state === 'pronto' && sessionsList.length > 0 && tab === 'medidas' &&
              (entries.length === 0 ? (
                <EmptyState icon={<ClipboardList />} title="Nenhum check-in ainda" text="Registre peso e medidas a cada 15 dias para ver a mudança no gráfico." />
              ) : (
                <div className="grid gap-6">
                  <Section title="Peso" description={`De ${kg(entries[entries.length - 1].weight)} para ${kg(entries[0].weight)}`} className="min-w-0">
                    <ChartContainer config={weightConfig} className="h-48 w-full">
                      <LineChart data={weightSeries} margin={{ top: 8, left: 0, right: 12 }}>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="dia" tickLine={false} axisLine={false} tickMargin={8} />
                        <YAxis width={36} tickLine={false} axisLine={false} domain={['dataMin - 1', 'dataMax + 1']} tickFormatter={(v: number) => decimal(v, 0)} />
                        <ChartTooltip content={<ChartTooltipContent hideIndicator />} />
                        <Line dataKey="peso" type="monotone" stroke="var(--color-peso)" strokeWidth={2} dot={{ r: 3, fill: 'var(--color-peso)' }} activeDot={{ r: 5 }} />
                      </LineChart>
                    </ChartContainer>
                  </Section>

                  <div className="hidden overflow-hidden rounded-xl border bg-card md:block">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="pl-5">Data</TableHead>
                          <TableHead>Peso</TableHead>
                          <TableHead>Cintura</TableHead>
                          <TableHead>Quadril</TableHead>
                          <TableHead>Braço</TableHead>
                          <TableHead>Coxa</TableHead>
                          <TableHead className="pr-5">Fotos</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {entries.map((c) => (
                          <TableRow key={c.id}>
                            <TableCell className="pl-5 font-medium">{dateShort(c.date)}</TableCell>
                            <TableCell className="tabular-nums">{kg(c.weight)}</TableCell>
                            {[c.waist, c.hip, c.arm, c.thigh].map((v, i) => (
                              <TableCell key={i} className="tabular-nums">
                                {v ? cm(v) : <span className="text-muted-foreground">Não medido</span>}
                              </TableCell>
                            ))}
                            <TableCell className="pr-5">{c.photos ? <Pill icon={<Camera />}>{c.photos}</Pill> : <span className="text-sm text-muted-foreground">Nenhuma</span>}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Celular: cartões no lugar da tabela, sem rolagem lateral. */}
                  <ul className="grid gap-2 md:hidden">
                    {entries.map((c) => (
                      <li key={c.id} className="rounded-xl border bg-card p-4">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-medium">{dateShort(c.date)}</p>
                          <p className="text-sm font-semibold tabular-nums">{kg(c.weight)}</p>
                        </div>
                        <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                          {(
                            [
                              ['Cintura', c.waist],
                              ['Quadril', c.hip],
                              ['Braço', c.arm],
                              ['Coxa', c.thigh],
                            ] as const
                          ).map(([k, v]) => (
                            <div key={k} className="flex justify-between gap-2">
                              <dt className="text-muted-foreground">{k}</dt>
                              <dd className="tabular-nums">{v ? cm(v) : 'Não medido'}</dd>
                            </div>
                          ))}
                        </dl>
                        {c.note && <p className="mt-3 text-xs text-muted-foreground">{c.note}</p>}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
          </div>
        </>
      )}
    </div>
  )
}
