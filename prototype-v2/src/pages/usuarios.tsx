import { ArrowLeft, Ban, CheckCircle2, ChevronRight, CircleDashed, Plus, RotateCcw, Search, TriangleAlert } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/affect/button'
import { SegmentedControl } from '@/components/affect/segmented-control'
import { Select } from '@/components/affect/select'
import { TextArea } from '@/components/affect/text-area'
import { TextField } from '@/components/affect/text-field'
import { PageHeader, Person, Pill, Section } from '@/components/page'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { platformUsers, ROLE_NAME, type PlatformUser, type UserRole, type UserStatus } from '@/lib/admin'
import { initials, maskEmail } from '@/lib/data'

type Filter = 'todos' | 'personal' | 'aluno' | 'equipe'
const inFilter = (u: PlatformUser, f: Filter) => f === 'todos' || (f === 'equipe' ? u.role === 'admin' || u.role === 'suporte' : u.role === f)

function StatusPill({ status }: { status: UserStatus }) {
  if (status === 'ativo') return <Pill tone="success" icon={<CheckCircle2 />}>Ativo</Pill>
  if (status === 'bloqueado') return <Pill tone="danger" icon={<Ban />}>Bloqueado</Pill>
  return <Pill icon={<CircleDashed />}>Convite pendente</Pill>
}

