import { ArrowLeft, ArrowRight, CalendarDays, Check, ChevronDown, Clock, Dumbbell, Flag, Moon, Play, SkipForward, Timer, TrendingUp } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/affect/button'
import { SegmentedControl } from '@/components/affect/segmented-control'
import { TextArea } from '@/components/affect/text-area'
import { ExerciseThumb } from '@/components/exercise-thumb'
import { PageHeader, Pill, Section } from '@/components/page'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { firstName, sessions } from '@/lib/data'
import { countItems, DAYS, findExercise, findWorkout, firstReps, lastLoad, myDoneDays, myWeek, TODAY_INDEX, workoutMinutes, type WorkoutItem } from '@/lib/training'
import { cn } from '@/lib/utils'

const PERSONAL = sessions.personal.name
const kg = (v: number) => `${v.toLocaleString('pt-BR')} kg`
const clock = (s: number) => `${Math.floor(s / 60)}:${String(Math.max(0, s) % 60).padStart(2, '0')}`
const prescription = (it: WorkoutItem) => `${it.sets} séries · ${it.reps} repetições · ${it.rest} s de descanso`

const HISTORY = [
  { when: 'Quarta, 14/10', name: 'Força base', minutes: 41, note: 'Agachamento subiu para 50 kg' },
  { when: 'Segunda, 12/10', name: 'Força base', minutes: 44, note: 'Todas as séries feitas' },
  { when: 'Sexta, 09/10', name: 'Treino A · Superior', minutes: 38, note: 'Supino reto com 40 kg' },
]

