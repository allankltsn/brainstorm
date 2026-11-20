import { useState } from 'react'
import { UserPlus, X } from 'lucide-react'
import { PageHeader, Panel } from '@/components/layout'
import { Button } from '@/components/affect/button'
import { listMemberships, createInvite, setMembershipStatus } from '@/lib/api'

export function Clientes() {
  const [, setTick] = useState(0)
  const [codigo, setCodigo] = useState<string | null>(null)
  const lista = listMemberships('cliente')
  const refresh = () => setTick((t) => t + 1)

  const convidar = () => setCodigo(createInvite('cliente').codigo)
  const alternar = (id: string, atual: 'ACTIVE' | 'SUSPENDED') => {
    setMembershipStatus(id, atual === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE')
    refresh()
  }

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        title="Clientes"
        subtitle="Quem está vinculado à barbearia."
        action={
          <Button icon={<UserPlus size={16} />} onClick={convidar}>
            Convidar cliente
          </Button>
        }
      />

      {codigo && (
        <Panel className="mb-4 flex items-center gap-3 p-4">
          <div className="flex-1 text-sm">
            <p className="font-medium text-foreground">Convite criado</p>
            <p className="text-muted-foreground">
              Código: <span className="font-mono text-foreground">{codigo}</span> — envie ao cliente (protótipo: sem e-mail).
            </p>
          </div>
          <Button variant="ghost" size="sm" icon={<X size={15} />} onClick={() => setCodigo(null)} />
        </Panel>
      )}

      <Panel className="divide-y">
        {lista.length === 0 && <p className="px-4 py-8 text-center text-sm text-muted-foreground">Nenhum cliente ainda.</p>}
        {lista.map((m) => (
          <div key={m.id} className="flex items-center gap-3 px-4 py-3 text-sm">
            <div className="flex-1">
              <p className="font-medium text-foreground">{m.user.name}</p>
              <p className="text-muted-foreground">{m.user.phone ?? m.user.email}</p>
            </div>
            <span
              className={`rounded-full px-2 py-0.5 text-xs ${
                m.status === 'ACTIVE' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
              }`}
            >
              {m.status === 'ACTIVE' ? 'ativo' : 'suspenso'}
            </span>
            <Button variant="secondary" size="sm" onClick={() => alternar(m.id, m.status)}>
              {m.status === 'ACTIVE' ? 'Suspender' : 'Reativar'}
            </Button>
          </div>
        ))}
      </Panel>
    </div>
  )
}