/* Convite: e-mail e perfil. Nada de senha aqui; a pessoa cria a dela ao aceitar. */
function InviteDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<string>('personal')
  const [error, setError] = useState<string>()
  const [sending, setSending] = useState(false)
  function send() {
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError('Digite um e-mail válido, como nome@exemplo.com.br.')
    setSending(true)
    setTimeout(() => {
      setSending(false)
      onOpenChange(false)
      toast.success('Convite enviado', { description: `${email} recebe um link válido por 7 dias.` })
      setEmail('')
    }, 800)
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Convidar usuário</DialogTitle>
          <DialogDescription>A pessoa recebe um e-mail com o link para criar a senha.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <TextField
            label="E-mail"
            type="email"
            placeholder="nome@exemplo.com.br"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setError(undefined)
            }}
            error={error}
          />
          <Select
            label="Perfil"
            value={role}
            onChange={setRole}
            options={[
              { value: 'personal', label: 'Personal', description: 'Atende alunos e monta treinos' },
              { value: 'suporte', label: 'Suporte', description: 'Consulta usuários e planos, sem alterar' },
              { value: 'admin', label: 'Administrador', description: 'Gerencia usuários, planos e cupons' },
            ]}
          />
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button loading={sending} onClick={send}>
            {sending ? 'Enviando' : 'Enviar convite'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function Usuarios() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState<Filter>('todos')
  const [status, setStatus] = useState('todos')
  const [q, setQ] = useState('')
  const [invite, setInvite] = useState(false)
  const count = (f: Filter) => platformUsers.filter((u) => inFilter(u, f)).length
  const list = platformUsers
    .filter((u) => inFilter(u, filter))
    .filter((u) => status === 'todos' || u.status === status)
    .filter((u) => `${u.name} ${u.email}`.toLowerCase().includes(q.trim().toLowerCase()))
  const late = platformUsers.filter((u) => u.payment === 'em atraso' && u.status === 'ativo')

  return (
    <>
      <PageHeader
        title="Usuários"
        description={`${platformUsers.length} contas na plataforma. Dados de saúde dos alunos não aparecem aqui.`}
        actions={
          <Button icon={<Plus />} onClick={() => setInvite(true)}>
            Convidar usuário
          </Button>
        }
      />

      {late.length > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-3 rounded-xl bg-warning-soft p-3 text-sm text-warning">
          <TriangleAlert className="size-4 shrink-0" />
          <p className="min-w-0 flex-1">
            <strong className="font-medium">{late[0].name}</strong> está com a assinatura em atraso há 7 dias.
          </p>
          <Button size="sm" variant="secondary" onClick={() => navigate(`/usuarios/${late[0].id}`)}>
            Abrir conta
          </Button>
        </div>
      )}

      <div className="mb-4 flex flex-wrap items-end gap-3">
        <SegmentedControl<Filter>
          aria-label="Tipo de usuário"
          value={filter}
          onChange={setFilter}
          options={[
            { value: 'todos', label: 'Todos', count: count('todos') },
            { value: 'personal', label: 'Personais', count: count('personal') },
            { value: 'aluno', label: 'Alunos', count: count('aluno') },
            { value: 'equipe', label: 'Equipe', count: count('equipe') },
          ]}
        />
        <div className="ml-auto flex flex-1 flex-wrap justify-end gap-3">
          <TextField aria-label="Buscar usuário" placeholder="Buscar por nome ou e-mail" prefix={<Search className="size-4" />} clearable value={q} onChange={(e) => setQ(e.target.value)} onClear={() => setQ('')} className="min-w-52 flex-1 sm:max-w-72" />
          <Select
            aria-label="Situação"
            value={status}
            onChange={setStatus}
            className="w-44"
            options={[
              { value: 'todos', label: 'Todas as situações' },
              { value: 'ativo', label: 'Ativos' },
              { value: 'pendente', label: 'Convite pendente' },
              { value: 'bloqueado', label: 'Bloqueados' },
            ]}
          />
        </div>
      </div>

      {list.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed px-6 py-16 text-center">
          <p className="font-medium">Nenhum usuário encontrado</p>
          <p className="text-sm text-muted-foreground">Mude a busca ou os filtros.</p>
          <Button
            size="sm"
            variant="secondary"
            className="mt-2"
            onClick={() => {
              setQ('')
              setStatus('todos')
              setFilter('todos')
            }}
          >
            Limpar filtros
          </Button>
        </div>
      ) : (
        <>
          <div className="hidden overflow-hidden rounded-xl border bg-card md:block">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-5">Usuário</TableHead>
                  <TableHead>Perfil</TableHead>
                  <TableHead>Plano</TableHead>
                  <TableHead>Último acesso</TableHead>
                  <TableHead>Situação</TableHead>
                  <TableHead className="pr-5" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {list.map((u) => (
                  <TableRow key={u.id} className="cursor-pointer" onClick={() => navigate(`/usuarios/${u.id}`)}>
                    <TableCell className="pl-5">
                      <Link to={`/usuarios/${u.id}`} onClick={(e) => e.stopPropagation()} className="rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring">
                        <Person name={u.name} sub={maskEmail(u.email)} />
                      </Link>
                    </TableCell>
                    <TableCell className="text-sm">{ROLE_NAME[u.role]}</TableCell>
                    <TableCell className="text-sm">
                      {u.plan ?? <span className="text-muted-foreground">Não se aplica</span>}
                      {u.payment === 'em atraso' && (
                        <Pill tone="warning" className="ml-2">
                          Em atraso
                        </Pill>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{u.lastLogin}</TableCell>
                    <TableCell>
                      <StatusPill status={u.status} />
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
          <ul className="grid gap-2 md:hidden">
            {list.map((u) => (
              <li key={u.id}>
                <Link to={`/usuarios/${u.id}`} className="flex items-center gap-3 rounded-xl border bg-card p-3.5 active:bg-muted">
                  <span className="min-w-0 flex-1">
                    <Person name={u.name} sub={`${ROLE_NAME[u.role]}${u.plan ? ` · ${u.plan}` : ''}`} />
                    <span className="mt-2.5 flex flex-wrap gap-1.5 pl-12">
                      <StatusPill status={u.status} />
                      {u.payment === 'em atraso' && <Pill tone="warning">Em atraso</Pill>}
                    </span>
                  </span>
                  <ChevronRight className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
      <InviteDialog open={invite} onOpenChange={setInvite} />
    </>
  )
}

const ROLE_OPTIONS: { value: UserRole; label: string }[] = (['personal', 'aluno', 'suporte', 'admin'] as const).map((r) => ({ value: r, label: ROLE_NAME[r] }))

export function UsuarioDetalhe() {
  const { id } = useParams()
  const base = platformUsers.find((x) => x.id === id)
  const [status, setStatus] = useState<UserStatus>(base?.status ?? 'ativo')
  const [reason, setReason] = useState(base?.blockReason ?? '')
  const [role, setRole] = useState<string>(base?.role ?? 'personal')
  const [blocking, setBlocking] = useState(false)
  const [draft, setDraft] = useState('')
  const [error, setError] = useState<string>()
  if (!base) {
    return (
      <div className="py-16 text-center">
        <p className="font-medium">Usuário não encontrado</p>
        <Link to="/usuarios" className="mt-2 inline-block text-sm text-brand-text hover:underline">
          Voltar para a lista
        </Link>
      </div>
    )
  }
  const u = base
  const first = u.name.split(' ')[0]

  function block() {
    if (draft.trim().length < 10) return setError('Explique o motivo em pelo menos 10 letras. Ele fica no histórico.')
    setStatus('bloqueado')
    setReason(draft.trim())
    setBlocking(false)
    setDraft('')
    toast.success(`${first} foi bloqueado`, { description: 'A pessoa não consegue entrar até ser reativada.', action: { label: 'Desfazer', onClick: () => setStatus('ativo') } })
  }

  return (
    <>
      <Link to="/usuarios" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Usuários
      </Link>
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <Avatar className="size-14">
          <AvatarFallback className="bg-brand-soft text-base font-semibold text-brand-text">{initials(u.name)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-semibold tracking-tight">{u.name}</h1>
          <div className="mt-1.5 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <Pill>{ROLE_NAME[u.role]}</Pill>
            <StatusPill status={status} />
            <span>Conta criada em {u.since}</span>
          </div>
        </div>
        <div className="flex gap-2">
          {status === 'pendente' && <Button onClick={() => toast.success('Convite reenviado')}>Reenviar convite</Button>}
          {status === 'ativo' && (
            <Button variant="destructive" icon={<Ban />} onClick={() => setBlocking(true)}>
              Bloquear acesso
            </Button>
          )}
          {status === 'bloqueado' && (
            <Button
              icon={<RotateCcw />}
              onClick={() => {
                setStatus('ativo')
                toast.success(`${first} foi reativado`, { action: { label: 'Desfazer', onClick: () => setStatus('bloqueado') } })
              }}
            >
              Reativar acesso
            </Button>
          )}
        </div>
      </div>

      {status === 'bloqueado' && (
        <div className="mb-6 flex items-start gap-3 rounded-xl bg-destructive/10 p-4 text-sm text-destructive">
          <Ban className="mt-0.5 size-4 shrink-0" />
          <p>
            <strong className="font-medium">Acesso bloqueado.</strong> {reason}
          </p>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Section title="Conta">
          <dl className="grid gap-3 text-sm">
            {[
              ['E-mail', maskEmail(u.email)],
              ['Último acesso', u.lastLogin],
              ['Conta criada em', u.since],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4">
                <dt className="text-muted-foreground">{k}</dt>
                <dd className="font-medium">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-4 border-t pt-4">
            <Select
              label="Perfil de acesso"
              value={role}
              onChange={(v) => {
                const prev = role
                setRole(v)
                toast.success(`Perfil alterado para ${ROLE_NAME[v as UserRole]}`, { action: { label: 'Desfazer', onClick: () => setRole(prev) } })
              }}
              options={ROLE_OPTIONS}
              hint="A mudança vale a partir do próximo acesso."
            />
          </div>
        </Section>

        <Section title="Assinatura">
          {u.plan ? (
            <dl className="grid gap-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Plano</dt>
                <dd className="font-medium">{u.plan}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Alunos atendidos</dt>
                <dd className="font-medium tabular-nums">{u.students}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-muted-foreground">Pagamento</dt>
                <dd>{u.payment === 'em atraso' ? <Pill tone="warning" icon={<TriangleAlert />}>Em atraso há 7 dias</Pill> : u.payment ? <Pill tone="success" icon={<CheckCircle2 />}>Em dia</Pill> : <span className="text-muted-foreground">Sem cobrança ainda</span>}</dd>
              </div>
            </dl>
          ) : (
            <p className="text-sm text-muted-foreground">{u.role === 'aluno' ? 'Alunos não pagam assinatura. O plano é do personal que atende.' : 'Contas da equipe não têm assinatura.'}</p>
          )}
          {u.payment === 'em atraso' && (
            <Button size="sm" variant="secondary" className="mt-4" onClick={() => toast.success('Lembrete de pagamento enviado')}>
              Enviar lembrete de pagamento
            </Button>
          )}
        </Section>
      </div>

      <Dialog open={blocking} onOpenChange={setBlocking}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Bloquear o acesso de {first}?</DialogTitle>
            <DialogDescription>A pessoa não consegue entrar até ser reativada. Nenhum dado é apagado, e você pode desfazer.</DialogDescription>
          </DialogHeader>
          <TextArea
            label="Motivo"
            placeholder="Ex.: cobrança contestada, aguardando contato"
            minRows={3}
            maxRows={6}
            maxLength={300}
            value={draft}
            onChange={(e) => {
              setDraft(e.target.value)
              setError(undefined)
            }}
            error={error}
          />
          <DialogFooter>
            <Button variant="ghost" onClick={() => setBlocking(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={block}>
              Bloquear acesso
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