/* Meu treino (aluno): a semana que o personal programou e o treino de cada dia. */
export function MeuTreino() {
  const navigate = useNavigate()
  const [day, setDay] = useState(TODAY_INDEX)
  const w = findWorkout(myWeek[day])
  const isToday = day === TODAY_INDEX
  const done = myDoneDays.includes(day)
  const items = w?.sections.flatMap((s) => s.items) ?? []

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Meu treino" description={`Sua semana, preparada por ${PERSONAL}.`} />

      <div role="radiogroup" aria-label="Dia da semana" className="grid grid-cols-7 gap-1.5 sm:gap-2">
        {DAYS.map((d, i) => {
          const has = Boolean(myWeek[i])
          const dn = myDoneDays.includes(i)
          return (
            <button
              key={d}
              type="button"
              role="radio"
              aria-checked={day === i}
              aria-label={`${d}: ${dn ? 'treino feito' : has ? (i === TODAY_INDEX ? 'treino de hoje' : 'treino') : 'descanso'}`}
              onClick={() => setDay(i)}
              className={cn(
                'flex flex-col items-center gap-1.5 rounded-xl border bg-card py-2.5 text-xs outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring',
                day === i && 'border-primary bg-brand-soft font-medium text-brand-text hover:bg-brand-soft',
                !has && day !== i && 'border-dashed text-muted-foreground',
              )}
            >
              <span>{d.slice(0, 3)}</span>
              <span className={cn('flex size-6 items-center justify-center rounded-full [&_svg]:size-3.5', dn && 'bg-success-soft text-success')}>
                {dn ? <Check /> : has ? i === TODAY_INDEX ? <CalendarDays /> : <Dumbbell /> : <Moon />}
              </span>
            </button>
          )
        })}
      </div>

      <section className="mt-4 rounded-2xl border bg-card p-5 sm:p-6" aria-live="polite">
        {w ? (
          <>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                {done ? (
                  <Pill tone="success" icon={<Check />}>
                    Feito
                  </Pill>
                ) : (
                  <Pill tone={isToday ? 'brand' : 'neutral'}>{isToday ? 'Treino de hoje' : DAYS[day]}</Pill>
                )}
                <h2 className="mt-3 text-xl font-semibold tracking-tight">{w.name}</h2>
                <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Timer className="size-4" /> cerca de {workoutMinutes(w)} minutos
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Dumbbell className="size-4" /> {countItems(w)} exercícios
                  </span>
                </p>
              </div>
              {isToday && !done && (
                <Button size="lg" icon={<Play />} onClick={() => navigate('/treino/executar')}>
                  Começar treino
                </Button>
              )}
            </div>
            <ol className="mt-5 grid gap-2">
              {items.map((it, i) => {
                const e = findExercise(it.exerciseId)!
                const last = lastLoad(e.id)
                return (
                  <li key={it.key} className="flex items-center gap-3 rounded-lg border p-3">
                    <span className="w-5 text-center text-sm font-medium text-muted-foreground tabular-nums">{i + 1}</span>
                    <ExerciseThumb exercise={e} size="row" />
                    <div className="min-w-0 flex-1 leading-tight">
                      <p className="truncate text-sm font-medium">{e.name}</p>
                      <p className="text-xs text-muted-foreground">{prescription(it)}</p>
                    </div>
                    {last !== null && <span className="hidden text-xs text-muted-foreground sm:block">última vez: {kg(last)}</span>}
                  </li>
                )
              })}
            </ol>
            {!isToday && !done && <p className="mt-4 text-xs text-muted-foreground">Este treino abre para registrar no dia marcado.</p>}
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 py-8 text-center">
            <span className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <Moon className="size-5" />
            </span>
            <h2 className="font-semibold">{DAYS[day]} é dia de descanso</h2>
            <p className="max-w-sm text-sm text-muted-foreground">Descansar faz parte do treino. Se quiser se mexer, uma caminhada leve já ajuda.</p>
          </div>
        )}
      </section>

      <Section title="Últimos treinos" className="mt-6">
        <ul className="divide-y">
          {HISTORY.map((h) => (
            <li key={h.when} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
              <span className="grid min-w-0 leading-tight">
                <span className="truncate text-sm font-medium">{h.name}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {h.when} · {h.note}
                </span>
              </span>
              <span className="inline-flex shrink-0 items-center gap-1 text-xs text-muted-foreground tabular-nums">
                <Clock className="size-3.5" /> {h.minutes} min
              </span>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  )
}

type SetLog = { kg: string; reps: string; done: boolean }
const num = (s: string) => Number(s.replace(',', '.')) || 0

/* Execução do treino: um exercício por vez, carga e repetições por série, descanso cronometrado. */
export function ExecutarTreino() {
  const navigate = useNavigate()
  const workout = findWorkout(myWeek[TODAY_INDEX])
  const items = useMemo(() => workout?.sections.flatMap((s) => s.items) ?? [], [workout])
  const [logs, setLogs] = useState<Record<string, SetLog[]>>(() =>
    Object.fromEntries(
      items.map((it) => {
        const last = lastLoad(it.exerciseId)
        return [it.key, Array.from({ length: it.sets }, () => ({ kg: last === null ? '' : String(last), reps: String(firstReps(it.reps)), done: false }))]
      }),
    ),
  )
  const [current, setCurrent] = useState(0)
  const [startedAt] = useState(() => Date.now())
  const [now, setNow] = useState(() => Date.now())
  const [rest, setRest] = useState<{ until: number; total: number } | null>(null)
  const [finishedAt, setFinishedAt] = useState<number | null>(null)
  const [effort, setEffort] = useState('moderado')
  const [sending, setSending] = useState(false)

  useEffect(() => {
    if (finishedAt) return
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [finishedAt])

  // o descanso some sozinho quando o tempo acaba
  const restLeft = rest ? Math.ceil((rest.until - now) / 1000) : 0

  if (!workout) {
    return (
      <div className="py-16 text-center">
        <p className="font-medium">Hoje é dia de descanso</p>
        <Link to="/treino" className="mt-2 inline-block text-sm text-brand-text hover:underline">
          Ver minha semana
        </Link>
      </div>
    )
  }

  const all = items.flatMap((it) => logs[it.key])
  const doneSets = all.filter((s) => s.done).length
  const pct = Math.round((doneSets / all.length) * 100)
  const exDone = (it: WorkoutItem) => logs[it.key].every((s) => s.done)
  const elapsed = Math.floor(((finishedAt ?? now) - startedAt) / 1000)

  if (finishedAt) {
    const volume = items.reduce((t, it) => t + logs[it.key].filter((s) => s.done).reduce((a, s) => a + num(s.kg) * num(s.reps), 0), 0)
    const gains = items
      .map((it) => {
        const last = lastLoad(it.exerciseId)
        const best = Math.max(0, ...logs[it.key].filter((s) => s.done).map((s) => num(s.kg)))
        return last !== null && best > last ? { name: findExercise(it.exerciseId)!.name, best, diff: best - last } : null
      })
      .filter((g) => g !== null)
    return (
      <div className="mx-auto max-w-xl">
        <div className="flex flex-col items-center gap-2 py-6 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-success-soft text-success">
            <Check className="size-6" />
          </span>
          <h1 className="text-2xl font-semibold tracking-tight">Treino concluído</h1>
          <p className="text-sm text-muted-foreground">
            {workout.name} · boa, {firstName(sessions.aluno.name)}!
          </p>
        </div>
        <dl className="grid grid-cols-3 gap-2 text-center">
          {[
            ['Duração', clock(elapsed)],
            ['Séries feitas', `${doneSets} de ${all.length}`],
            ['Carga total', kg(Math.round(volume))],
          ].map(([k, v]) => (
            <div key={k} className="rounded-xl border bg-card p-3">
              <dt className="text-xs text-muted-foreground">{k}</dt>
              <dd className="mt-1 text-lg font-semibold tabular-nums">{v}</dd>
            </div>
          ))}
        </dl>
        {gains.length > 0 && (
          <Section title="Você subiu a carga" className="mt-4">
            <ul className="grid gap-2 text-sm">
              {gains.map((g) => (
                <li key={g.name} className="flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-2">
                    <TrendingUp className="size-4 text-success" /> {g.name}
                  </span>
                  <span className="font-medium tabular-nums">
                    {kg(g.best)} <span className="text-success">(+{kg(g.diff)})</span>
                  </span>
                </li>
              ))}
            </ul>
          </Section>
        )}
        <Section title="Como foi o treino?" description={`${firstName(PERSONAL)} usa a sua resposta para ajustar os próximos.`} className="mt-4">
          <SegmentedControl
            aria-label="Esforço percebido"
            fullWidth
            value={effort}
            onChange={setEffort}
            options={[
              { value: 'leve', label: 'Leve' },
              { value: 'moderado', label: 'Moderado' },
              { value: 'puxado', label: 'Puxado' },
            ]}
          />
          <TextArea label="Recado para o personal" optional placeholder="Ex.: senti o ombro no desenvolvimento" minRows={2} maxRows={6} maxLength={300} className="mt-4" />
          <div className="mt-4 flex flex-wrap justify-end gap-2">
            <Button variant="ghost" onClick={() => setFinishedAt(null)}>
              Voltar ao treino
            </Button>
            <Button
              loading={sending}
              onClick={() => {
                setSending(true)
                setTimeout(() => {
                  toast.success('Treino registrado', { description: `${firstName(PERSONAL)} já consegue ver as suas cargas.` })
                  navigate('/inicio')
                }, 800)
              }}
            >
              {sending ? 'Enviando' : 'Registrar treino'}
            </Button>
          </div>
        </Section>
      </div>
    )
  }

  const it = items[current]
  const e = findExercise(it.exerciseId)!
  const last = lastLoad(e.id)
  const isLast = current === items.length - 1
  const patch = (i: number, p: Partial<SetLog>) => setLogs((l) => ({ ...l, [it.key]: l[it.key].map((s, j) => (j === i ? { ...s, ...p } : s)) }))

  function toggle(i: number) {
    const s = logs[it.key][i]
    patch(i, { done: !s.done })
    if (s.done) return
    const lastSetOfWorkout = doneSets + 1 === all.length
    if (it.rest > 0 && !lastSetOfWorkout) setRest({ until: Date.now() + it.rest * 1000, total: it.rest })
  }

  function finish() {
    setRest(null)
    setFinishedAt(Date.now())
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Link to="/treino" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Meu treino
      </Link>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">{workout.name}</h1>
        <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground tabular-nums" aria-label={`Tempo de treino: ${clock(elapsed)}`}>
          <Clock className="size-4" /> {clock(elapsed)}
        </span>
      </div>
      <div className="mt-3">
        <div className="mb-1.5 flex justify-between text-xs text-muted-foreground">
          <span>
            {doneSets} de {all.length} séries feitas
          </span>
          <span className="tabular-nums">{pct}%</span>
        </div>
        <Progress value={pct} className="h-2" aria-label="Progresso do treino" />
      </div>

      <nav aria-label="Exercícios do treino" className="-mx-1 mt-4 flex gap-1.5 overflow-x-auto px-1 py-1">
        {items.map((x, i) => {
          const ok = exDone(x)
          return (
            <button
              key={x.key}
              type="button"
              aria-current={i === current ? 'step' : undefined}
              aria-label={`Exercício ${i + 1}: ${findExercise(x.exerciseId)!.name}${ok ? ', feito' : ''}`}
              onClick={() => setCurrent(i)}
              className={cn(
                'flex size-9 shrink-0 items-center justify-center rounded-full border text-sm font-medium tabular-nums outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring',
                ok && 'border-transparent bg-success-soft text-success',
                i === current && 'border-primary ring-2 ring-primary/20',
              )}
            >
              {ok ? <Check className="size-4" /> : i + 1}
            </button>
          )
        })}
      </nav>

      <section className="mt-3 rounded-2xl border bg-card p-4 sm:p-6">
        <div className="flex items-start gap-4">
          <ExerciseThumb exercise={e} className="w-28 sm:w-36" />
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted-foreground">
              Exercício {current + 1} de {items.length}
            </p>
            <h2 className="mt-0.5 text-lg font-semibold tracking-tight">{e.name}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{prescription(it)}</p>
            <p className="mt-2 text-xs text-muted-foreground">{last !== null ? `Da última vez você usou ${kg(last)}.` : `${e.equipment}: sem carga para registrar.`}</p>
          </div>
        </div>

        <details className="group mt-4 rounded-lg border px-3 py-2 text-sm">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-2 font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-details-marker]:hidden">
            Como fazer
            <ChevronDown className="size-4 text-muted-foreground transition-transform group-open:rotate-180" />
          </summary>
          <ol className="mt-2 grid list-decimal gap-1 pl-5 text-muted-foreground">
            {e.steps.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
          <p className="mt-2 text-xs text-muted-foreground">Dica: {e.tips[0]}</p>
        </details>

        <ol className="mt-4 grid gap-2">
          {logs[it.key].map((s, i) => (
            <li key={i} className={cn('flex flex-wrap items-end gap-x-3 gap-y-2 rounded-lg border p-3', s.done && 'border-transparent bg-success-soft/50')}>
              <span className="w-16 pb-1.5 text-sm font-medium">Série {i + 1}</span>
              {last !== null && (
                <label className="grid gap-1">
                  <span className="text-[11px] font-medium text-muted-foreground">Carga (kg)</span>
                  <Input inputMode="decimal" value={s.kg} onChange={(ev) => patch(i, { kg: ev.target.value.replace(/[^\d.,]/g, '') })} className="h-9 w-20" />
                </label>
              )}
              <label className="grid gap-1">
                <span className="text-[11px] font-medium text-muted-foreground">Repetições</span>
                <Input inputMode="numeric" value={s.reps} onChange={(ev) => patch(i, { reps: ev.target.value.replace(/\D/g, '') })} className="h-9 w-20" />
              </label>
              <Button size="sm" variant={s.done ? 'ghost' : 'secondary'} icon={<Check />} className="ml-auto" aria-pressed={s.done} onClick={() => toggle(i)}>
                {s.done ? 'Feita' : 'Marcar feita'}
              </Button>
            </li>
          ))}
        </ol>

        {rest && restLeft > 0 && (
          <div role="timer" aria-label="Descanso" className="mt-4 rounded-lg bg-brand-soft p-3 text-brand-text">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="inline-flex items-center gap-2 text-sm font-medium">
                <Timer className="size-4" /> Descanso · <span className="tabular-nums">{clock(restLeft)}</span>
              </span>
              <span className="flex gap-1">
                <Button size="sm" variant="ghost" onClick={() => setRest((r) => r && { until: r.until + 15000, total: r.total + 15 })}>
                  +15 s
                </Button>
                <Button size="sm" variant="ghost" icon={<SkipForward />} onClick={() => setRest(null)}>
                  Pular
                </Button>
              </span>
            </div>
            <Progress value={Math.max(0, Math.min(100, (restLeft / rest.total) * 100))} className="mt-2 h-1.5 bg-background/60" aria-hidden="true" />
          </div>
        )}
      </section>

      <div className="mt-4 flex flex-wrap justify-between gap-2">
        <Button variant="secondary" icon={<ArrowLeft />} disabled={current === 0} onClick={() => setCurrent((c) => c - 1)}>
          Anterior
        </Button>
        <span className="flex flex-wrap gap-2">
          {!isLast && (
            <Button variant="ghost" icon={<Flag />} onClick={finish}>
              Finalizar
            </Button>
          )}
          {isLast ? (
            <Button icon={<Flag />} onClick={finish}>
              Finalizar treino
            </Button>
          ) : (
            <Button iconRight={<ArrowRight />} onClick={() => setCurrent((c) => c + 1)}>
              Próximo exercício
            </Button>
          )}
        </span>
      </div>
    </div>
  )
}
