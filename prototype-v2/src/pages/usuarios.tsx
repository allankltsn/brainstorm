import { Ban, MailPlus, Search, ShieldCheck, UserX } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/affect/button'
import { Select } from '@/components/affect/select'
import { TextField } from '@/components/affect/text-field'
import { PageHeader, Person, Pill } from '@/components/page'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { accounts as seed, type Account } from '@/lib/billing'

const ROLES = { personal: 'Personal', aluno: 'Aluno', admin: 'Admin' } as const
const STATUS: Record<Account['status'], { label: string; tone: 'success' | 'danger' | 'neutral' }> = {
  ativo: { label: 'Ativo', tone: 'success' },
  bloqueado: { label: 'Bloqueado', tone: 'danger' },
  convidado: { label: 'Convite enviado', tone: 'neutral' },
}

export function Usuarios() {
  const navigate = useNavigate()
  const [list, setList] = useState(seed)
  const [q, setQ] = useState('')
  const [role, setRole] = useState<string | null>('todos')
  const [target, setTarget] = useState<Account>()
  const [inviting, setInviting] = useState(false)
  const [email, setEmail] = useState('')

  const rows = list.filter((a) => (role === 'todos' || a.role === role) && (a.name + a.email).toLowerCase().includes(q.trim().toLowerCase()))
  const toggle = (a: Account) => {
    const blocked = a.status !== 'bloqueado'
    setList((l) => l.map((x) => (x.id === a.id ? { ...x, status: blocked ? 'bloqueado' : 'ativo' } : x)))
    toast.success(blocked ? `${a.name} foi bloqueado` : `${a.name} foi desbloqueado`)
    setTarget(undefined)
  }

  return (
    <>
      <PageHeader title="Usuários" description={`${list.length} contas na plataforma.`} actions={<><Button variant="secondary" onClick={() => navigate('/usuarios/perfis')}>Perfis e permissões</Button><Button icon={<MailPlus />} onClick={() => setInviting(true)}>Convidar usuário</Button></>} />
      <div className="mb-4 flex flex-wrap items-start gap-3">
        <TextField aria-label="Buscar por nome ou e-mail" placeholder="Buscar por nome ou e-mail" prefix={<Search className="size-4" />} clearable value={q} onChange={(e) => setQ(e.target.value)} onClear={() => setQ('')} className="min-w-52 flex-1 sm:max-w-sm" />
        <Select
          aria-label="Perfil"
          value={role}
          onChange={setRole}
          className="w-44"
          options={[{ value: 'todos', label: 'Todos os perfis' }, ...Object.entries(ROLES).map(([value, label]) => ({ value, label }))]}
        />
      </div>
      {rows.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed px-6 py-16 text-center">
          <UserX className="size-8 text-muted-foreground" />
          <p className="font-medium">Nenhum usuário encontrado</p>
          <p className="text-sm text-muted-foreground">Confira a busca ou escolha outro perfil.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-5">Usuário</TableHead>
                <TableHead>Perfil</TableHead>
                <TableHead className="hidden md:table-cell">Plano</TableHead>
                <TableHead>Situação</TableHead>
                <TableHead className="pr-5 text-right"><span className="sr-only">Ações</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="py-3 pl-5">
                    <Link to={`/usuarios/${a.id}`} className="rounded-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none">
                      <Person name={a.name} sub={a.email} size="sm" />
                    </Link>
                  </TableCell>
                  <TableCell className="text-sm">{ROLES[a.role]}</TableCell>
                  <TableCell className="hidden text-sm text-muted-foreground md:table-cell">{a.plan ?? '—'}</TableCell>
                  <TableCell><Pill tone={STATUS[a.status].tone}>{STATUS[a.status].label}</Pill></TableCell>
                  <TableCell className="pr-5 text-right">
                    {a.role === 'admin' ? (
                      <Pill icon={<ShieldCheck />}>Protegido</Pill>
                    ) : (
                      <Button size="sm" variant="ghost" aria-label={`${a.status === 'bloqueado' ? 'Desbloquear' : 'Bloquear'} ${a.name}`} onClick={() => setTarget(a)}>
                        {a.status === 'bloqueado' ? 'Desbloquear' : 'Bloquear'}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={!!target} onOpenChange={(o) => !o && setTarget(undefined)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{target?.status === 'bloqueado' ? 'Desbloquear' : 'Bloquear'} {target?.name}?</DialogTitle>
            <DialogDescription>
              {target?.status === 'bloqueado' ? 'A pessoa volta a conseguir entrar na conta.' : 'A pessoa não consegue mais entrar. Os dados são mantidos.'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setTarget(undefined)}>Cancelar</Button>
            <Button variant={target?.status === 'bloqueado' ? 'primary' : 'destructive'} icon={<Ban />} onClick={() => target && toggle(target)}>
              {target?.status === 'bloqueado' ? 'Desbloquear' : 'Bloquear'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={inviting} onOpenChange={setInviting}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Convidar usuário</DialogTitle>
            <DialogDescription>A pessoa recebe um e-mail para criar a conta de personal.</DialogDescription>
          </DialogHeader>
          <TextField label="E-mail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <DialogFooter>
            <Button variant="secondary" onClick={() => setInviting(false)}>Cancelar</Button>
            <Button
              disabled={!/^\S+@\S+\.\S+$/.test(email)}
              onClick={() => {
                setList((l) => [...l, { id: `u${l.length + 1}`, name: email.split('@')[0], email, role: 'personal', status: 'convidado', since: '16/10/2026' }])
                toast.success('Convite enviado')
                setEmail('')
                setInviting(false)
              }}
            >
              Enviar convite
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
