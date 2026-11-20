import { useNavigate } from 'react-router-dom'
import { PageHeader, Panel, brl } from '@/components/layout'
import { Button } from '@/components/affect/button'
import { useRole } from '@/lib/role'
import { db } from '@/lib/data'
import { resolverId, PROF_PADRAO } from '@/lib/identidade'
import {
  faturamentoDoDia,
  comissaoDoDia,
  agendaDoProfissional,
  ocupacaoPorProfissional,
  proximosDoCliente,
  historicoDoCliente,
} from '@/lib/metrics'

function hojeISO() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
function agoraISO() {
  const d = new Date()
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}:00`
}
const hm = (iso: string) => iso.slice(11, 16)
const diaBR = (iso: string) => `${iso.slice(8, 10)}/${iso.slice(5, 7)}`
const STATUS_LABEL: Record<string, string> = { marcado: 'marcado', concluido: 'concluído', cancelado: 'cancelado' }

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <Panel className="p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-foreground">{value}</p>
    </Panel>
  )
}

export function Home() {
  const { role, profId, clienteId } = useRole()
  const nav = useNavigate()
  const hoje = hojeISO()
  const ags = db.agendamentos

  if (role === 'dono') {
    const doDia = ags.filter((a) => a.inicio.slice(0, 10) === hoje && a.status !== 'cancelado')
    const ocupacao = ocupacaoPorProfissional(hoje, ags, db.profissionais)
    return (
      <div className="mx-auto max-w-4xl">
        <PageHeader title="Início" subtitle="Visão da barbearia hoje." />
        <div className="grid gap-4 sm:grid-cols-3">
          <Stat label="Agendamentos hoje" value={String(doDia.length)} />
          <Stat label="Faturamento previsto" value={brl(faturamentoDoDia(ags, hoje))} />
          <Stat label="Profissionais" value={String(db.profissionais.length)} />
        </div>
        <Panel className="mt-4 p-4">
          <p className="mb-3 text-sm font-medium text-foreground">Ocupação de hoje</p>
          <div className="space-y-3">
            {ocupacao.map((o) => (
              <div key={o.profissionalId}>
                <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                  <span className="text-foreground">{o.nome}</span>
                  <span>{o.janelaMin === 0 ? 'folga' : `${o.pct}%`}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${o.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Panel>
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
    const idEu = resolverId(
      profId,
      db.profissionais.map((p) => p.id),
      PROF_PADRAO,
    )
    const eu = db.profissionalById(idEu)
    const minhaAgenda = agendaDoProfissional(idEu, ags, hoje)
    const meusServicos = (eu?.servicos ?? []).map((id) => db.servicoById(id)?.nome).filter(Boolean)
    return (
      <div className="mx-auto max-w-2xl">
        <PageHeader title={`Olá, ${eu?.nome ?? ''}`} subtitle="Sua agenda de hoje." />
        <div className="mb-4 grid gap-4 sm:grid-cols-2">
          <Stat label="Atendimentos hoje" value={String(minhaAgenda.length)} />
          <Stat label="Comissão estimada hoje" value={brl(comissaoDoDia(idEu, ags, hoje))} />
        </div>
        <Panel className="divide-y">
          {minhaAgenda.length === 0 && (
            <p className="px-4 py-8 text-center text-sm text-muted-foreground">Nada marcado hoje.</p>
          )}
          {minhaAgenda.map((a) => (
            <div key={a.id} className="flex items-center justify-between px-4 py-3 text-sm">
              <span className="font-medium">{hm(a.inicio)}</span>
              <span>{db.servicoById(a.servicoId)?.nome}</span>
              <span className="text-muted-foreground">{db.clienteById(a.clienteId)?.nome}</span>
            </div>
          ))}
        </Panel>
        {meusServicos.length > 0 && (
          <p className="mt-3 text-sm text-muted-foreground">
            <span className="text-foreground">Meus serviços:</span> {meusServicos.join(' · ')}
          </p>
        )}
      </div>
    )
  }

  // cliente
  const eu = db.clienteById(clienteId)
  const agora = agoraISO()
  const proximos = proximosDoCliente(clienteId, ags, agora)
  const historico = historicoDoCliente(clienteId, ags, agora)
  const Item = ({
    servicoId,
    inicio,
    profissionalId,
    status,
  }: {
    servicoId: string
    inicio: string
    profissionalId: string
    status?: string
  }) => (
    <div className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
      <span className="font-medium">{db.servicoById(servicoId)?.nome}</span>
      <span className="text-right text-muted-foreground">
        {diaBR(inicio)} às {hm(inicio)} · {db.profissionalById(profissionalId)?.nome}
        {status && <span className="ml-1 capitalize">· {STATUS_LABEL[status] ?? status}</span>}
      </span>
    </div>
  )
  return (
    <div className="mx-auto max-w-xl">
      <PageHeader title={`Olá, ${eu?.nome ?? ''}`} subtitle="Seus horários." />
      <p className="mb-2 text-sm font-medium text-foreground">Próximos</p>
      <Panel className="divide-y">
        {proximos.length === 0 && (
          <p className="px-4 py-6 text-center text-sm text-muted-foreground">Você não tem horários marcados.</p>
        )}
        {proximos.map((a) => (
          <Item key={a.id} servicoId={a.servicoId} inicio={a.inicio} profissionalId={a.profissionalId} />
        ))}
      </Panel>
      <Button className="mt-4" onClick={() => nav('/agendar')}>
        Agendar um horário
      </Button>
      {historico.length > 0 && (
        <>
          <p className="mb-2 mt-6 text-sm font-medium text-foreground">Histórico</p>
          <Panel className="divide-y opacity-80">
            {historico.map((a) => (
              <Item key={a.id} servicoId={a.servicoId} inicio={a.inicio} profissionalId={a.profissionalId} status={a.status} />
            ))}
          </Panel>
        </>
      )}
    </div>
  )
}
