import { CalendarDays, Check, MessageSquare, Monitor, Moon, Play, Plus, Timer, User, Users } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'
import { toast } from 'sonner'
import { Button } from '@/components/affect/button'
import { Checkbox } from '@/components/affect/checkbox'
import { NumberTicker } from '@/components/affect/number-ticker'
import { ProgressTracker } from '@/components/affect/progress-tracker'
import { TextArea } from '@/components/affect/text-area'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
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
  week,
  workoutsWeek,
} from '@/lib/data'
import { useRole } from '@/lib/role'
import { findExercise, findWorkout, myWeek, TODAY_INDEX, workoutMinutes } from '@/lib/training'
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

type Pending = {
  id: string
  name: string
  sid: string
  reason: string
  tone: 'warning' | 'info' | 'neutral'
  action: string
  draft?: string
  to?: string
}

/* "Precisa de você": uma fila só, do mais urgente ao menos. Cada linha tem um motivo e uma ação. */
const PENDING: Pending[] = [
  {
    id: 'p1',
    name: 'Marina Lopes',
    sid: 's01',
    reason: 'Não treina há 9 dias. A frequência vem caindo há 3 semanas.',
    tone: 'warning',
    action: 'Ver mensagem pronta',
    draft: 'Oi, Marina! Senti sua falta esta semana. Está tudo bem? Se a rotina apertou, eu ajusto o treino para 3 dias e você não perde o que já conquistou.',
  },
  { id: 'p2', name: 'Felipe Almeida', sid: 's02', reason: 'Falou de dor no tornozelo no questionário de ontem.', tone: 'warning', action: 'Ver respostas', to: '/acompanhamento?aba=questionarios' },
  { id: 'p3', name: 'Daniel Costa', sid: 's07', reason: 'Entrou há 15 dias e ainda está sem treino.', tone: 'info', action: 'Montar treino', to: '/treinos/novo' },
  {
    id: 'p4',
    name: 'Carlos Nunes',
    sid: 's03',
    reason: 'O plano de treino dele termina em 7 dias.',
    tone: 'neutral',
    action: 'Ver mensagem pronta',
    draft: 'Oi, Carlos! Seu plano de treino termina na próxima semana. Quer que eu já prepare o próximo ciclo? Podemos aumentar a carga, você evoluiu bem.',
  },
]

