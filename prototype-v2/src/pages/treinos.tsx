import { CalendarDays, FileSpreadsheet, Plus, Search, Sparkles, Upload, Users } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/affect/button'
import { SegmentedControl } from '@/components/affect/segmented-control'
import { TextField } from '@/components/affect/text-field'
import { PageHeader, Pill } from '@/components/page'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useTab } from '@/lib/use-tab'

const MODELS = [
  { id: 't1', name: 'Hipertrofia A/B', days: 4, exercises: 10, students: 5, goal: 'Ganhar massa' },
  { id: 't2', name: 'Full body', days: 3, exercises: 8, students: 6, goal: 'Condicionamento' },
  { id: 't3', name: 'Força base', days: 3, exercises: 6, students: 4, goal: 'Força' },
  { id: 't4', name: 'Adaptação 2x', days: 2, exercises: 6, students: 1, goal: 'Iniciantes' },
  { id: 't5', name: 'Emagrecimento', days: 4, exercises: 9, students: 1, goal: 'Emagrecer' },
  { id: 't6', name: 'Condicionamento 3x', days: 3, exercises: 7, students: 1, goal: 'Fôlego' },
]

const EXERCISES = [
  ['Supino reto com halteres', 'Peito', 'Halteres'],
  ['Remada curvada', 'Costas', 'Barra'],
  ['Agachamento livre', 'Pernas', 'Barra'],
  ['Levantamento terra romeno', 'Pernas', 'Barra'],
  ['Desenvolvimento de ombros', 'Ombros', 'Halteres'],
  ['Rosca direta', 'Braços', 'Barra'],
  ['Tríceps na polia', 'Braços', 'Polia'],
  ['Prancha', 'Abdômen', 'Peso do corpo'],
  ['Afundo', 'Pernas', 'Halteres'],
  ['Puxada na frente', 'Costas', 'Polia'],
] as const

const TABS = ['modelos', 'exercicios', 'importar'] as const
type Tab = (typeof TABS)[number]
const GROUPS = ['Todos', 'Peito', 'Costas', 'Pernas', 'Ombros', 'Braços', 'Abdômen'] as const

export function Treinos() {
  const navigate = useNavigate()
  const [tab, setTab] = useTab<Tab>(TABS)
  const [q, setQ] = useState('')
  const [group, setGroup] = useState<(typeof GROUPS)[number]>('Todos')
  const list = EXERCISES.filter((e) => (group === 'Todos' || e[1] === group) && e[0].toLowerCase().includes(q.trim().toLowerCase()))

  return (
    <>
      <PageHeader
        title="Treinos"
        description="Monte uma vez e use com vários alunos."
        actions={
          <>
            <Button variant="secondary" icon={<Sparkles />} onClick={() => navigate('/ia')}>
              Sugerir com IA
            </Button>
            <Button icon={<Plus />} onClick={() => toast('Novo treino criado como rascunho')}>
              Criar treino
            </Button>
          </>
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
          { value: 'modelos', label: 'Meus treinos', count: MODELS.length, controls: 'painel-treinos' },
          { value: 'exercicios', label: 'Exercícios', count: EXERCISES.length, controls: 'painel-treinos' },
          { value: 'importar', label: 'Importar planilha', controls: 'painel-treinos' },
        ]}
      />
      <div id="painel-treinos" role="tabpanel">
        {tab === 'modelos' && (
          <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {MODELS.map((m) => (
              <li key={m.id} className="flex flex-col rounded-xl border bg-card p-5">
                <Pill className="self-start">{m.goal}</Pill>
                <h2 className="mt-3 text-base font-semibold">{m.name}</h2>
                <p className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays className="size-4" /> {m.days} dias por semana
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Users className="size-4" /> {m.students} {m.students === 1 ? 'aluno' : 'alunos'}
                  </span>
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{m.exercises} exercícios</p>
                <div className="mt-5 flex gap-2">
                  <Button size="sm" variant="ghost" onClick={() => toast(`Abrindo ${m.name} para editar`)}>
                    Editar
                  </Button>
                  <Button size="sm" variant="secondary" className="flex-1" onClick={() => navigate('/alunos')}>
                    Usar com um aluno
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
        {tab === 'exercicios' && (
          <>
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <TextField aria-label="Buscar exercício" placeholder="Buscar exercício" prefix={<Search className="size-4" />} clearable value={q} onChange={(e) => setQ(e.target.value)} onClear={() => setQ('')} className="w-full sm:w-64" />
              <div className="max-w-full overflow-x-auto">
                <SegmentedControl aria-label="Grupo muscular" size="sm" value={group} onChange={setGroup} options={GROUPS.map((g) => ({ value: g, label: g }))} />
              </div>
            </div>
            <div className="overflow-hidden rounded-xl border bg-card">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="pl-5">Exercício</TableHead>
                    <TableHead>Grupo</TableHead>
                    <TableHead className="hidden sm:table-cell">Equipamento</TableHead>
                    <TableHead className="pr-5 text-right">Ação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {list.map((e) => (
                    <TableRow key={e[0]}>
                      <TableCell className="py-3 pl-5 font-medium">{e[0]}</TableCell>
                      <TableCell>
                        <Pill>{e[1]}</Pill>
                      </TableCell>
                      <TableCell className="hidden text-muted-foreground sm:table-cell">{e[2]}</TableCell>
                      <TableCell className="pr-5 text-right">
                        <Button size="sm" variant="ghost" onClick={() => toast(`${e[0]} adicionado ao rascunho`)}>
                          Adicionar a um treino
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {list.length === 0 && <p className="p-8 text-center text-sm text-muted-foreground">Nenhum exercício encontrado.</p>}
            </div>
          </>
        )}
        {tab === 'importar' && (
          <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed px-6 py-16 text-center">
            <FileSpreadsheet className="size-9 text-muted-foreground" />
            <p className="font-medium">Traga seus treinos de uma planilha</p>
            <p className="max-w-sm text-sm text-muted-foreground">Envie um arquivo Excel ou CSV. A IA organiza os exercícios e você confere tudo antes de salvar.</p>
            <Button className="mt-3" icon={<Upload />} onClick={() => toast('Escolha um arquivo .xlsx ou .csv')}>
              Escolher arquivo
            </Button>
          </div>
        )}
      </div>
    </>
  )
}
