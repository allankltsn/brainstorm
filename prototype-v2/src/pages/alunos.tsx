import { ArrowLeft, CheckCircle2, ChevronRight, CircleDashed, Dumbbell, Monitor, Plus, Search, ShieldOff, TriangleAlert, User, UserX } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/affect/button'
import { SegmentedControl } from '@/components/affect/segmented-control'
import { Select } from '@/components/affect/select'
import { TextArea } from '@/components/affect/text-area'
import { TextField } from '@/components/affect/text-field'
import { PageHeader, Person, Pill, Section } from '@/components/page'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { activeStudents, initials, maskEmail, STUDENT_LIMIT, students, type Student } from '@/lib/data'

type Tab = 'ativos' | 'pendentes' | 'historico'

function HealthPill({ s }: { s: Student }) {
  if (s.health === 'liberado') return <Pill tone="success" icon={<CheckCircle2 />}>Saúde liberada</Pill>
  if (s.health === 'revogado') return <Pill tone="danger" icon={<ShieldOff />}>Liberação retirada</Pill>
  return <Pill icon={<CircleDashed />}>Aguardando liberar</Pill>
}

function AlertPill({ n }: { n: number }) {
  return n ? (
    <Pill tone="warning" icon={<TriangleAlert />}>
      {n} {n === 1 ? 'alerta' : 'alertas'}
    </Pill>
  ) : (
    <span className="text-sm text-muted-foreground">Nenhum</span>
  )
}

const ModePill = ({ mode }: { mode: Student['mode'] }) => <Pill icon={mode === 'Remoto' ? <Monitor /> : <User />}>{mode}</Pill>

