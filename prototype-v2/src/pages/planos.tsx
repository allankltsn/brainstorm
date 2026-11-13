import { Check, Copy, Pause, Pencil, Play, Plus, Users } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/affect/button'
import { SegmentedControl } from '@/components/affect/segmented-control'
import { Switch } from '@/components/affect/switch'
import { TextField } from '@/components/affect/text-field'
import { HBars } from '@/components/charts/charts'
import { PageHeader, Pill, Section } from '@/components/page'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { coupons as COUPONS, discountLabel, plans as PLANS, type Coupon, type Plan } from '@/lib/admin'
import { brl } from '@/lib/data'
import { useTab } from '@/lib/use-tab'
import { cn } from '@/lib/utils'

const TABS = ['planos', 'cupons'] as const
type Tab = (typeof TABS)[number]

const price = (v: number | null) => (v === null ? 'A definir' : v === 0 ? 'Grátis' : brl(v))
const toNumber = (s: string) => Number(s.replace(/\./g, '').replace(',', '.'))

function PlanDialog({ plan, onClose, onSave }: { plan: Plan; onClose: () => void; onSave: (p: Plan) => void }) {
  const [monthly, setMonthly] = useState(plan.monthly === null ? '' : plan.monthly.toFixed(2).replace('.', ','))
  const [students, setStudents] = useState(plan.students === null ? '' : String(plan.students))
  const [active, setActive] = useState(plan.status === 'ativo')
  const [error, setError] = useState<string>()
  const [saving, setSaving] = useState(false)
  function save() {
    const m = toNumber(monthly)
    if (monthly.trim() === '' || Number.isNaN(m) || m < 0) return setError('Digite o preço mensal, como 49,90. Use 0 para um plano grátis.')
    setSaving(true)
    setTimeout(() => {
      onSave({ ...plan, monthly: m, yearly: Math.round(m * 10 * 100) / 100, students: students.trim() === '' ? null : Math.max(1, Number(students)), status: active ? 'ativo' : plan.status === 'ativo' ? 'arquivado' : plan.status })
    }, 700)
  }
  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar plano {plan.name}</DialogTitle>
          <DialogDescription>
            {plan.subscribers > 0 ? `${plan.subscribers} ${plan.subscribers === 1 ? 'assinante mantém' : 'assinantes mantêm'} o preço atual até a próxima renovação.` : 'Este plano ainda não tem assinantes.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <TextField
            label="Preço mensal"
            prefix="R$"
            inputMode="decimal"
            value={monthly}
            onChange={(e) => {
              setMonthly(e.target.value.replace(/[^\d.,]/g, ''))
              setError(undefined)
            }}
            error={error}
            hint="O anual é calculado como 10 vezes o mensal."
          />
          <TextField label="Limite de alunos" optional inputMode="numeric" placeholder="Sem limite" value={students} onChange={(e) => setStudents(e.target.value.replace(/\D/g, ''))} hint="Deixe em branco para alunos ilimitados." />
          <Switch label="Disponível para novas assinaturas" description="Desligado, o plano some da página de preços. Quem já assina continua." checked={active} onChange={(e) => setActive(e.target.checked)} />
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button loading={saving} onClick={save}>
            {saving ? 'Salvando' : 'Salvar plano'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function Planos() {
  const [list, setList] = useState(PLANS)
  const [editing, setEditing] = useState<Plan | null>(null)
  const total = list.reduce((t, p) => t + p.subscribers, 0)
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {list.map((p) => (
          <article key={p.id} className={cn('flex flex-col rounded-xl border bg-card p-5', p.popular && 'border-primary/50', p.status !== 'ativo' && 'border-dashed')}>
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-semibold">{p.name}</h2>
              {p.status === 'ativo' ? p.popular ? <Pill tone="brand">Mais assinado</Pill> : <Pill tone="success">Ativo</Pill> : <Pill>{p.status === 'rascunho' ? 'Rascunho' : 'Arquivado'}</Pill>}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{p.tagline}</p>
            <p className="mt-4 text-2xl font-semibold tracking-tight tabular-nums">
              {price(p.monthly)}
              {p.monthly ? <span className="text-sm font-normal text-muted-foreground"> por mês</span> : null}
            </p>
            <p className="text-xs text-muted-foreground">{p.yearly ? `ou ${brl(p.yearly)} por ano` : p.monthly === 0 ? 'Sem cobrança' : 'Preço ainda não definido'}</p>
            <ul className="mt-4 grid gap-1.5 text-sm">
              {[p.students === null ? 'Alunos ilimitados' : `Até ${p.students} alunos`, p.ai, 'Treinos ilimitados por aluno'].map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <Check className="size-4 text-success" /> {f}
                </li>
              ))}
            </ul>
            <div className="mt-auto flex items-center justify-between gap-2 pt-5">
              <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <Users className="size-3.5" /> {p.subscribers} {p.subscribers === 1 ? 'assinante' : 'assinantes'}
              </span>
              <Button size="sm" variant="secondary" icon={<Pencil />} onClick={() => setEditing(p)}>
                Editar
              </Button>
            </div>
          </article>
        ))}
      </div>
      <Section title="Assinantes por plano" description={`${total} contas de personal com plano`} className="mt-6">
        <HBars format={(v) => `${v} ${v === 1 ? 'conta' : 'contas'}`} rows={list.filter((p) => p.status === 'ativo').map((p) => ({ id: p.id, label: p.name, sub: price(p.monthly), value: p.subscribers }))} />
      </Section>
      {editing && (
        <PlanDialog
          plan={editing}
          onClose={() => setEditing(null)}
          onSave={(p) => {
            setList((l) => l.map((x) => (x.id === p.id ? p : x)))
            setEditing(null)
            toast.success(`Plano ${p.name} salvo`)
          }}
        />
      )}
    </>
  )
}

