import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { PageHeader } from '@/components/layout'
import { Button } from '@/components/affect/button'
import { db } from '@/lib/data'
import { useRole } from '@/lib/role'
import { profissionaisDaFilial, agendamentosDaFilial } from '@/lib/api'
import { fimDoAgendamento, janelaDoDia } from '@/lib/schedule'

const ALTURA = 48 // px por faixa de GRADE minutos
const DIAS = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado']
const toMin = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}
const hm = (iso: string) => iso.slice(11, 16)

function hojeISO() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
function addDias(diaISO: string, n: number) {
  const [y, m, d] = diaISO.split('-').map(Number)
  const dt = new Date(y, m - 1, d + n)
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`
}

export function Agenda() {
  const nav = useNavigate()
  const { filialId } = useRole()
  const filial = db.filialById(filialId) ?? db.filiais[0]
  const [dia, setDia] = useState<string>(hojeISO)
  const GRADE = filial.gradeMin // granularidade da filial ativa

  const profs = profissionaisDaFilial(filial.id)
  const [y, m, d] = dia.split('-').map(Number)
  const weekday = new Date(y, m - 1, d).getDay()
  // janela da grade = disponibilidade real do dia (clampada ao horário da filial)
  const { inicioMin: abertura, fimMin: fechamento } = janelaDoDia(weekday, profs, filial)
  const faixas: number[] = []
  for (let t = abertura; t < fechamento; t += GRADE) faixas.push(t)
  const alturaTotal = ((fechamento - abertura) / GRADE) * ALTURA

  const doDia = agendamentosDaFilial(filial.id).filter((a) => a.inicio.slice(0, 10) === dia && a.status !== 'cancelado')

  const dataLabel = `${DIAS[weekday]}, ${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}`

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Agenda"
        subtitle="Horários por profissional — duração do serviço define o bloco."
        action={
          <Button icon={<Plus size={16} />} onClick={() => nav('/agendar')}>
            Novo
          </Button>
        }
      />

      <div className="mb-4 flex items-center gap-2">
        <Button variant="secondary" size="sm" icon={<ChevronLeft size={16} />} onClick={() => setDia(addDias(dia, -1))} />
        <Button variant="secondary" size="sm" onClick={() => setDia(hojeISO())}>
          Hoje
        </Button>
        <Button variant="secondary" size="sm" icon={<ChevronRight size={16} />} onClick={() => setDia(addDias(dia, 1))} />
        <span className="ml-2 text-sm font-medium capitalize text-foreground">{dataLabel}</span>
      </div>

      <div className="overflow-x-auto rounded-xl border bg-card">
        <div className="flex min-w-[640px]">
          {/* coluna de horas */}
          <div className="w-16 shrink-0 border-r">
            <div className="h-10 border-b" />
            <div className="relative" style={{ height: alturaTotal }}>
              {faixas.map((t, i) => (
                <div
                  key={t}
                  className="absolute left-0 right-1 text-right text-xs text-muted-foreground"
                  style={{ top: i * ALTURA - 6 }}
                >
                  {String(Math.floor(t / 60)).padStart(2, '0')}:{String(t % 60).padStart(2, '0')}
                </div>
              ))}
            </div>
          </div>

          {/* uma coluna por profissional */}
          {profs.map((p) => {
            const trabalha = p.disponibilidade.some((f) => f.dia === weekday)
            const seus = doDia.filter((a) => a.profissionalId === p.id)
            return (
              <div key={p.id} className="min-w-[160px] flex-1 border-r last:border-r-0">
                <div className="flex h-10 items-center justify-center border-b text-sm font-medium">{p.nome}</div>
                <div className="relative" style={{ height: alturaTotal }}>
                  {/* linhas da grade */}
                  {faixas.map((t, i) => (
                    <div key={t} className="absolute inset-x-0 border-b border-border/50" style={{ top: i * ALTURA, height: ALTURA }} />
                  ))}
                  {!trabalha && (
                    <div className="absolute inset-0 flex items-center justify-center bg-muted/30 text-xs text-muted-foreground">
                      folga
                    </div>
                  )}
                  {seus.map((a) => {
                    const s = db.servicoById(a.servicoId)
                    const dur = s?.duracaoMin ?? GRADE
                    const inicioMin = toMin(hm(a.inicio))
                    const top = ((inicioMin - abertura) / GRADE) * ALTURA
                    const h = (dur / GRADE) * ALTURA
                    const cliente = db.clienteById(a.clienteId)?.nome ?? 'Cliente'
                    return (
                      <div
                        key={a.id}
                        className="absolute inset-x-1 overflow-hidden rounded-md border border-primary/30 bg-primary/10 px-2 py-1 text-xs"
                        style={{ top: top + 1, height: h - 2 }}
                        title={`${cliente} · ${s?.nome ?? ''} ${hm(a.inicio)}–${hm(fimDoAgendamento(a.inicio, dur))}`}
                      >
                        <p className="truncate font-medium text-foreground">{s?.nome ?? 'Serviço'}</p>
                        <p className="truncate text-muted-foreground">
                          {cliente} · {hm(a.inicio)}–{hm(fimDoAgendamento(a.inicio, dur))}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
