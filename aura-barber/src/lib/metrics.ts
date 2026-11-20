/*
 * Métricas derivadas dos agendamentos (estimativas sobre os mocks), puras e testáveis.
 * Leem preço/duração/comissão/disponibilidade do db; recebem a lista de agendamentos por parâmetro.
 */
import { db } from './data'
import type { Agendamento, Profissional } from './data'

const ativo = (a: Agendamento) => a.status !== 'cancelado'
const noDia = (a: Agendamento, diaISO: string) => a.inicio.slice(0, 10) === diaISO
const toMin = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

/** Faturamento previsto do dia: soma do preço dos agendamentos ativos. */
export function faturamentoDoDia(ags: Agendamento[], diaISO: string): number {
  return ags
    .filter((a) => ativo(a) && noDia(a, diaISO))
    .reduce((s, a) => s + (db.servicoById(a.servicoId)?.precoBRL ?? 0), 0)
}

/** Comissão estimada do profissional no dia = (preço dos serviços dele) × comissão. */
export function comissaoDoDia(profId: string, ags: Agendamento[], diaISO: string): number {
  const pct = (db.profissionalById(profId)?.comissaoPct ?? 0) / 100
  const bruto = ags
    .filter((a) => ativo(a) && noDia(a, diaISO) && a.profissionalId === profId)
    .reduce((s, a) => s + (db.servicoById(a.servicoId)?.precoBRL ?? 0), 0)
  return Math.round(bruto * pct)
}

/** Agenda do profissional no dia, ordenada por horário. */
export function agendaDoProfissional(profId: string, ags: Agendamento[], diaISO: string): Agendamento[] {
  return ags
    .filter((a) => ativo(a) && noDia(a, diaISO) && a.profissionalId === profId)
    .sort((x, y) => x.inicio.localeCompare(y.inicio))
}

export type Ocupacao = {
  profissionalId: string
  nome: string
  ocupadoMin: number
  janelaMin: number
  pct: number
}

/** Ocupação por profissional no dia: minutos ocupados ÷ janela de disponibilidade. */
export function ocupacaoPorProfissional(diaISO: string, ags: Agendamento[], profs: Profissional[]): Ocupacao[] {
  const [y, m, d] = diaISO.split('-').map(Number)
  const weekday = new Date(y, m - 1, d).getDay()
  return profs.map((p) => {
    const janelaMin = p.disponibilidade
      .filter((f) => f.dia === weekday)
      .reduce((s, f) => s + (toMin(f.fim) - toMin(f.inicio)), 0)
    const ocupadoMin = ags
      .filter((a) => ativo(a) && noDia(a, diaISO) && a.profissionalId === p.id)
      .reduce((s, a) => s + (db.servicoById(a.servicoId)?.duracaoMin ?? 0), 0)
    const pct = janelaMin > 0 ? Math.round((ocupadoMin / janelaMin) * 100) : 0
    return { profissionalId: p.id, nome: p.nome, ocupadoMin, janelaMin, pct }
  })
}

/** Próximos horários do cliente: marcados com início ≥ agora, ordenados. */
export function proximosDoCliente(clienteId: string, ags: Agendamento[], agoraISO: string): Agendamento[] {
  return ags
    .filter((a) => a.clienteId === clienteId && a.status === 'marcado' && a.inicio >= agoraISO)
    .sort((x, y) => x.inicio.localeCompare(y.inicio))
}

/** Histórico do cliente: tudo que não é "marcado futuro", mais recente primeiro. */
export function historicoDoCliente(clienteId: string, ags: Agendamento[], agoraISO: string): Agendamento[] {
  return ags
    .filter((a) => a.clienteId === clienteId && !(a.status === 'marcado' && a.inicio >= agoraISO))
    .sort((x, y) => y.inicio.localeCompare(x.inicio))
}