const COUPON_TONE: Record<Coupon['status'], 'success' | 'warning' | 'neutral' | 'info'> = { ativo: 'success', pausado: 'warning', expirado: 'neutral', esgotado: 'neutral', agendado: 'info' }
const COUPON_LABEL: Record<Coupon['status'], string> = { ativo: 'Ativo', pausado: 'Pausado', expirado: 'Expirado', esgotado: 'Esgotado', agendado: 'Começa em 25/11' }

function CouponDialog({ open, onOpenChange, taken, onCreate }: { open: boolean; onOpenChange: (o: boolean) => void; taken: string[]; onCreate: (c: Coupon) => void }) {
  const [code, setCode] = useState('')
  const [kind, setKind] = useState<Coupon['kind']>('percentual')
  const [value, setValue] = useState('')
  const [limit, setLimit] = useState('100')
  const [errors, setErrors] = useState<{ code?: string; value?: string }>({})
  function create() {
    const next: typeof errors = {}
    const v = toNumber(value)
    if (code.length < 4) next.code = 'Use pelo menos 4 letras ou números, sem espaços.'
    else if (taken.includes(code)) next.code = 'Já existe um cupom com este código.'
    if (!v || v <= 0) next.value = 'Digite o valor do desconto.'
    else if (kind === 'percentual' && v > 100) next.value = 'O desconto em porcentagem vai até 100.'
    setErrors(next)
    if (Object.keys(next).length) return
    onCreate({ id: `c${Date.now()}`, code, kind, value: v, duration: 'Primeira cobrança', until: '31/12/2026', limit: Math.max(1, Number(limit) || 100), uses: 0, plans: ['Pro', 'Premium'], status: 'ativo' })
    setCode('')
    setValue('')
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Criar cupom</DialogTitle>
          <DialogDescription>Vale na primeira cobrança dos planos Pro e Premium, até 31/12/2026.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <TextField
            label="Código"
            placeholder="Ex.: VERAO15"
            value={code}
            onChange={(e) => {
              setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))
              setErrors((x) => ({ ...x, code: undefined }))
            }}
            error={errors.code}
            hint="É o que a pessoa digita na hora de assinar."
          />
          <div className="grid gap-1.5">
            <span id="lbl-tipo" className="text-sm font-medium">
              Tipo de desconto
            </span>
            <SegmentedControl<Coupon['kind']>
              aria-labelledby="lbl-tipo"
              fullWidth
              value={kind}
              onChange={setKind}
              options={[
                { value: 'percentual', label: 'Porcentagem' },
                { value: 'fixo', label: 'Valor em reais' },
              ]}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              label="Desconto"
              prefix={kind === 'fixo' ? 'R$' : undefined}
              suffix={kind === 'percentual' ? '%' : undefined}
              inputMode="decimal"
              value={value}
              onChange={(e) => {
                setValue(e.target.value.replace(/[^\d.,]/g, ''))
                setErrors((x) => ({ ...x, value: undefined }))
              }}
              error={errors.value}
            />
            <TextField label="Limite de usos" inputMode="numeric" value={limit} onChange={(e) => setLimit(e.target.value.replace(/\D/g, ''))} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={create}>Criar cupom</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function Cupons({ creating, setCreating }: { creating: boolean; setCreating: (o: boolean) => void }) {
  const [list, setList] = useState(COUPONS)
  const [show, setShow] = useState('todos')
  const rows = list.filter((c) => show === 'todos' || (show === 'ativos' ? c.status === 'ativo' || c.status === 'agendado' : c.status !== 'ativo' && c.status !== 'agendado'))
  const setStatus = (c: Coupon, status: Coupon['status']) => setList((l) => l.map((x) => (x.id === c.id ? { ...x, status } : x)))
  const toggle = (c: Coupon) => {
    const next = c.status === 'pausado' ? 'ativo' : 'pausado'
    setStatus(c, next)
    toast.success(next === 'pausado' ? `${c.code} pausado` : `${c.code} reativado`, { description: next === 'pausado' ? 'Ninguém consegue usar até você reativar.' : undefined, action: { label: 'Desfazer', onClick: () => setStatus(c, c.status) } })
  }
  const copy = (c: Coupon) => {
    navigator.clipboard?.writeText(c.code).catch(() => {})
    toast.success(`Código ${c.code} copiado`)
  }
  const Actions = ({ c }: { c: Coupon }) => (
    <span className="flex justify-end gap-2">
      <Button size="sm" variant="ghost" icon={<Copy />} onClick={() => copy(c)}>
        Copiar
      </Button>
      {(c.status === 'ativo' || c.status === 'pausado') && (
        <Button size="sm" variant="secondary" icon={c.status === 'pausado' ? <Play /> : <Pause />} onClick={() => toggle(c)}>
          {c.status === 'pausado' ? 'Reativar' : 'Pausar'}
        </Button>
      )}
    </span>
  )
  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <SegmentedControl
          aria-label="Situação dos cupons"
          size="sm"
          value={show}
          onChange={setShow}
          options={[
            { value: 'todos', label: 'Todos', count: list.length },
            { value: 'ativos', label: 'Em uso' },
            { value: 'parados', label: 'Parados' },
          ]}
        />
        <p className="text-sm text-muted-foreground">{list.reduce((t, c) => t + c.uses, 0)} usos no total</p>
      </div>
      <div className="hidden overflow-hidden rounded-xl border bg-card md:block">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="pl-5">Cupom</TableHead>
              <TableHead className="w-44">Usos</TableHead>
              <TableHead>Validade</TableHead>
              <TableHead>Situação</TableHead>
              <TableHead className="pr-5" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="pl-5">
                  <p className="font-mono text-sm font-medium">{c.code}</p>
                  <p className="text-xs text-muted-foreground">
                    {discountLabel(c)} · {c.plans.join(' e ')}
                  </p>
                </TableCell>
                <TableCell>
                  <Progress value={(c.uses / c.limit) * 100} className="h-2" aria-label={`${c.uses} de ${c.limit} usos`} />
                  <p className="mt-1 text-xs text-muted-foreground tabular-nums">
                    {c.uses} de {c.limit}
                  </p>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">até {c.until}</TableCell>
                <TableCell>
                  <Pill tone={COUPON_TONE[c.status]}>{COUPON_LABEL[c.status]}</Pill>
                </TableCell>
                <TableCell className="pr-5">
                  <Actions c={c} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <ul className="grid gap-2 md:hidden">
        {rows.map((c) => (
          <li key={c.id} className="rounded-xl border bg-card p-3.5">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="font-mono text-sm font-medium">{c.code}</p>
                <p className="text-xs text-muted-foreground">
                  {discountLabel(c)} · {c.plans.join(' e ')}
                </p>
              </div>
              <Pill tone={COUPON_TONE[c.status]}>{COUPON_LABEL[c.status]}</Pill>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {c.uses} de {c.limit} usos · até {c.until}
            </p>
            <div className="mt-3">
              <Actions c={c} />
            </div>
          </li>
        ))}
      </ul>
      {rows.length === 0 && <p className="rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">Nenhum cupom nesta situação.</p>}
      <CouponDialog
        open={creating}
        onOpenChange={setCreating}
        taken={list.map((c) => c.code)}
        onCreate={(c) => {
          setList((l) => [c, ...l])
          setCreating(false)
          toast.success(`Cupom ${c.code} criado`, { description: discountLabel(c) })
        }}
      />
    </>
  )
}

export function PlanosCupons() {
  const [tab, setTab] = useTab<Tab>(TABS)
  const [creating, setCreating] = useState(false)
  return (
    <>
      <PageHeader
        title="Planos e cupons"
        description="O que os personais assinam e os descontos em circulação."
        actions={
          <Button
            icon={<Plus />}
            onClick={() => {
              setTab('cupons')
              setCreating(true)
            }}
          >
            Criar cupom
          </Button>
        }
      />
      <SegmentedControl<Tab>
        variant="underline"
        kind="tabs"
        aria-label="Seções de planos e cupons"
        value={tab}
        onChange={setTab}
        className="mb-6"
        options={[
          { value: 'planos', label: 'Planos', controls: 'painel-planos' },
          { value: 'cupons', label: 'Cupons', count: COUPONS.filter((c) => c.status === 'ativo').length, controls: 'painel-planos' },
        ]}
      />
      <div id="painel-planos" role="tabpanel">
        {tab === 'planos' ? <Planos /> : <Cupons creating={creating} setCreating={setCreating} />}
      </div>
    </>
  )
}
