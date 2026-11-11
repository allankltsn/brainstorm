import { BellRing, Check, Plus, Receipt } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/affect/button'
import { NumberTicker } from '@/components/affect/number-ticker'
import { SegmentedControl } from '@/components/affect/segmented-control'
import { Select } from '@/components/affect/select'
import { TextField } from '@/components/affect/text-field'
import { PageHeader, Person, Pill } from '@/components/page'
import { EmptyState, ErrorState, ListSkeleton } from '@/components/states'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { activeStudents, brl, firstName } from '@/lib/data'
import { CHARGE_METHODS, charges as seed, type Charge, type ChargeMethod, type ChargeStatus } from '@/lib/finance'
import { dateShort } from '@/lib/format'
import { useLoad } from '@/lib/use-load'

type Filter = 'abertas' | 'atrasadas' | 'pagas' | 'todas'

const STATUS: Record<ChargeStatus, { label: string; tone: 'success' | 'warning' | 'danger' }> = {
  pago: { label: 'Pago', tone: 'success' },
  pendente: { label: 'A vencer', tone: 'warning' },
  atrasado: { label: 'Atrasado', tone: 'danger' },
}

const MATCH: Record<Filter, (c: Charge) => boolean> = {
  abertas: (c) => c.status !== 'pago',
  atrasadas: (c) => c.status === 'atrasado',
  pagas: (c) => c.status === 'pago',
  todas: () => true,
}

const sum = (l: Charge[]) => l.reduce((a, c) => a + c.amount, 0)
const money = { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 } as const

function StatusPill({ c }: { c: Charge }) {
  return <Pill tone={STATUS[c.status].tone}>{STATUS[c.status].label}</Pill>
}

function when(c: Charge) {
  return c.status === 'pago' && c.paidOn ? `Pago em ${dateShort(c.paidOn)}` : `Vence em ${dateShort(c.due)}`
}

