/*
 * Lógica de agenda do Aura Barber — o núcleo "dinâmico": horários livres
 * derivados de (duração do serviço) × (disponibilidade do profissional),
 * menos os agendamentos existentes. Trabalha em minutos desde a meia-noite,
 * em horário local, sem fuso (os ISO são "YYYY-MM-DDTHH:MM:SS").
 */
import { db, type Agendamento, type Empresa, type Profissional, type Servico } from './data'

const hhmmToMin = (hhmm: string): number => {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

const minToHHMM = (min: number): string => {
  const h = Math.floor(min / 60)
  const m = min % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

/** Parte da data ("YYYY-MM-DD") de um ISO local. */
const dateOf = (iso: string): string => iso.slice(0, 10)

/** Minutos desde a meia-noite da parte de hora de um ISO local. */
const minOf = (iso: string): number => hhmmToMin(iso.slice(11, 16))

/** Dia da semana (0=domingo) de uma data "YYYY-MM-DD", sem efeito de fuso. */
const weekdayOf = (dia: string): number => {
  const [y, m, d] = dia.slice(0, 10).split('-').map(Number)
  return new Date(y, m - 1, d).getDay()
}

/**
 * Janela da grade da agenda para um dia da semana: do menor `inicio` ao maior
 * `fim` entre as disponibilidades dos profissionais que trabalham nesse weekday.
 * Se ninguém trabalha, cai para o horário da empresa. A janela é sempre clampada
 * aos limites da empresa (nunca abre antes de `abertura` nem fecha após `fechamento`).
 */
export function janelaDoDia(
  weekday: number,
  profissionais: Profissional[],
  empresa: Empresa,
): { inicioMin: number; fimMin: number } {
  const aberturaMin = hhmmToMin(empresa.abertura)
  const fechamentoMin = hhmmToMin(empresa.fechamento)
  const faixas = profissionais.flatMap((p) => p.disponibilidade.filter((d) => d.dia === weekday))
  if (faixas.length === 0) {
    return { inicioMin: aberturaMin, fimMin: fechamentoMin }
  }
  const inicio = Math.min(...faixas.map((f) => hhmmToMin(f.inicio)))
  const fim = Math.max(...faixas.map((f) => hhmmToMin(f.fim)))
  return {
    inicioMin: Math.max(inicio, aberturaMin),
    fimMin: Math.min(fim, fechamentoMin),
  }
}

/** Fim de um agendamento = início + duração, como ISO local no mesmo dia. */
export function fimDoAgendamento(inicioISO: string, duracaoMin: number): string {
  const fim = minOf(inicioISO) + duracaoMin
  return `${dateOf(inicioISO)}T${minToHHMM(fim)}:00`
}

/** Há conflito se [início, início+duração) cruza algum agendamento ativo do profissional no mesmo dia. */
export function hasConflict(
  prof: Profissional,
  novoInicioISO: string,
  duracaoMin: number,
  agendamentos: Agendamento[],
): boolean {
  const dia = dateOf(novoInicioISO)
  const novoInicio = minOf(novoInicioISO)
  const novoFim = novoInicio + duracaoMin
  return agendamentos.some((a) => {
    if (a.profissionalId !== prof.id || a.status === 'cancelado') return false
    if (dateOf(a.inicio) !== dia) return false
    const exInicio = minOf(a.inicio)
    const exFim = exInicio + (db.servicoById(a.servicoId)?.duracaoMin ?? 0)
    return novoInicio < exFim && exInicio < novoFim
  })
}

/** Horários de início livres para um serviço com um profissional num dia. */
export function availableSlots(
  prof: Profissional,
  servico: Servico,
  diaISO: string,
  agendamentos: Agendamento[],
  gradeMin = 30,
  agoraISO?: string,
): string[] {
  const dia = diaISO.slice(0, 10)
  const weekday = weekdayOf(dia)
  // Quando o dia é hoje, não oferecer horários já passados (agoraISO vem no mesmo formato ISO local).
  const pisoHoje = agoraISO && dateOf(agoraISO) === dia ? agoraISO : null
  const janelas = prof.disponibilidade.filter((d) => d.dia === weekday)
  const slots: string[] = []
  for (const j of janelas) {
    const fim = hhmmToMin(j.fim)
    for (let t = hhmmToMin(j.inicio); t + servico.duracaoMin <= fim; t += gradeMin) {
      const inicioISO = `${dia}T${minToHHMM(t)}:00`
      if (pisoHoje && inicioISO < pisoHoje) continue
      if (!hasConflict(prof, inicioISO, servico.duracaoMin, agendamentos)) slots.push(inicioISO)
    }
  }
  return slots
}
