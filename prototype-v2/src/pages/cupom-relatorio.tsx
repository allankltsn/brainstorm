import { ArrowLeft } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { PageHeader, Person, Pill } from '@/components/page'
import { Progress } from '@/components/ui/progress'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { coupons } from '@/lib/billing'
import { brl } from '@/lib/data'
import { couponUses } from '@/lib/tracking'
import { NaoEncontrada } from '@/pages/nao-encontrada'

export function CupomRelatorio() {
  const { code } = useParams()
  const c = coupons.find((x) => x.code === code)
  if (!c) return <NaoEncontrada />
  /* Fictício: a lista de usos é a mesma para todo cupom, cortada no total de usos. */
  const uses = couponUses.slice(0, c.uses)
  return (
    <div className="mx-auto max-w-3xl">
      <Link to="/planos?aba=cupons" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Cupons
      </Link>
      <PageHeader title={<span className="font-mono">{c.code}</span>} description={`${c.label} · vale para ${c.plan === 'Todos' ? 'todos os planos' : `o plano ${c.plan}`} · até ${c.ends}`} actions={<Pill tone={c.active ? 'success' : 'neutral'}>{c.active ? 'Ativo' : 'Encerrado'}</Pill>} />
      <div className="mb-6 rounded-xl border bg-card p-5">
        <div className="mb-1.5 flex justify-between text-sm">
          <span>Usos</span>
          <span className="text-muted-foreground tabular-nums">
            {c.uses} de {c.limit}
          </span>
        </div>
        <Progress value={(c.uses / c.limit) * 100} className="h-2" aria-label={`${c.uses} de ${c.limit} usos`} />
      </div>
      <h2 className="mb-3 text-sm font-semibold">Usos mais recentes</h2>
      <div className="overflow-hidden rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="pl-5">Quem usou</TableHead>
              <TableHead className="hidden sm:table-cell">Plano</TableHead>
              <TableHead>Quando</TableHead>
              <TableHead className="pr-5 text-right">Desconto</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {uses.map((u) => (
              <TableRow key={u.who}>
                <TableCell className="py-3 pl-5"><Person name={u.who} size="sm" /></TableCell>
                <TableCell className="hidden text-sm sm:table-cell">{u.plan}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{u.when}</TableCell>
                <TableCell className="pr-5 text-right text-sm tabular-nums">{brl(u.saved)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
