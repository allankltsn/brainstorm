import { ArrowRight, CalendarDays, Check, MessageSquare, Monitor, Moon, Play, Plus, Timer, User, Users } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'
import { toast } from 'sonner'
import { Button } from '@/components/affect/button'
import { ChangeSummary } from '@/components/affect/change-summary'
import { Checkbox } from '@/components/affect/checkbox'
import { NumberTicker } from '@/components/affect/number-ticker'
import { ProgressTracker } from '@/components/affect/progress-tracker'
import { SmartRecommendation } from '@/components/affect/smart-recommendation'
import { PageHeader, Person, Pill, Section } from '@/components/page'
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart'
import { Progress } from '@/components/ui/progress'
import {
  activeStudents,
  agendaToday,
  firstName,
  revenueMonth,
  sessions,
  STUDENT_LIMIT,
  students,
  TODAY_LABEL,
  todayWorkout,
  week,
  workoutsWeek,
} from '@/lib/data'
import { useRole } from '@/lib/role'
import { cn } from '@/lib/utils'

function Kpi({ label, children, foot }: { label: string; children: React.ReactNode; foot?: React.ReactNode }) {
  return (
    <div className="min-w-0 rounded-xl border bg-card p-4 sm:p-5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight tabular-nums">{children}</p>
      {foot && <div className="mt-3 text-xs text-muted-foreground">{foot}</div>}
    </div>
  )
}

const chartConfig = { treinos: { label: 'Treinos', color: 'var(--chart-1)' } } satisfies ChartConfig

