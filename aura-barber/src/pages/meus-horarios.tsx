import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, X } from 'lucide-react'
import { PageHeader, Panel } from '@/components/layout'
import { Button } from '@/components/affect/button'
import { useRole } from '@/lib/role'
import { db } from '@/lib/data'
import { proximosDoCliente, historicoDoCliente } from '@/lib/metrics'

function agoraISO() {
  const d = new Date()
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}:00`
}
const hm = (iso: string) => iso.slice(11, 16)
const diaBR = (iso: string) => `${iso.slice(8, 10)}/${iso.slice(5, 7)}`
const STATUS_LABEL: Record<string, string> = { marcado: 'marcado', concluido: 'concluído', cancelado: 'cancelado' }

export function MeusHorarios() {
  const { clienteId } = useRole()
  const nav = useNavigate()
  const [, setTick] = useState(0)
  const agora = agoraISO()
  const proximos = proximosDoCliente(clienteId, db.agendamentos, agora)
  const historico = historicoDoCliente(clienteId, db.agendamentos, agora)

  const cancelar = (id: string) => {
    db.cancelarAgendamento(id)
    setTick((t) => t + 1)
  }

  return (
    <div className="mx-auto max-w-xl">
      <PageHeader
        title="Meus horários"
        subtitle="Seus agendamentos."
        action={
          <Button icon={<Plus size={16} />} onClick={() => nav('/agendar')}>
            Agendar
          </Button>
        }
      />

      <p className="mb-2 text-sm font-medium text-foreground">Próximos</p>
      <Panel className="divide-y">
        {proximos.length === 0 && (
          <p className="px-4 py-6 text-center text-sm text-muted-foreground">Nenhum horário marcado.</p>
        )}
        {proximos.map((a) => (
          <div key={a.id} className="flex items-center gap-3 px-4 py-3 text-sm">
            <div className="flex-1">
              <p className="font-medium text-foreground">{db.servicoById(a.servicoId)?.nome}</p>
              <p className="text-muted-foreground">
                {diaBR(a.inicio)} às {hm(a.inicio)} · {db.profissionalById(a.profissionalId)?.nome}
              </p>
            </div>
            <Button variant="secondary" size="sm" icon={<X size={15} />} onClick={() => cancelar(a.id)}>
              Cancelar
            </Button>
          </div>
        ))}
      </Panel>

      {historico.length > 0 && (
        <>
          <p className="mb-2 mt-6 text-sm font-medium text-foreground">Histórico</p>
          <Panel className="divide-y opacity-80">
            {historico.map((a) => (
              <div key={a.id} className="flex items-center justify-between px-4 py-3 text-sm">
                <div>
                  <p className="font-medium text-foreground">{db.servicoById(a.servicoId)?.nome}</p>
                  <p className="text-muted-foreground">
                    {diaBR(a.inicio)} às {hm(a.inicio)} · {db.profissionalById(a.profissionalId)?.nome}
                  </p>
                </div>
                <span className="text-xs capitalize text-muted-foreground">{STATUS_LABEL[a.status] ?? a.status}</span>
              </div>
            ))}
          </Panel>
        </>
      )}
    </div>
  )
}
