import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import { Building2, ChevronRight, UserCog } from 'lucide-react'
import { PageHeader, Panel } from '@/components/layout'
import { useRole } from '@/lib/role'

function ConfigCard({ icon, titulo, desc, to }: { icon: ReactNode; titulo: string; desc: string; to: string }) {
  return (
    <NavLink
      to={to}
      className="flex w-full items-center gap-3 rounded-xl border bg-card p-4 text-left transition hover:bg-muted"
    >
      <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">{icon}</span>
      <span className="flex-1">
        <span className="block font-medium text-foreground">{titulo}</span>
        <span className="block text-sm text-muted-foreground">{desc}</span>
      </span>
      <ChevronRight size={18} className="text-muted-foreground" />
    </NavLink>
  )
}

export function Config() {
  const { role } = useRole()
  return (
    <div className="mx-auto max-w-xl">
      <PageHeader title="Configurações" subtitle="Sua conta e o negócio." />
      <div className="space-y-3">
        <ConfigCard icon={<UserCog size={20} />} titulo="Meu usuário" desc="Perfil e preferências" to="/meu-usuario" />
        {role === 'dono' && (
          <ConfigCard icon={<Building2 size={20} />} titulo="Empresa" desc="Dados do negócio, horário e grade" to="/empresa" />
        )}
      </div>
      {role !== 'dono' && (
        <Panel className="mt-4 p-4">
          <p className="text-sm text-muted-foreground">Configurações do negócio são geridas pelo dono.</p>
        </Panel>
      )}
    </div>
  )
}
