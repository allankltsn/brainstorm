import { Clock, Copy, Dumbbell, Moon, RotateCcw } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/affect/button'
import { Select } from '@/components/affect/select'
import { Pill, Section } from '@/components/page'
import { firstName, type Student } from '@/lib/data'
import { countItems, DAYS, findWorkout, TODAY_INDEX, weekPlanFor, workoutMinutes, workouts, type WeekPlan } from '@/lib/training'
import { cn } from '@/lib/utils'

const REST = 'descanso'
const OPTIONS = [{ value: REST, label: 'Descanso' }, ...workouts.map((w) => ({ value: w.id, label: w.name, description: w.goal }))]
const same = (a: WeekPlan, b: WeekPlan) => a.every((v, i) => v === b[i])

/* Programação semanal do aluno: um treino ou descanso por dia. Nada vale para o aluno antes de salvar. */
export function Programacao({ student }: { student: Student }) {
  const [saved, setSaved] = useState<WeekPlan>(() => weekPlanFor(student.plan))
  const [plan, setPlan] = useState<WeekPlan>(saved)
  const [saving, setSaving] = useState(false)
  const dirty = !same(plan, saved)
  const sessions = plan.filter(Boolean)
  const minutes = sessions.reduce((t, id) => t + (findWorkout(id) ? workoutMinutes(findWorkout(id)!) : 0), 0)
  const setDay = (i: number, v: string | null) => setPlan((p) => p.map((x, j) => (j === i ? v : x)))

  function save() {
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      setSaved(plan)
      toast.success('Programação salva', { description: `${firstName(student.name)} vê a nova semana a partir de amanhã.` })
    }, 800)
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
      <Section title="Semana de treinos" description="Escolha o treino de cada dia. Dias sem treino ficam como descanso." className="min-w-0">
        <ol className="grid gap-2">
          {DAYS.map((day, i) => {
            const w = findWorkout(plan[i])
            return (
              <li key={day} className={cn('flex flex-wrap items-center gap-x-4 gap-y-2 rounded-lg border p-3', i === TODAY_INDEX && 'border-primary/40 bg-brand-soft/40')}>
                <div className="flex w-28 items-center gap-2">
                  <span className={cn('flex size-8 shrink-0 items-center justify-center rounded-full [&_svg]:size-4', w ? 'bg-brand-soft text-brand-text' : 'bg-muted text-muted-foreground')} aria-hidden="true">
                    {w ? <Dumbbell /> : <Moon />}
                  </span>
                  <span className="grid leading-tight">
                    <span className="text-sm font-medium">{day}</span>
                    {i === TODAY_INDEX && <span className="text-[11px] text-brand-text">Hoje</span>}
                  </span>
                </div>
                <Select aria-label={`Treino de ${day.toLowerCase()}`} className="min-w-48 flex-1" value={plan[i] ?? REST} onChange={(v) => setDay(i, v === REST ? null : v)} options={OPTIONS} />
                <p className="w-full text-xs text-muted-foreground sm:w-44">
                  {w ? (
                    <>
                      {countItems(w)} exercícios · cerca de {workoutMinutes(w)} min ·{' '}
                      <Link to={`/treinos/${w.id}`} className="font-medium text-foreground underline-offset-4 hover:underline">
                        Ver treino
                      </Link>
                    </>
                  ) : (
                    'Dia livre para recuperar.'
                  )}
                </p>
              </li>
            )
          })}
        </ol>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="ghost"
            icon={<Copy />}
            onClick={() => {
              const prev = plan
              // repete o padrão dos três primeiros dias no restante da semana útil
              setPlan((p) => p.map((x, j) => (j >= 3 && j <= 5 ? p[j - 3] : x)))
              toast('Segunda a quarta repetidas de quinta a sábado', { action: { label: 'Desfazer', onClick: () => setPlan(prev) } })
            }}
          >
            Repetir segunda a quarta
          </Button>
          <Button size="sm" variant="ghost" icon={<RotateCcw />} disabled={!dirty} onClick={() => setPlan(saved)}>
            Desfazer mudanças
          </Button>
        </div>
      </Section>

      <aside className="grid content-start gap-4 lg:sticky lg:top-20 lg:self-start">
        <Section title="Resumo da semana">
          <dl className="grid gap-3 text-sm">
            <div className="flex justify-between">
              <dt className="inline-flex items-center gap-2 text-muted-foreground">
                <Dumbbell className="size-4" /> Treinos
              </dt>
              <dd className="font-medium tabular-nums">{sessions.length} por semana</dd>
            </div>
            <div className="flex justify-between">
              <dt className="inline-flex items-center gap-2 text-muted-foreground">
                <Moon className="size-4" /> Descanso
              </dt>
              <dd className="font-medium tabular-nums">
                {7 - sessions.length} {7 - sessions.length === 1 ? 'dia' : 'dias'}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="inline-flex items-center gap-2 text-muted-foreground">
                <Clock className="size-4" /> Tempo total
              </dt>
              <dd className="font-medium tabular-nums">{minutes} min</dd>
            </div>
          </dl>
          {sessions.length === 0 && <p className="mt-3 rounded-lg bg-warning-soft p-3 text-xs text-warning">Sem nenhum treino na semana, {firstName(student.name)} não terá o que fazer.</p>}
          {sessions.length === 7 && <p className="mt-3 rounded-lg bg-warning-soft p-3 text-xs text-warning">Semana sem dia de descanso. Confira se é isso mesmo.</p>}
          <div className="mt-4 grid gap-2">
            <Button loading={saving} disabled={!dirty} onClick={save} className="w-full">
              {saving ? 'Salvando' : 'Salvar programação'}
            </Button>
            {dirty ? <Pill tone="warning">Mudanças não salvas</Pill> : <p className="text-xs text-muted-foreground">Tudo salvo. O aluno vê esta semana no app.</p>}
          </div>
        </Section>
      </aside>
    </div>
  )
}