export function Alunos() {
  const navigate = useNavigate()
  const [tab, setTab] = useState<Tab>('ativos')
  const [q, setQ] = useState('')
  const [mode, setMode] = useState('todos')

  const groups = useMemo(
    () => ({
      ativos: activeStudents(),
      pendentes: students.filter((s) => s.status === 'pendente'),
      historico: students.filter((s) => s.status === 'encerrado'),
    }),
    [],
  )
  const list = groups[tab]
    .filter((s) => s.name.toLowerCase().includes(q.trim().toLowerCase()))
    .filter((s) => mode === 'todos' || s.mode === mode)
    .sort((a, b) => b.alerts - a.alerts || a.name.localeCompare(b.name, 'pt-BR'))
  const used = groups.ativos.length

  return (
    <>
      <PageHeader
        title="Alunos"
        description={`${used} de ${STUDENT_LIMIT} vagas do seu plano em uso. Restam ${STUDENT_LIMIT - used}.`}
        actions={
          <Button icon={<Plus />} onClick={() => navigate('/convidar-aluno')}>
            Convidar aluno
          </Button>
        }
      />

      <div className="mb-4 flex flex-wrap items-end gap-3">
        <SegmentedControl<Tab>
          aria-label="Situação dos alunos"
          value={tab}
          onChange={setTab}
          options={[
            { value: 'ativos', label: 'Ativos', count: groups.ativos.length },
            { value: 'pendentes', label: 'Pendentes', count: groups.pendentes.length },
            { value: 'historico', label: 'Histórico', count: groups.historico.length },
          ]}
        />
        <div className="ml-auto flex w-full flex-wrap gap-3 sm:w-auto">
          <TextField
            aria-label="Buscar aluno pelo nome"
            placeholder="Buscar pelo nome"
            prefix={<Search className="size-4" />}
            clearable
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onClear={() => setQ('')}
            className="min-w-48 flex-1 sm:w-64"
          />
          <Select
            aria-label="Modo de acompanhamento"
            value={mode}
            onChange={setMode}
            className="w-44"
            options={[
              { value: 'todos', label: 'Todos os modos' },
              { value: 'Presencial', label: 'Presencial', icon: <User className="size-4" /> },
              { value: 'Remoto', label: 'Remoto', icon: <Monitor className="size-4" /> },
            ]}
          />
        </div>
      </div>

      <p className="sr-only" role="status">
        {list.length} alunos encontrados
      </p>

      {list.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed px-6 py-16 text-center">
          <UserX className="size-8 text-muted-foreground" />
          <p className="font-medium">Nenhum aluno encontrado</p>
          <p className="max-w-sm text-sm text-muted-foreground">Confira o nome digitado ou limpe os filtros para ver todos.</p>
          <Button
            variant="secondary"
            size="sm"
            className="mt-2"
            onClick={() => {
              setQ('')
              setMode('todos')
            }}
          >
            Limpar filtros
          </Button>
        </div>
      ) : (
        <>
          {/* Desktop: tabela. A linha inteira leva ao aluno. */}
          <div className="hidden overflow-hidden rounded-xl border bg-card md:block">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-5">Aluno</TableHead>
                  <TableHead>Modo</TableHead>
                  <TableHead>{tab === 'pendentes' ? 'Situação' : 'Treino atual'}</TableHead>
                  <TableHead>Última sessão</TableHead>
                  <TableHead>Alertas</TableHead>
                  <TableHead>Dados de saúde</TableHead>
                  <TableHead className="w-24 pr-5" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {list.map((s) => (
                  <TableRow key={s.id} className="cursor-pointer" onClick={() => navigate(`/alunos/${s.id}`)}>
                    <TableCell className="py-3 pl-5">
                      <Link to={`/alunos/${s.id}`} onClick={(e) => e.stopPropagation()} className="rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring">
                        <Person name={s.name} sub={maskEmail(s.email)} />
                      </Link>
                    </TableCell>
                    <TableCell>
                      <ModePill mode={s.mode} />
                    </TableCell>
                    <TableCell className="text-sm">
                      {s.note ?? s.plan ?? <span className="text-muted-foreground">Sem treino</span>}
                      {s.status === 'pausado' && <Pill className="ml-2">Pausado</Pill>}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{s.lastSession}</TableCell>
                    <TableCell>
                      <AlertPill n={s.alerts} />
                    </TableCell>
                    <TableCell>
                      <HealthPill s={s} />
                    </TableCell>
                    <TableCell className="pr-5 text-right">
                      <Button size="sm" variant="secondary" iconRight={<ChevronRight />} tabIndex={-1} aria-hidden="true">
                        Abrir
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Celular: uma lista de cartões, sem rolagem lateral. */}
          <ul className="grid gap-2 md:hidden">
            {list.map((s) => (
              <li key={s.id}>
                <Link to={`/alunos/${s.id}`} className="flex items-center gap-3 rounded-xl border bg-card p-3.5 active:bg-muted">
                  <span className="min-w-0 flex-1">
                    <Person name={s.name} sub={s.note ?? `${s.plan ?? 'Sem treino'} · ${s.lastSession.toLowerCase()}`} />
                    {(s.alerts > 0 || s.health !== 'liberado') && (
                      <span className="mt-2.5 flex flex-wrap gap-1.5 pl-12">
                        {s.alerts > 0 && <AlertPill n={s.alerts} />}
                        {s.health !== 'liberado' && <HealthPill s={s} />}
                      </span>
                    )}
                  </span>
                  <ChevronRight className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  )
}

type DetailTab = 'resumo' | 'saude' | 'anotacoes'

export function AlunoDetalhe() {
  const { id } = useParams()
  const navigate = useNavigate()
  const s = students.find((x) => x.id === id)
  const [tab, setTab] = useState<DetailTab>('resumo')
  const [saving, setSaving] = useState(false)
  if (!s) {
    return (
      <div className="py-16 text-center">
        <p className="font-medium">Aluno não encontrado</p>
        <Link to="/alunos" className="mt-2 inline-block text-sm text-brand-text hover:underline">
          Voltar para a lista
        </Link>
      </div>
    )
  }
  const canSee = s.health === 'liberado' && s.status !== 'encerrado'
  return (
    <>
      <Link to="/alunos" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Alunos
      </Link>
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <Avatar className="size-14">
          <AvatarFallback className="bg-brand-soft text-base font-semibold text-brand-text">{initials(s.name)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-semibold tracking-tight">{s.name}</h1>
          <div className="mt-1.5 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <ModePill mode={s.mode} />
            <HealthPill s={s} />
            <span>Aluno desde {s.since}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => navigate('/mensagens')}>
            Enviar mensagem
          </Button>
          <Button icon={<Dumbbell />} onClick={() => navigate('/ia')}>
            {s.plan ? 'Trocar treino' : 'Montar treino'}
          </Button>
        </div>
      </div>

      <SegmentedControl<DetailTab>
        variant="underline"
        kind="tabs"
        aria-label="Seções do aluno"
        value={tab}
        onChange={setTab}
        className="mb-6"
        options={[
          { value: 'resumo', label: 'Resumo', controls: 'painel-aluno' },
          { value: 'saude', label: 'Saúde', controls: 'painel-aluno' },
          { value: 'anotacoes', label: 'Anotações', controls: 'painel-aluno' },
        ]}
      />

      <div id="painel-aluno" role="tabpanel">
        {tab === 'resumo' && (
          <div className="grid gap-6 md:grid-cols-2">
            <Section title="Treino atual">
              {canSee && s.plan ? (
                <dl className="grid gap-3 text-sm">
                  {[
                    ['Plano', s.plan],
                    ['Período', '01/09/2026 a 30/11/2026'],
                    ['Última sessão', s.lastSession],
                    ['Treinos concluídos', String(s.done)],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-4">
                      <dt className="text-muted-foreground">{k}</dt>
                      <dd className="font-medium">{v}</dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <p className="text-sm text-muted-foreground">
                  {s.plan === null && canSee ? 'Este aluno ainda não tem treino. Monte um para começar.' : 'Os dados de treino ficam ocultos até o aluno liberar os dados de saúde.'}
                </p>
              )}
            </Section>
            <Section title="Alertas">
              {s.alerts ? (
                <div className="flex items-start gap-3 rounded-lg bg-warning-soft p-3 text-sm text-warning">
                  <TriangleAlert className="mt-0.5 size-4 shrink-0" />
                  <p>
                    <strong className="font-medium">Faltas seguidas.</strong> {s.name.split(' ')[0]} não registra treino {s.lastSession.toLowerCase()}.
                  </p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Nenhum alerta aberto. Tudo em dia.</p>
              )}
            </Section>
          </div>
        )}
        {tab === 'saude' && (
          <Section title="O que o aluno liberou" description="Só o aluno pode mudar estas autorizações.">
            <ul className="divide-y">
              {[
                ['Saúde geral', s.health === 'liberado' ? 'Liberado' : s.health === 'revogado' ? 'Retirado' : 'Não liberado', s.health === 'liberado'],
                ['Fotos', 'Não liberado', false],
                ['Vídeos', 'Não liberado', false],
                ['Uso de inteligência artificial', 'Não liberado', false],
              ].map(([k, v, ok]) => (
                <li key={k as string} className="flex items-center justify-between gap-4 py-3 text-sm">
                  <span>{k}</span>
                  <Pill tone={ok ? 'success' : 'neutral'} icon={ok ? <CheckCircle2 /> : <CircleDashed />}>
                    {v}
                  </Pill>
                </li>
              ))}
            </ul>
          </Section>
        )}
        {tab === 'anotacoes' && (
          <Section title="Anotações do personal" description="Só você vê estas anotações.">
            <TextArea
              label="Nova anotação"
              placeholder="Ex.: pediu para evitar agachamento esta semana"
              minRows={3}
              maxRows={8}
              maxLength={500}
              counter
              hint="Evite dados de saúde aqui. Use a aba Saúde."
            />
            <div className="mt-4 flex justify-end">
              <Button
                loading={saving}
                onClick={() => {
                  setSaving(true)
                  setTimeout(() => {
                    setSaving(false)
                    toast.success('Anotação salva')
                  }, 800)
                }}
              >
                {saving ? 'Salvando' : 'Salvar anotação'}
              </Button>
            </div>
          </Section>
        )}
      </div>
    </>
  )
}
