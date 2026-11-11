import { Plus, Users } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/affect/button'
import { SegmentedControl } from '@/components/affect/segmented-control'
import { Switch } from '@/components/affect/switch'
import { TextField } from '@/components/affect/text-field'
import { PageHeader, Pill } from '@/components/page'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { coupons as seedCoupons, plans as seedPlans, type Plan } from '@/lib/billing'
import { brl } from '@/lib/data'
import { useTab } from '@/lib/use-tab'

const TABS = ['planos', 'cupons'] as const
type Tab = (typeof TABS)[number]
const NEW_PLAN: Plan = { id: 'novo', name: '', monthly: 0, students: null, perks: [], status: 'rascunho', subscribers: 0 }
const TONE = { publicado: 'success', rascunho: 'neutral', arquivado: 'warning' } as const

export function AdminPlanos() {
  const navigate = useNavigate()
  const [tab, setTab] = useTab<Tab>(TABS)
  const plans = seedPlans
  const [coupons, setCoupons] = useState(seedCoupons)
  const [editing, setEditing] = useState<Plan>()
  return (
    <>
      <PageHeader
        title="Planos e cupons"
        description="O que os personais podem contratar e com quais descontos."
        actions={<Button icon={<Plus />} onClick={() => (tab === 'planos' ? setEditing(NEW_PLAN) : navigate('/planos/cupons/novo'))}>{tab === 'planos' ? 'Novo plano' : 'Novo cupom'}</Button>}
      />
      <SegmentedControl<Tab>
        variant="underline"
        kind="tabs"
        aria-label="Planos e cupons"
        value={tab}
        onChange={setTab}
        className="mb-6"
        options={[
          { value: 'planos', label: 'Planos', controls: 'painel-planos' },
          { value: 'cupons', label: 'Cupons', controls: 'painel-planos' },
        ]}
      />
      <div id="painel-planos" role="tabpanel" className="overflow-hidden rounded-xl border bg-card">
        {tab === 'planos' ? (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-5">Plano</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead className="hidden sm:table-cell">Alunos</TableHead>
                <TableHead className="hidden sm:table-cell">Assinantes</TableHead>
                <TableHead>Situação</TableHead>
                <TableHead className="pr-5"><span className="sr-only">Ações</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plans.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="py-3 pl-5 text-sm font-medium">{p.name}</TableCell>
                  <TableCell className="text-sm tabular-nums">{p.monthly ? `${brl(p.monthly)}/mês` : 'Grátis'}</TableCell>
                  <TableCell className="hidden text-sm sm:table-cell">{p.students ?? 'Ilimitados'}</TableCell>
                  <TableCell className="hidden text-sm text-muted-foreground sm:table-cell"><span className="inline-flex items-center gap-1"><Users className="size-3.5" />{p.subscribers}</span></TableCell>
                  <TableCell><Pill tone={TONE[p.status]}>{p.status[0].toUpperCase() + p.status.slice(1)}</Pill></TableCell>
                  <TableCell className="pr-5 text-right"><Button size="sm" variant="secondary" onClick={() => setEditing(p)}>Editar</Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-5">Cupom</TableHead>
                <TableHead className="hidden sm:table-cell">Vale para</TableHead>
                <TableHead>Usos</TableHead>
                <TableHead className="hidden md:table-cell">Validade</TableHead>
                <TableHead>Ativo</TableHead>
                <TableHead className="pr-5"><span className="sr-only">Ações</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {coupons.map((c) => (
                <TableRow key={c.code}>
                  <TableCell className="py-3 pl-5"><Link to={`/planos/cupons/${c.code}`} className="block font-mono text-sm font-medium underline-offset-4 hover:underline">{c.code}</Link><span className="text-xs text-muted-foreground">{c.label}</span></TableCell>
                  <TableCell className="hidden text-sm sm:table-cell">{c.plan}</TableCell>
                  <TableCell className="text-sm tabular-nums">{c.uses}/{c.limit}</TableCell>
                  <TableCell className="hidden text-sm text-muted-foreground md:table-cell">{c.ends}</TableCell>
                  <TableCell>
                    <Switch
                      aria-label={`Cupom ${c.code} ativo`}
                      checked={c.active}
                      onChange={(e) => setCoupons((l) => l.map((x) => (x.code === c.code ? { ...x, active: e.target.checked } : x)))}
                    />
                  </TableCell>
                  <TableCell className="pr-5 text-right"><Button size="sm" variant="secondary" aria-label={`Editar cupom ${c.code}`} onClick={() => navigate(`/planos/cupons/${c.code}/editar`)}>Editar</Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(undefined)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing?.id === 'novo' ? 'Novo plano' : `Editar plano ${editing?.name}`}</DialogTitle>
            <DialogDescription>
              {editing?.subscribers ? `${editing.subscribers} assinantes usam este plano. Mudanças de preço valem só para novas cobranças.` : 'Nenhum assinante ainda.'}
            </DialogDescription>
          </DialogHeader>
          {editing && (
            <form id="form-plano" className="grid gap-4" onSubmit={(e) => {
              e.preventDefault()
              toast.success('Plano salvo')
              setEditing(undefined)
            }}>
              <TextField label="Nome" defaultValue={editing.name} />
              <TextField label="Preço mensal" inputMode="decimal" defaultValue={String(editing.monthly).replace('.', ',')} prefix="R$" />
              <Switch label="Publicado" description="Aparece para os personais na tela de planos." defaultChecked={editing.status === 'publicado'} />
            </form>
          )}
          <DialogFooter>
            <Button variant="secondary" onClick={() => setEditing(undefined)}>Cancelar</Button>
            <Button type="submit" form="form-plano">Salvar plano</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
