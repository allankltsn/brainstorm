import { ArrowLeft, Lock, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/affect/button'
import { PageHeader, Pill } from '@/components/page'
import { accessProfiles } from '@/lib/extras'

export function Perfis() {
  return (
    <div className="mx-auto max-w-3xl">
      <Link to="/usuarios" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Usuários
      </Link>
      <PageHeader
        title="Perfis de acesso"
        description="Cada usuário tem um perfil, que define o que ele pode fazer."
        actions={
          <Link to="/usuarios/permissoes">
            <Button variant="secondary">Ver permissões</Button>
          </Link>
        }
      />
      <ul className="grid gap-3 sm:grid-cols-2">
        {accessProfiles.map((p) => (
          <li key={p.id} className="flex flex-col rounded-xl border bg-card p-5">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-sm font-semibold">{p.name}</h2>
              {p.fixed ? <Pill icon={<Lock />}>Padrão</Pill> : <Pill tone="info">Personalizado</Pill>}
            </div>
            <p className="mt-2 flex-1 text-sm text-muted-foreground">{p.text}</p>
            <div className="mt-4 flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                <Users className="size-4" /> {p.people} {p.people === 1 ? 'pessoa' : 'pessoas'}
              </span>
              {!p.fixed && (
                <Button size="sm" variant="ghost" onClick={() => toast.success(`Perfil ${p.name} removido`)}>
                  Remover
                </Button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