function HomePersonal() {
  const navigate = useNavigate()
  const me = sessions.personal
  const active = activeStudents().length
  const late = students.filter((s) => s.status === 'ativo' && (s.lastSessionDays ?? 0) >= 7).length
  const [pending, setPending] = useState(PENDING)
  const [open, setOpen] = useState<Pending | null>(null)
  const [draft, setDraft] = useState('')
  const [sending, setSending] = useState(false)

  const done = (p: Pending, message: string) => {
    setPending((l) => l.filter((x) => x.id !== p.id))
    toast.success(message, { action: { label: 'Desfazer', onClick: () => setPending((l) => [p, ...l.filter((x) => x.id !== p.id)]) } })
  }

  return (
    <>
      <PageHeader
        title={`Olá, ${firstName(me.name)}`}
        description={
          <>
            Hoje é {TODAY_LABEL}. Você tem {agendaToday.length} atendimentos e{' '}
            <strong className="font-medium text-foreground">{pending.length === 0 ? 'nada pendente' : `${pending.length} ${pending.length === 1 ? 'coisa espera' : 'coisas esperam'} por você`}</strong>.
          </>
        }
        actions={
          <Button icon={<Plus />} onClick={() => toast.success('Convite enviado', { description: 'Você será avisado quando a pessoa aceitar.' })}>
            Convidar aluno
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Section title="Precisa de você" description="Do mais urgente ao menos. Nada é enviado ao aluno sem a sua aprovação." className="min-w-0 lg:col-span-2">
          {pending.length === 0 ? (
            <div className="flex flex-col items-center gap-1.5 py-8 text-center">
              <span className="flex size-10 items-center justify-center rounded-full bg-success-soft text-success">
                <Check className="size-5" />
              </span>
              <p className="font-medium">Tudo em dia</p>
              <p className="text-sm text-muted-foreground">Nenhum aluno precisa de você agora.</p>
            </div>
          ) : (
            <ul className="-mx-2 divide-y">
              {pending.map((p) => (
                <li key={p.id} className="flex flex-wrap items-center gap-x-4 gap-y-2.5 px-2 py-3.5">
                  <Link to={`/alunos/${p.sid}`} className="min-w-0 flex-1 basis-64 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    <Person name={p.name} sub={p.reason} />
                  </Link>
                  <div className="flex gap-1 pl-12 sm:pl-0">
                    <Button size="sm" variant="ghost" onClick={() => done(p, `${p.name.split(' ')[0]}: marcado como resolvido`)}>
                      Dispensar
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      icon={p.draft ? <MessageSquare /> : undefined}
                      onClick={() => {
                        if (p.draft) {
                          setDraft(p.draft)
                          setOpen(p)
                        } else if (p.to) navigate(p.to)
                      }}
                    >
                      {p.action}
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Section>

        <Section title="Agenda de hoje" className="min-w-0">
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
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
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
        <Kpi label="Treinos na semana" foot="6 a mais que na semana passada">
          <NumberTicker value={28} />
        </Kpi>
        <Kpi
          label="Sem treinar há 7 dias ou mais"
          foot={
            <Link to="/acompanhamento?aba=frequencia" className="font-medium text-brand-text hover:underline">
              Ver frequência
            </Link>
          }
        >
          <NumberTicker value={late} />
        </Kpi>
        <Kpi label="Receita de outubro" foot="Exemplo. O financeiro chega em breve.">
          <NumberTicker value={revenueMonth} locale="pt-BR" format={{ style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }} />
        </Kpi>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Section title="Treinos concluídos" description="Últimos 7 dias, todos os alunos" className="min-w-0 lg:col-span-2">
          <ChartContainer config={chartConfig} className="h-52 w-full">
            <BarChart data={workoutsWeek} margin={{ top: 8, left: 0, right: 0 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="dia" tickLine={false} axisLine={false} tickMargin={8} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideIndicator />} />
              <Bar dataKey="treinos" fill="var(--color-treinos)" radius={6} maxBarSize={44} />
            </BarChart>
          </ChartContainer>
        </Section>
        <div className="grid min-w-0 grid-cols-1 content-start gap-6">
          <ProgressTracker
            title="Comece por aqui"
            steps={[
              { id: 'conta', label: 'Criar sua conta', done: true },
              { id: 'convite', label: 'Convidar seu primeiro aluno', done: true },
              { id: 'treino', label: 'Montar um treino modelo' },
              { id: 'avisos', label: 'Ajustar suas notificações' },
            ]}
          />
        </div>
      </div>

      <Dialog open={open !== null} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Mensagem para {open?.name.split(' ')[0]}</DialogTitle>
            <DialogDescription>A Aura escreveu um rascunho no seu jeito de falar. Ajuste o que quiser antes de enviar.</DialogDescription>
          </DialogHeader>
          <TextArea aria-label="Mensagem" minRows={4} maxRows={10} maxLength={600} counter value={draft} onChange={(e) => setDraft(e.target.value)} />
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(null)}>
              Agora não
            </Button>
            <Button
              loading={sending}
              disabled={!draft.trim()}
              onClick={() => {
                setSending(true)
                setTimeout(() => {
                  setSending(false)
                  if (open) done(open, `Mensagem enviada para ${open.name.split(' ')[0]}`)
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

/* O mesmo treino que o aluno abre em "Meu treino", para os números baterem entre as telas. */
const today = findWorkout(myWeek[TODAY_INDEX])!
const todayWorkout = {
  name: today.name,
  minutes: workoutMinutes(today),
  by: sessions.personal.name,
  exercises: today.sections.flatMap((s) => s.items).map((it) => ({ id: it.key, name: findExercise(it.exerciseId)!.name, detail: `${it.sets} séries · ${it.reps} repetições · ${it.rest} s de descanso` })),
}

function HomeAluno() {
  const navigate = useNavigate()
  const me = sessions.aluno
  const [done, setDone] = useState<string[]>([])
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
          <Button size="lg" icon={<Play />} onClick={() => navigate('/treino/executar')}>
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

      <Section
        title="Sua semana"
        className="mt-6"
        action={
          <Link to="/treino" className="text-sm font-medium text-brand-text underline-offset-4 hover:underline">
            Ver semana
          </Link>
        }
      >
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
