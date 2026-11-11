import { ArrowDown, ArrowLeft, ArrowUp, Clock, Dumbbell, Plus, Search, Sparkles, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/affect/button'
import { SegmentedControl } from '@/components/affect/segmented-control'
import { Select } from '@/components/affect/select'
import { TextField } from '@/components/affect/text-field'
import { ExerciseThumb } from '@/components/exercise-thumb'
import { Pill, Section } from '@/components/page'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { estimateMinutes, exercises, findExercise, GROUPS, item, workouts, type Group, type WorkoutItem, type WorkoutSection } from '@/lib/training'

const GOALS = ['Ganhar massa', 'Emagrecer', 'Condicionamento', 'Força', 'Iniciantes'].map((g) => ({ value: g, label: g }))

function IconAction({ label, onClick, disabled, children }: { label: string; onClick: () => void; disabled?: boolean; children: React.ReactNode }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          aria-label={label}
          disabled={disabled}
          onClick={onClick}
          className="flex size-8 items-center justify-center rounded-md text-muted-foreground outline-none hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-30 [&_svg]:size-4"
        >
          {children}
        </button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-1">
      <span className="text-[11px] font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  )
}

function Picker({ open, onOpenChange, onPick }: { open: boolean; onOpenChange: (o: boolean) => void; onPick: (id: string) => void }) {
  const [q, setQ] = useState('')
  const [group, setGroup] = useState<Group | 'Todos'>('Todos')
  const list = exercises.filter((e) => (group === 'Todos' || e.group === group) && e.name.toLowerCase().includes(q.trim().toLowerCase()))
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[min(40rem,90svh)] flex-col gap-4 sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Adicionar exercício</DialogTitle>
          <DialogDescription>Toque em um exercício para colocar no treino. Você ajusta séries e descanso depois.</DialogDescription>
        </DialogHeader>
        <TextField aria-label="Buscar exercício" placeholder="Buscar exercício" prefix={<Search className="size-4" />} clearable value={q} onChange={(e) => setQ(e.target.value)} onClear={() => setQ('')} />
        <div className="-mx-1 overflow-x-auto px-1">
          <SegmentedControl aria-label="Grupo muscular" size="sm" value={group} onChange={setGroup} options={(['Todos', ...GROUPS] as const).map((g) => ({ value: g, label: g }))} />
        </div>
        <ul className="-mx-2 min-h-40 flex-1 overflow-y-auto">
          {list.map((e) => (
            <li key={e.id}>
              <button type="button" onClick={() => onPick(e.id)} className="flex w-full items-center gap-3 rounded-lg p-2 text-left outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring">
                <ExerciseThumb exercise={e} size="row" />
                <span className="grid min-w-0 flex-1 leading-tight">
                  <span className="truncate text-sm font-medium">{e.name}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {e.group} · {e.equipment}
                  </span>
                </span>
                <Plus className="size-4 text-muted-foreground" />
              </button>
            </li>
          ))}
          {list.length === 0 && <li className="p-6 text-center text-sm text-muted-foreground">Nenhum exercício encontrado.</li>}
        </ul>
      </DialogContent>
    </Dialog>
  )
}

