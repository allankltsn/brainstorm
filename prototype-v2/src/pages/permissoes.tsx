import { ArrowLeft, Check, Minus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageHeader } from '@/components/page'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { permissions } from '@/lib/tracking'

const Cell = ({ ok }: { ok: boolean }) =>
  ok ? (
    <span className="inline-flex items-center gap-1 text-success">
      <Check className="size-4" /> <span className="sr-only sm:not-sr-only">Pode</span>
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-muted-foreground">
      <Minus className="size-4" /> <span className="sr-only sm:not-sr-only">Não pode</span>
    </span>
  )

export function Permissoes() {
  return (
    <div className="mx-auto max-w-3xl">
      <Link to="/usuarios" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Usuários
      </Link>
      <PageHeader title="Permissões por perfil" description="O que cada perfil pode fazer. Hoje é fixo, só para consulta." />
      <div className="overflow-hidden rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="pl-5">Ação</TableHead>
              <TableHead>Personal</TableHead>
              <TableHead>Aluno</TableHead>
              <TableHead className="pr-5">Admin</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {permissions.map((p) => (
              <TableRow key={p.action}>
                <TableCell className="py-3 pl-5 text-sm font-medium whitespace-normal">{p.action}</TableCell>
                <TableCell className="text-sm"><Cell ok={p.personal} /></TableCell>
                <TableCell className="text-sm"><Cell ok={p.aluno} /></TableCell>
                <TableCell className="pr-5 text-sm"><Cell ok={p.admin} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
