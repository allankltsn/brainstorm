import { ArrowLeft, ArrowRight, Check, Flag, Pause, Play, Timer } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/affect/button'
import { SegmentedControl } from '@/components/affect/segmented-control'
import { TextArea } from '@/components/affect/text-area'
import { PageHeader, Pill, Section } from '@/components/page'
import { Progress } from '@/components/ui/progress'
import { todayWorkout } from '@/lib/data'
import { cn } from '@/lib/utils'

const SETS = 3
const REST = 45
type Effort = 'leve' | 'moderado' | 'intenso'

export function MeuTreino() {
  const navigate = useNavigate()
  const ex = todayWorkout.exercises
  const [started, setStarted] = useState(false)
  const [idx, setIdx] = useState(0)
  const [sets, setSets] = useState<Record<string, number>>({})
  const [rest, setRest] = useState(0)
  const [finishing, setFinishing] = useState(false)
  const [effort, setEffort] = useState<Effort>('moderado')

  useEffect(() => {
    if (rest <= 0) return
    const t = setTimeout(() => setRest((r) => r - 1), 1000)
    return () => clearTimeout(t)
  }, [rest])

  const cur = ex[idx]
  const doneSets = sets[cur.id] ?? 0
  const totalDone = Object.values(sets).reduce((a, b) => a + b, 0)
  const pct = Math.round((totalDone / (ex.length * SETS)) * 100)

  if (finishing)
    return (
      <div className="mx-auto max-w-xl">
        <PageHeader title="Como foi o treino?" description="Seu personal vê essa resposta e ajusta o próximo treino." />
        <Section title="Esforço percebido">
          <div className="grid gap-5">
            <SegmentedControl<Effort>
              aria-label="Esforço percebido"
              fullWidth
              value={effort}
              onChange={setEffort}
              options={[
                { value: 'leve', label: 'Leve' },
                { value: 'moderado', label: 'Moderado' },
                { value: 'intenso', label: 'Intenso' },
              ]}
            />
            <TextArea label="Sentiu dor ou desconforto?" optional hint="Se sim, conte onde e quando. Seu personal será avisado." />
          </div>
        </Section>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setFinishing(false)}>
            Voltar
          </Button>
          <Button
            icon={<Flag />}
            onClick={() => {
              toast.success('Treino concluído. Bom trabalho!')
              navigate('/inicio')
            }}
          >
            Enviar e concluir
          </Button>
        </div>
      </div>
    )

  if (!started)
    return (
      <div className="mx-auto max-w-2xl">
        <PageHeader
          title={todayWorkout.name}
          description={`Preparado por ${todayWorkout.by} · cerca de ${todayWorkout.minutes} minutos`}
          actions={
            <Button size="lg" icon={<Play />} onClick={() => setStarted(true)}>
              Começar treino
            </Button>
          }
        />
        <ol className="grid gap-2">
          {ex.map((e, i) => (
            <li key={e.id} className="flex gap-4 rounded-xl border bg-card p-4">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-medium">{i + 1}</span>
              <div>
                <p className="text-sm font-medium">{e.name}</p>
                <p className="text-xs text-muted-foreground">{e.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    )

  const last = idx === ex.length - 1
  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-2 flex justify-between text-xs text-muted-foreground">
        <span>
          Exercício {idx + 1} de {ex.length}
        </span>
        <span className="tabular-nums">{pct}%</span>
      </div>
      <Progress value={pct} className="mb-6 h-2" aria-label="Progresso do treino" />
      <section className="rounded-2xl border bg-card p-5 sm:p-6" aria-live="polite">
        <Pill tone="brand">{todayWorkout.name}</Pill>
        <h1 className="mt-3 text-xl font-semibold tracking-tight">{cur.name}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{cur.detail}</p>
        <ul className="mt-5 grid gap-2">
          {Array.from({ length: SETS }, (_, s) => (
            <li key={s} className={cn('flex items-center justify-between rounded-xl border px-4 py-3 text-sm', s < doneSets && 'border-success/40 bg-success-soft')}>
              <span className="font-medium">Série {s + 1}</span>
              {s < doneSets ? (
                <Pill tone="success" icon={<Check />}>Feita</Pill>
              ) : (
                <Button
                  size="sm"
                  variant={s === doneSets ? 'primary' : 'ghost'}
                  disabled={s !== doneSets}
                  onClick={() => {
                    setSets((m) => ({ ...m, [cur.id]: doneSets + 1 }))
                    if (doneSets + 1 < SETS) setRest(REST)
                  }}
                >
                  Concluir série
                </Button>
              )}
            </li>
          ))}
        </ul>
        {rest > 0 && (
          <div className="mt-4 flex items-center justify-between rounded-xl bg-muted px-4 py-3 text-sm" role="timer" aria-label={`Descanso: ${rest} segundos`}>
            <span className="inline-flex items-center gap-2">
              <Timer className="size-4" /> Descanso <strong className="tabular-nums">{rest}s</strong>
            </span>
            <Button size="sm" variant="ghost" icon={<Pause />} onClick={() => setRest(0)}>
              Pular
            </Button>
          </div>
        )}
      </section>
      <div className="mt-6 flex justify-between gap-2">
        <Button variant="secondary" icon={<ArrowLeft />} disabled={idx === 0} onClick={() => { setIdx(idx - 1); setRest(0) }}>
          Anterior
        </Button>
        {last ? (
          <Button icon={<Flag />} onClick={() => setFinishing(true)}>
            Finalizar treino
          </Button>
        ) : (
          <Button iconRight={<ArrowRight />} onClick={() => { setIdx(idx + 1); setRest(0) }}>
            Próximo exercício
          </Button>
        )}
      </div>
    </div>
  )
}