function HomePersonal() {
  const navigate = useNavigate()
  const me = sessions.personal
  const active = activeStudents().length
  const attention = students.filter((s) => s.status === 'ativo' && (s.lastSessionDays ?? 0) >= 7)
  return (
    <>
      <PageHeader
        title={`Olá, ${firstName(me.name)}`}
        description={`Hoje é ${TODAY_LABEL}. Veja como estão seus alunos.`}
        actions={
          <Button icon={<Plus />} onClick={() => toast.success('Convite enviado', { description: 'Você será avisado quando a pessoa aceitar.' })}>
            Convidar aluno
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <Kpi
          label="Alunos ativos"
          foot={
            <>
              <Progress value={(active / STUDENT_LIMIT) * 100} className="mb-2 h-1.5" aria-label={`${active} de ${STUDENT_LIMIT} vagas usadas`} />
              {STUDENT_LIMIT - active} vagas livres no plano Pro
            </>
          }
        >
          <NumberTicker value={active} /> <span className="text-base font-normal text-muted-foreground">de {STUDENT_LIMIT}</span>
        </Kpi>
        <Kpi label="Receita de outubro" foot="Exemplo. O financeiro chega em breve.">
          <NumberTicker value={revenueMonth} locale="pt-BR" format={{ style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }} />
        </Kpi>
        <Kpi label="Sem treinar há 7 dias ou mais" foot="Veja quem são na lista abaixo">
          <NumberTicker value={attention.length} />
        </Kpi>
        <Kpi label="Atendimentos hoje" foot={`Próximo às ${agendaToday[0].time}`}>
          <NumberTicker value={agendaToday.length} />
        </Kpi>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="grid min-w-0 grid-cols-1 content-start gap-6 lg:col-span-2">
          <Section
            title="Alunos que podem precisar de atenção"
            description="Uma conversa costuma ajudar mais que um aviso."
            action={
              <Link to="/alunos" className="inline-flex items-center gap-1 text-sm font-medium text-brand-text hover:underline">
                Ver todos <ArrowRight className="size-3.5" />
              </Link>
            }
          >
            <ul className="-mx-2 divide-y">
              {attention.map((s) => (
                <li key={s.id} className="flex items-center justify-between gap-3 px-2 py-3">
                  <Link to={`/alunos/${s.id}`} className="min-w-0 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    <Person name={s.name} sub={`Sem treino registrado há ${s.lastSessionDays} dias`} />
                  </Link>
                  <Button variant="secondary" size="sm" icon={<MessageSquare />} onClick={() => navigate('/mensagens')}>
                    Conversar
                  </Button>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Treinos concluídos" description="Últimos 7 dias, todos os alunos">
            <ChartContainer config={chartConfig} className="h-52 w-full">
              <BarChart data={workoutsWeek} margin={{ top: 8, left: 0, right: 0 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="dia" tickLine={false} axisLine={false} tickMargin={8} />
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideIndicator />} />
                <Bar dataKey="treinos" fill="var(--color-treinos)" radius={6} maxBarSize={44} />
              </BarChart>
            </ChartContainer>
          </Section>

          <SmartRecommendation
            title="Sugestão da IA para Marina Lopes"
            options={[
              { id: 'reduzir', label: 'Reduzir para 3 treinos', reason: 'Marina faltou 2 das últimas 4 sessões. Um plano de 3 dias costuma manter a frequência.', signal: 3 },
              { id: 'manter', label: 'Manter Hipertrofia A/B', reason: 'O plano atual ainda está dentro do período combinado, até 30/11.', signal: 2 },
              { id: 'conversar', label: 'Conversar antes de mudar', reason: 'Ela respondeu hoje o questionário de rotina. Vale ler antes de decidir.', signal: 1 },
            ]}
            onAccept={(o) => toast(`Aplicado: ${o.label}`)}
          />
        </div>

        <div className="grid min-w-0 grid-cols-1 content-start gap-6">
          <Section title="Agenda de hoje">
            <ol className="grid gap-4">
              {agendaToday.map((a) => (
                <li key={a.time} className="flex items-center gap-3">
                  <span className="w-11 shrink-0 text-sm font-medium tabular-nums">{a.time}</span>
                  <span className="grid min-w-0 flex-1 leading-tight">
                    <span className="truncate text-sm font-medium">{a.name}</span>
                    <span className="truncate text-xs text-muted-foreground">{a.workout}</span>
                  </span>
                  <Pill icon={a.mode === 'Online' ? <Monitor /> : <User />}>{a.mode}</Pill>
                </li>
              ))}
            </ol>
          </Section>

          <ProgressTracker
            title="Comece por aqui"
            steps={[
              { id: 'conta', label: 'Criar sua conta', done: true },
              { id: 'convite', label: 'Convidar seu primeiro aluno', done: true },
              { id: 'treino', label: 'Montar um treino modelo' },
              { id: 'avisos', label: 'Ajustar suas notificações' },
            ]}
          />

          <ChangeSummary
            title="O que mudou"
            period="Esta semana"
            changes={[
              { label: 'Treinos concluídos', change: '28, 6 a mais que na semana passada', tone: 'good' },
              { label: 'Alunos sem treinar', change: '4, eram 2', tone: 'bad', direction: 'up' },
              { label: 'Alunos ativos', change: '18, sem mudança', tone: 'neutral' },
            ]}
          />
        </div>
      </div>
    </>
  )
}

function HomeAluno() {
  const me = sessions.aluno
  const [done, setDone] = useState<string[]>(['e1'])
  const total = todayWorkout.exercises.length
  const pct = Math.round((done.length / total) * 100)
  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title={`Olá, ${firstName(me.name)}`} description={`Hoje é ${TODAY_LABEL}.`} />

      <section className="rounded-2xl border bg-card p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <Pill tone="brand">Treino de hoje</Pill>
            <h2 className="mt-3 text-xl font-semibold tracking-tight">{todayWorkout.name}</h2>
            <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Timer className="size-4" /> cerca de {todayWorkout.minutes} minutos
              </span>
              <span className="inline-flex items-center gap-1">
                <Users className="size-4" /> preparado por {todayWorkout.by}
              </span>
            </p>
          </div>
          <Button size="lg" icon={<Play />} onClick={() => toast('Treino iniciado. Bom treino!')}>
            {done.length ? 'Continuar treino' : 'Começar treino'}
          </Button>
        </div>
        <div className="mt-5">
          <div className="mb-1.5 flex justify-between text-xs text-muted-foreground">
            <span>
              {done.length} de {total} exercícios feitos
            </span>
            <span className="tabular-nums">{pct}%</span>
          </div>
          <Progress value={pct} className="h-2" aria-label="Progresso do treino de hoje" />
        </div>
        <div className="mt-5 grid gap-2">
          {todayWorkout.exercises.map((e) => (
            <Checkbox
              key={e.id}
              variant="card"
              label={e.name}
              description={e.detail}
              checked={done.includes(e.id)}
              onChange={(ev) => setDone((d) => (ev.target.checked ? [...d, e.id] : d.filter((x) => x !== e.id)))}
            />
          ))}
        </div>
      </section>

      <Section title="Sua semana" className="mt-6">
        <ol className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {week.map((w) => (
            <li
              key={w.d}
              className={cn(
                'flex flex-col items-center gap-1.5 rounded-xl border py-2.5 text-xs',
                w.state === 'hoje' && 'border-primary bg-brand-soft font-medium text-brand-text',
                w.state === 'livre' && 'border-dashed text-muted-foreground',
              )}
            >
              <span>{w.d}</span>
              <span className={cn('flex size-6 items-center justify-center rounded-full', w.state === 'feito' && 'bg-success-soft text-success')}>
                {w.state === 'feito' && <Check className="size-3.5" />}
                {w.state === 'descanso' && <Moon className="size-3.5 text-muted-foreground" />}
                {w.state === 'hoje' && <CalendarDays className="size-3.5" />}
              </span>
              <span className="sr-only sm:not-sr-only sm:text-[11px]">{{ feito: 'Feito', descanso: 'Descanso', hoje: 'Hoje', livre: 'Livre' }[w.state]}</span>
            </li>
          ))}
        </ol>
      </Section>
    </div>
  )
}

function HomeAdmin() {
  return (
    <>
      <PageHeader title={`Olá, ${firstName(sessions.admin.name)}`} description={`Hoje é ${TODAY_LABEL}. Resumo da plataforma.`} />
      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <Kpi label="Personais ativos" foot="3 novos este mês">
          <NumberTicker value={8} />
        </Kpi>
        <Kpi label="Alunos na plataforma" foot="Em 8 contas">
          <NumberTicker value={142} />
        </Kpi>
        <Kpi label="Receita recorrente" foot="Exemplo, mês de outubro">
          <NumberTicker value={399} locale="pt-BR" format={{ style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }} />
        </Kpi>
        <Kpi label="Pagamentos pendentes" foot="1 conta em atraso">
          <NumberTicker value={1} />
        </Kpi>
      </div>
      <p className="mt-6 rounded-xl border border-dashed p-5 text-sm text-muted-foreground">
        As demais telas do admin (usuários, planos, cupons) ainda estão no protótipo antigo e serão migradas para este kit.
      </p>
    </>
  )
}

export function Home() {
  const { role } = useRole()
  return role === 'aluno' ? <HomeAluno /> : role === 'admin' ? <HomeAdmin /> : <HomePersonal />
}