export function TreinoEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const base = workouts.find((w) => w.id === id)
  const [name, setName] = useState(base?.name ?? '')
  const [goal, setGoal] = useState(base?.goal ?? 'Ganhar massa')
  const [days, setDays] = useState(String(base?.days ?? 3))
  const [sections, setSections] = useState<WorkoutSection[]>(
    base?.sections ?? [
      { id: 'aquecimento', title: 'Aquecimento', items: [] },
      { id: 'principal', title: 'Exercícios principais', items: [] },
    ],
  )
  const [pickFor, setPickFor] = useState<string | null>(null)
  const [error, setError] = useState<string>()
  const [saving, setSaving] = useState(false)

  const patchSection = (sid: string, fn: (items: WorkoutItem[]) => WorkoutItem[]) => setSections((l) => l.map((s) => (s.id === sid ? { ...s, items: fn(s.items) } : s)))
  const patchItem = (sid: string, key: string, p: Partial<WorkoutItem>) => patchSection(sid, (items) => items.map((i) => (i.key === key ? { ...i, ...p } : i)))
  const move = (sid: string, index: number, by: number) =>
    patchSection(sid, (items) => {
      const next = [...items]
      const [it] = next.splice(index, 1)
      next.splice(index + by, 0, it)
      return next
    })

  const all = sections.flatMap((s) => s.items)
  const minutes = estimateMinutes(all)

  function save() {
    if (!name.trim()) return setError('Dê um nome ao treino.')
    if (all.length === 0) return toast.error('Adicione pelo menos um exercício')
    setSaving(true)
    setTimeout(() => {
      toast.success('Treino salvo')
      navigate('/treinos')
    }, 800)
  }

  return (
    <>
      <Link to="/treinos" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Treinos
      </Link>
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">{base ? 'Editar treino' : 'Criar treino'}</h1>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="grid min-w-0 content-start gap-6">
          <Section title="Sobre o treino">
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField
                label="Nome do treino"
                placeholder="Ex.: Treino A · Superior"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  setError(undefined)
                }}
                error={error}
                className="sm:col-span-2"
              />
              <Select label="Objetivo" value={goal} onChange={setGoal} options={GOALS} />
              <div className="grid gap-1.5">
                <span id="lbl-dias" className="text-sm font-medium">
                  Dias por semana
                </span>
                <SegmentedControl aria-labelledby="lbl-dias" fullWidth value={days} onChange={setDays} options={['2', '3', '4', '5', '6'].map((d) => ({ value: d, label: d }))} />
              </div>
            </div>
          </Section>

          {sections.map((s) => (
            <Section
              key={s.id}
              title={s.title}
              description={s.items.length ? `${s.items.length} ${s.items.length === 1 ? 'exercício' : 'exercícios'}` : undefined}
              action={
                <Button size="sm" variant="secondary" icon={<Plus />} onClick={() => setPickFor(s.id)}>
                  Adicionar exercício
                </Button>
              }
            >
              {s.items.length === 0 ? (
                <button
                  type="button"
                  onClick={() => setPickFor(s.id)}
                  className="flex w-full flex-col items-center gap-1 rounded-lg border border-dashed px-4 py-8 text-sm text-muted-foreground outline-none hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Dumbbell className="size-5" />
                  Nenhum exercício ainda. Toque para adicionar.
                </button>
              ) : (
                <ol className="grid gap-2">
                  {s.items.map((it, i) => {
                    const e = findExercise(it.exerciseId)!
                    return (
                      <li key={it.key} className="flex flex-wrap items-center gap-x-3 gap-y-3 rounded-lg border p-3">
                        <span className="w-5 text-center text-sm font-medium text-muted-foreground tabular-nums">{i + 1}</span>
                        <ExerciseThumb exercise={e} size="row" />
                        <div className="min-w-32 flex-1 leading-tight">
                          <Link to={`/treinos/exercicios/${e.id}`} className="text-sm font-medium hover:underline">
                            {e.name}
                          </Link>
                          <p className="text-xs text-muted-foreground">
                            {e.group} · {e.equipment}
                          </p>
                        </div>
                        <div className="flex items-end gap-2">
                          <Field label="Séries">
                            <Input type="number" min={1} max={10} value={it.sets} onChange={(ev) => patchItem(s.id, it.key, { sets: Math.max(1, Number(ev.target.value) || 1) })} className="h-8 w-16" />
                          </Field>
                          <Field label="Repetições">
                            <Input value={it.reps} onChange={(ev) => patchItem(s.id, it.key, { reps: ev.target.value })} className="h-8 w-24" />
                          </Field>
                          <Field label="Descanso (s)">
                            <Input type="number" min={0} step={15} value={it.rest} onChange={(ev) => patchItem(s.id, it.key, { rest: Math.max(0, Number(ev.target.value) || 0) })} className="h-8 w-20" />
                          </Field>
                        </div>
                        <div className="ml-auto flex">
                          <IconAction label="Mover para cima" disabled={i === 0} onClick={() => move(s.id, i, -1)}>
                            <ArrowUp />
                          </IconAction>
                          <IconAction label="Mover para baixo" disabled={i === s.items.length - 1} onClick={() => move(s.id, i, 1)}>
                            <ArrowDown />
                          </IconAction>
                          <IconAction
                            label={`Remover ${e.name}`}
                            onClick={() => {
                              patchSection(s.id, (items) => items.filter((x) => x.key !== it.key))
                              toast(`${e.name} removido`, { action: { label: 'Desfazer', onClick: () => patchSection(s.id, (items) => [...items.slice(0, i), it, ...items.slice(i)]) } })
                            }}
                          >
                            <Trash2 />
                          </IconAction>
                        </div>
                      </li>
                    )
                  })}
                </ol>
              )}
            </Section>
          ))}
        </div>

        <aside className="grid content-start gap-4 lg:sticky lg:top-20 lg:self-start">
          <Section title="Resumo">
            <dl className="grid gap-3 text-sm">
              <div className="flex justify-between">
                <dt className="inline-flex items-center gap-2 text-muted-foreground">
                  <Dumbbell className="size-4" /> Exercícios
                </dt>
                <dd className="font-medium tabular-nums">{all.length}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="inline-flex items-center gap-2 text-muted-foreground">
                  <Clock className="size-4" /> Duração estimada
                </dt>
                <dd className="font-medium tabular-nums">{minutes} min</dd>
              </div>
            </dl>
            {base && (
              <p className="mt-4 border-t pt-3 text-xs text-muted-foreground">
                Em uso por {base.students} {base.students === 1 ? 'aluno' : 'alunos'}. As mudanças valem a partir da próxima sessão.
              </p>
            )}
            <div className="mt-4 grid gap-2">
              <Button loading={saving} onClick={save} className="w-full">
                {saving ? 'Salvando' : 'Salvar treino'}
              </Button>
              <Button variant="ghost" onClick={() => navigate('/treinos')} className="w-full">
                Cancelar
              </Button>
            </div>
          </Section>
          <div className="rounded-xl border border-dashed p-4">
            <Pill tone="brand" icon={<Sparkles />}>
              Aura
            </Pill>
            <p className="mt-2 text-sm text-muted-foreground">Prefere um ponto de partida? A Aura monta um rascunho e você ajusta aqui.</p>
            <Button size="sm" variant="secondary" className="mt-3" onClick={() => navigate('/ia')}>
              Sugerir com IA
            </Button>
          </div>
        </aside>
      </div>

      <Picker
        open={pickFor !== null}
        onOpenChange={(o) => !o && setPickFor(null)}
        onPick={(eid) => {
          if (pickFor) patchSection(pickFor, (items) => [...items, item(eid)])
          toast.success(`${findExercise(eid)!.name} adicionado`)
          setPickFor(null)
        }}
      />
    </>
  )
}