export function Cobrancas() {
  const { state, empty, retry } = useLoad()
  const [items, setItems] = useState<Charge[]>(seed)
  const [filter, setFilter] = useState<Filter>('abertas')
  const [creating, setCreating] = useState(false)
  const [sid, setSid] = useState<string | null>(null)
  const [amount, setAmount] = useState('')
  const [due, setDue] = useState('')
  const [method, setMethod] = useState<ChargeMethod>('Pix')
  const [errors, setErrors] = useState<{ sid?: string; amount?: string; due?: string }>({})
  const [saving, setSaving] = useState(false)

  const all = empty ? [] : items
  const list = all.filter(MATCH[filter])
  const paid = all.filter(MATCH.pagas)
  const late = all.filter(MATCH.atrasadas)
  const open = all.filter((c) => c.status === 'pendente')

  const remind = (c: Charge) => toast.success(`Lembrete enviado para ${firstName(c.name)}`, { description: `${c.label}, ${brl(c.amount)}.` })
  const markPaid = (c: Charge) => {
    setItems((l) => l.map((x) => (x.id === c.id ? { ...x, status: 'pago', paidOn: '2026-10-16' } : x)))
    toast.success(`Pagamento de ${firstName(c.name)} registrado`, { action: { label: 'Desfazer', onClick: () => setItems((l) => l.map((x) => (x.id === c.id ? c : x))) } })
  }

  function create(e: React.FormEvent) {
    e.preventDefault()
    const value = Number(amount.replace(/\./g, '').replace(',', '.'))
    const next = {
      sid: sid ? undefined : 'Escolha o aluno.',
      amount: Number.isFinite(value) && value > 0 ? undefined : 'Informe um valor maior que zero, como 250,00.',
      due: due ? undefined : 'Escolha a data de vencimento.',
    }
    setErrors(next)
    const student = activeStudents().find((s) => s.id === sid)
    if (next.sid || next.amount || next.due || !student) return
    setSaving(true)
    setTimeout(() => {
      setItems((l) => [{ id: `n${l.length}`, sid: student.id, name: student.name, label: 'Cobrança avulsa', amount: value, due, status: 'pendente', method }, ...l])
      setSaving(false)
      setCreating(false)
      setSid(null)
      setAmount('')
      setDue('')
      setFilter('abertas')
      toast.success(`Cobrança enviada para ${firstName(student.name)}`)
    }, 800)
  }

  const actions = (c: Charge) =>
    c.status !== 'pago' && (
      <>
        <Button size="sm" variant="ghost" icon={<Check />} onClick={() => markPaid(c)}>
          Marcar como pago
        </Button>
        <Button size="sm" variant="secondary" icon={<BellRing />} onClick={() => remind(c)}>
          Lembrar
        </Button>
      </>
    )

  return (
    <>
      <PageHeader
        title="Cobranças"
        description="As mensalidades que você cobra dos seus alunos. O aura-fit não fica com nenhuma parte."
        actions={
          <Button icon={<Plus />} onClick={() => setCreating(true)}>
            Nova cobrança
          </Button>
        }
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-3 sm:gap-4">
        {(
          [
            ['Recebido em outubro', sum(paid), `${paid.length} pagamentos`],
            ['A vencer', sum(open), `${open.length} cobranças`],
            ['Atrasado', sum(late), late.length ? `${late.length} alunos para lembrar` : 'Ninguém em atraso'],
          ] as const
        ).map(([label, value, foot]) => (
          <div key={label} className="min-w-0 rounded-xl border bg-card p-4 sm:p-5">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight tabular-nums sm:text-3xl">
              <NumberTicker value={value} locale="pt-BR" format={money} />
            </p>
            <p className="mt-3 text-xs text-muted-foreground">{foot}</p>
          </div>
        ))}
      </div>

      <SegmentedControl<Filter>
        aria-label="Filtrar cobranças"
        value={filter}
        onChange={setFilter}
        className="mb-4"
        options={[
          { value: 'abertas', label: 'Em aberto', count: open.length + late.length },
          { value: 'atrasadas', label: 'Atrasadas', count: late.length },
          { value: 'pagas', label: 'Pagas', count: paid.length },
          { value: 'todas', label: 'Todas' },
        ]}
      />

      {state === 'carregando' && <ListSkeleton label="Carregando as cobranças" />}
      {state === 'erro' && <ErrorState what="as cobranças" onRetry={retry} />}
      {state === 'pronto' && list.length === 0 && (
        <EmptyState
          icon={<Receipt />}
          title={all.length === 0 ? 'Nenhuma cobrança ainda' : 'Nenhuma cobrança neste filtro'}
          text={all.length === 0 ? 'Crie a primeira cobrança e o aluno recebe o aviso com o código Pix.' : 'Tudo certo por aqui. Veja as outras abas para conferir o restante.'}
          action={all.length === 0 ? <Button onClick={() => setCreating(true)}>Nova cobrança</Button> : undefined}
        />
      )}
      {state === 'pronto' && list.length > 0 && (
        <>
          <div className="hidden overflow-hidden rounded-xl border bg-card md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-5">Aluno</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Forma</TableHead>
                  <TableHead>Situação</TableHead>
                  <TableHead className="pr-5 text-right">
                    <span className="sr-only">Ações</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {list.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="pl-5">
                      <Person name={c.name} sub={c.label} size="sm" />
                    </TableCell>
                    <TableCell className="font-medium tabular-nums">{brl(c.amount)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{when(c)}</TableCell>
                    <TableCell className="text-sm">{c.method}</TableCell>
                    <TableCell>
                      <StatusPill c={c} />
                    </TableCell>
                    <TableCell className="pr-5">
                      <div className="flex justify-end gap-1">{actions(c)}</div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Celular: cartões no lugar da tabela, sem rolagem lateral. */}
          <ul className="grid gap-2 md:hidden">
            {list.map((c) => (
              <li key={c.id} className="rounded-xl border bg-card p-4">
                <div className="flex items-start justify-between gap-3">
                  <Person name={c.name} sub={c.label} size="sm" />
                  <StatusPill c={c} />
                </div>
                <p className="mt-3 flex items-baseline justify-between gap-3 text-sm">
                  <span className="font-semibold tabular-nums">{brl(c.amount)}</span>
                  <span className="text-xs text-muted-foreground">
                    {when(c)} · {c.method}
                  </span>
                </p>
                {c.status !== 'pago' && <div className="mt-3 flex flex-wrap justify-end gap-1">{actions(c)}</div>}
              </li>
            ))}
          </ul>
        </>
      )}

      <Dialog open={creating} onOpenChange={setCreating}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Nova cobrança</DialogTitle>
            <DialogDescription>O aluno recebe um aviso com o valor e a forma de pagar.</DialogDescription>
          </DialogHeader>
          <form className="grid gap-5" onSubmit={create} noValidate>
            <Select
              label="Aluno"
              placeholder="Escolha o aluno"
              value={sid}
              onChange={(v) => setSid(v)}
              error={errors.sid}
              options={activeStudents().map((s) => ({ value: s.id, label: s.name, description: s.plan ?? 'Sem treino' }))}
            />
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField label="Valor" prefix="R$" inputMode="decimal" placeholder="250,00" value={amount} onChange={(e) => setAmount(e.target.value)} error={errors.amount} autoComplete="off" />
              <TextField label="Vencimento" type="date" min="2026-10-16" value={due} onChange={(e) => setDue(e.target.value)} error={errors.due} />
            </div>
            <div className="grid gap-1.5">
              <span id="forma-pagamento" className="text-sm font-medium">
                Forma de pagamento
              </span>
              <SegmentedControl<ChargeMethod> aria-labelledby="forma-pagamento" fullWidth value={method} onChange={setMethod} options={CHARGE_METHODS.map((m) => ({ value: m, label: m }))} />
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setCreating(false)}>
                Agora não
              </Button>
              <Button type="submit" loading={saving}>
                {saving ? 'Enviando' : 'Enviar cobrança'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
