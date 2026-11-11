import { CalendarDays, ChevronRight, Copy, Dumbbell, FileSpreadsheet, Plus, Search, Sparkles, Upload, Users } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/affect/button'
import { SegmentedControl } from '@/components/affect/segmented-control'
import { TextField } from '@/components/affect/text-field'
import { PageHeader, Pill } from '@/components/page'
import { ExerciseThumb } from '@/components/exercise-thumb'
import { EmptyState, ErrorState, ListSkeleton } from '@/components/states'
import { countItems, exercises, GROUPS, systemTemplates, workouts } from '@/lib/training'
import { useLoad } from '@/lib/use-load'
import { useTab } from '@/lib/use-tab'
import { Link } from 'react-router-dom'

const TABS = ['modelos', 'prontos', 'exercicios', 'importar'] as const
type Tab = (typeof TABS)[number]
const FILTERS = ['Todos', ...GROUPS] as const

export function Treinos() {
  const navigate = useNavigate()
  const [tab, setTab] = useTab<Tab>(TABS)
  const { state, empty, retry } = useLoad()
  const mine = empty ? [] : workouts
  const [q, setQ] = useState('')
  const [group, setGroup] = useState<(typeof FILTERS)[number]>('Todos')
  const list = exercises.filter((e) => (group === 'Todos' || e.group === group) && e.name.toLowerCase().includes(q.trim().toLowerCase()))

  return (
    <>
      <PageHeader
        title="Treinos"
        description="Monte uma vez e use com vários alunos."
        actions={
          tab === 'exercicios' ? (
            <Button icon={<Plus />} onClick={() => navigate('/treinos/exercicios/novo')}>
              Criar exercício
            </Button>
          ) : (
            <>
              <Button variant="secondary" icon={<Sparkles />} onClick={() => navigate('/ia')}>
                Sugerir com IA
              </Button>
              <Button icon={<Plus />} onClick={() => navigate('/treinos/novo')}>
                Criar treino
              </Button>
            </>
          )
        }
      />
      <SegmentedControl<Tab>
        variant="underline"
        kind="tabs"
        aria-label="Seções de treinos"
        value={tab}
        onChange={setTab}
        className="mb-6"
        options={[
          { value: 'modelos', label: 'Meus treinos', count: mine.length, controls: 'painel-treinos' },
          { value: 'prontos', label: 'Modelos prontos', count: systemTemplates.length, controls: 'painel-treinos' },
          { value: 'exercicios', label: 'Exercícios', count: exercises.length, controls: 'painel-treinos' },
          { value: 'importar', label: 'Importar planilha', controls: 'painel-treinos' },
        ]}
      />
      <div id="painel-treinos" role="tabpanel">
        {state === 'carregando' && tab !== 'importar' && <ListSkeleton rows={3} label="Carregando seus treinos" className="sm:grid-cols-2 xl:grid-cols-3" />}
        {state === 'erro' && tab !== 'importar' && <ErrorState what="seus treinos" onRetry={retry} />}
        {state === 'pronto' && tab === 'modelos' && mine.length === 0 && (
          <EmptyState
            icon={<Dumbbell />}
            title="Você ainda não criou nenhum treino"
            text="Comece do zero, peça uma sugestão à IA ou copie um modelo pronto."
            action={
              <Button variant="secondary" onClick={() => setTab('prontos')}>
                Ver modelos prontos
              </Button>
            }
          />
        )}
        {state === 'pronto' && tab === 'prontos' && (
          <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {systemTemplates.map((m) => (
              <li key={m.id} className="flex flex-col rounded-xl border bg-card p-5">
                <div className="flex flex-wrap gap-1.5">
                  <Pill tone="brand">Modelo do aura-fit</Pill>
                  <Pill>{m.level}</Pill>
                </div>
                <h2 className="mt-3 text-base font-semibold">{m.name}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{m.text}</p>
                <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays className="size-4" /> {m.days} dias por semana
                  </span>
                  <span>{countItems(m)} exercícios</span>
                </p>
                <div className="mt-auto flex pt-5">
                  <Button size="sm" variant="secondary" icon={<Copy />} className="flex-1" aria-label={`Usar o modelo ${m.name}`} onClick={() => navigate(`/treinos/novo?modelo=${m.id}`)}>
                    Usar este modelo
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
        {state === 'pronto' && tab === 'modelos' && mine.length > 0 && (
          <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {mine.map((m) => (
              <li key={m.id} className="flex flex-col rounded-xl border bg-card p-5">
                <Pill className="self-start">{m.goal}</Pill>
                <h2 className="mt-3 text-base font-semibold">
                  <Link to={`/treinos/${m.id}`} className="hover:underline">
                    {m.name}
                  </Link>
                </h2>
                <p className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays className="size-4" /> {m.days} dias por semana
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Users className="size-4" /> {m.students} {m.students === 1 ? 'aluno' : 'alunos'}
                  </span>
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{countItems(m)} exercícios</p>
                <div className="mt-5 flex gap-2">
                  <Button size="sm" variant="ghost" onClick={() => navigate(`/treinos/${m.id}`)}>
                    Editar
                  </Button>
                  <Button size="sm" variant="secondary" className="flex-1" onClick={() => navigate(`/treinos/${m.id}/atribuir`)}>
                    Usar com um aluno
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
        {state === 'pronto' && tab === 'exercicios' && (
          <>
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <TextField aria-label="Buscar exercício" placeholder="Buscar exercício" prefix={<Search className="size-4" />} clearable value={q} onChange={(e) => setQ(e.target.value)} onClear={() => setQ('')} className="w-full sm:w-64" />
              <div className="max-w-full overflow-x-auto">
                <SegmentedControl aria-label="Grupo muscular" size="sm" value={group} onChange={setGroup} options={FILTERS.map((g) => ({ value: g, label: g }))} />
              </div>
            </div>
            {list.length === 0 ? (
              <p className="rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">Nenhum exercício encontrado.</p>
            ) : (
              <ul className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
                {list.map((e) => (
                  <li key={e.id}>
                    <Link to={`/treinos/exercicios/${e.id}`} className="group block rounded-xl border bg-card p-2.5 outline-none transition-shadow hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring">
                      <ExerciseThumb exercise={e} />
                      <span className="mt-2.5 flex items-center justify-between gap-2 px-1 pb-1">
                        <span className="grid min-w-0 leading-tight">
                          <span className="truncate text-sm font-medium">{e.name}</span>
                          <span className="truncate text-xs text-muted-foreground">
                            {e.group} · {e.equipment}
                          </span>
                        </span>
                        <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
        {tab === 'importar' && (
          <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed px-6 py-16 text-center">
            <FileSpreadsheet className="size-9 text-muted-foreground" />
            <p className="font-medium">Traga seus treinos de uma planilha</p>
            <p className="max-w-sm text-sm text-muted-foreground">Envie um arquivo Excel ou CSV. A IA organiza os exercícios e você confere tudo antes de salvar.</p>
            <Button className="mt-3" icon={<Upload />} onClick={() => navigate('/treinos/importar')}>
              Escolher arquivo
            </Button>
          </div>
        )}
      </div>
    </>
  )
}
