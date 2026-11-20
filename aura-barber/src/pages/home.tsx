import { useNavigate } from 'react-router-dom'
import { PageHeader, Panel, brl } from '@/components/layout'
import { Button } from '@/components/affect/button'
import { useRole } from '@/lib/role'
import { db } from '@/lib/data'

function hojeISO() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
const hm = (iso: string) => iso.slice(11, 16)

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <Panel className="p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-foreground">{value}</p>
    </Panel>
  )
}

export function Home() {
  const { role } = useRole()
  const nav = useNavigate()
  const hoje = hojeISO()
  const doDia = db.agendamentos.filter((a) => a.inicio.slice(0, 10) === hoje && a.status !== 'cancelado')
  const faturamento = doDia.reduce((s, a) => s + (db.servicoById(a.servicoId)?.precoBRL ?? 0), 0)

  if (role === 'dono') {
    return (
      <div className="mx-auto max-w-4xl">
        <PageHeader title="Início" subtitle="Visão da barbearia hoje." />
        <div className="grid gap-4 sm:grid-cols-3">
          <Stat label="Agendamentos hoje" value={String(doDia.length)} />
          <Stat label="Faturamento previsto" value={brl(faturamento)} />
          <Stat label="Profissionais" value={String(db.profissionais.length)} />
        </div>
        <div className="mt-4 flex gap-2">
          <Button onClick={() => nav('/agenda')}>Ver agenda</Button>
          <Button variant="secondary" onClick={() => nav('/agendar')}>
            Novo agendamento
          </Button>
        </div>
      </div>
    )
  }

  if (role === 'barbeiro') {
    return (
      <div className="mx-auto max-w-2xl">
        <PageHeader title="Início" subtitle="Sua agenda de hoje." />
        <Panel className="divide-y">
          {doDia.length === 0 && <p className="px-4 py-8 text-center text-sm text-muted-foreground">Nada marcado hoje.</p>}
          {doDia.map((a) => (
            <div key={a.id} className="flex items-center justify-between px-4 py-3 text-sm">
              <span className="font-medium">{hm(a.inicio)}</span>
              <span>{db.servicoById(a.servicoId)?.nome}</span>
              <span className="text-muted-foreground">{db.clienteById(a.clienteId)?.nome}</span>
            </div>
          ))}
        </Panel>
      </div>
    )
  }

  // cliente
  const proximo = doDia[0]
  return (
    <div className="mx-auto max-w-xl">
      <PageHeader title="Início" subtitle="Seu próximo horário." />
      <Panel className="p-5">
        {proximo ? (
          <p className="text-sm">
            <span className="font-medium">{db.servicoById(proximo.servicoId)?.nome}</span> às {hm(proximo.inicio)} com{' '}
            {db.profissionalById(proximo.profissionalId)?.nome}.
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">Você não tem horários marcados.</p>
        )}
        <Button className="mt-4" onClick={() => nav('/agendar')}>
          Agendar um horário
        </Button>
      </Panel>
    </div>
  )
}
