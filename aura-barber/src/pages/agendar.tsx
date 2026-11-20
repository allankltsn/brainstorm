import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { PageHeader, Panel, brl } from '@/components/layout'
import { Button } from '@/components/affect/button'
import { Select } from '@/components/affect/select'
import { db, type Agendamento } from '@/lib/data'
import { availableSlots } from '@/lib/schedule'
import { useRole } from '@/lib/role'
import { clienteSelecionado } from '@/lib/identidade'

const DIAS = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado']
function hojeISO() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
function agoraISO() {
  const d = new Date()
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}:00`
}
function addDias(diaISO: string, n: number) {
  const [y, m, d] = diaISO.split('-').map(Number)
  const dt = new Date(y, m - 1, d + n)
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`
}
const hm = (iso: string) => iso.slice(11, 16)

export function Agendar() {
  const nav = useNavigate()
  const { role, clienteId: euClienteId } = useRole()
  const [clienteEstado, setClienteEstado] = useState<string | null>(null)
  // Cliente logado agenda para si (identidade viva vence o estado local); dono/barbeiro escolhem na tela.
  const clienteId = clienteSelecionado(role, euClienteId, clienteEstado)
  const [servicoId, setServicoId] = useState<string | null>(null)
  const [profId, setProfId] = useState<string | null>(null)
  const [dia, setDia] = useState<string>(hojeISO)
  const [slot, setSlot] = useState<string | null>(null)

  const servico = servicoId ? db.servicoById(servicoId) : undefined
  // só profissionais que executam o serviço escolhido (derivado de Profissional.servicos)
  const profsDoServico = useMemo(
    () => (servico ? db.executoresDe(servico.id).map((id) => db.profissionalById(id)!) : []),
    [servico],
  )
  const prof = profId ? db.profissionalById(profId) : undefined

  const slots = useMemo(
    () => (prof && servico ? availableSlots(prof, servico, dia, db.agendamentos, db.empresa.gradeMin, agoraISO()) : []),
    [prof, servico, dia],
  )

  const [y, m, d] = dia.split('-').map(Number)
  const weekday = new Date(y, m - 1, d).getDay()
  const dataLabel = `${DIAS[weekday]}, ${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}`

  const escolheServico = (id: string) => {
    setServicoId(id)
    setProfId(null)
    setSlot(null)
  }
  const escolheProf = (id: string) => {
    setProfId(id)
    setSlot(null)
  }

  const confirmar = () => {
    if (!clienteId || !servicoId || !profId || !slot) return
    const novo: Agendamento = {
      id: `a-${Date.now()}`,
      clienteId,
      servicoId,
      profissionalId: profId,
      inicio: slot,
      status: 'marcado',
    }
    db.agendamentos.push(novo)
    nav('/agenda')
  }

  const podeConfirmar = Boolean(clienteId && servicoId && profId && slot)

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Novo agendamento" subtitle="Cliente, serviço, profissional e um horário livre." />

      <Panel className="space-y-5 p-5">
        {role === 'cliente' ? (
          <p className="text-sm text-muted-foreground">
            Agendando para <span className="font-medium text-foreground">{db.clienteById(euClienteId)?.nome}</span>.
          </p>
        ) : (
          <Select
            label="Cliente"
            placeholder="Escolha o cliente"
            value={clienteId}
            options={db.clientes.map((c) => ({ value: c.id, label: c.nome, description: c.telefone }))}
            onChange={setClienteEstado}
          />
        )}

        <div>
          <Select
            label="Serviço"
            placeholder="Escolha o serviço"
            value={servicoId}
            options={db.servicos.map((s) => ({
              value: s.id,
              label: s.nome,
              description: `${s.duracaoMin} min · ${brl(s.precoBRL)}`,
            }))}
            onChange={escolheServico}
          />
          {servico && (
            <p className="mt-1 text-sm text-muted-foreground">
              {servico.duracaoMin} min · {brl(servico.precoBRL)}
            </p>
          )}
        </div>

        <Select
          label="Profissional"
          placeholder={servico ? 'Quem vai atender' : 'Escolha o serviço primeiro'}
          value={profId}
          disabled={!servico}
          options={profsDoServico.map((p) => ({ value: p.id, label: p.nome }))}
          onChange={escolheProf}
        />

        {prof && servico && (
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="text-sm font-medium">Horário</span>
              <div className="ml-auto flex items-center gap-1">
                <Button variant="secondary" size="sm" icon={<ChevronLeft size={15} />} onClick={() => { setDia(addDias(dia, -1)); setSlot(null) }} />
                <Button variant="secondary" size="sm" onClick={() => { setDia(hojeISO()); setSlot(null) }}>
                  Hoje
                </Button>
                <Button variant="secondary" size="sm" icon={<ChevronRight size={15} />} onClick={() => { setDia(addDias(dia, 1)); setSlot(null) }} />
              </div>
            </div>
            <p className="mb-2 text-sm capitalize text-muted-foreground">{dataLabel}</p>
            {slots.length === 0 ? (
              <p className="rounded-lg bg-muted/40 px-3 py-6 text-center text-sm text-muted-foreground">
                Sem horários livres neste dia.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {slots.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSlot(s)}
                    className={`rounded-lg border px-3 py-1.5 text-sm transition ${
                      slot === s ? 'border-primary bg-primary text-primary-foreground' : 'bg-background text-foreground'
                    }`}
                  >
                    {hm(s)}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end gap-2 border-t pt-4">
          <Button variant="secondary" onClick={() => nav('/agenda')}>
            Cancelar
          </Button>
          <Button disabled={!podeConfirmar} onClick={confirmar}>
            Confirmar agendamento
          </Button>
        </div>
      </Panel>
    </div>
  )
}
