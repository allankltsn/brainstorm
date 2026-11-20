import { test, expect } from 'vitest'
import { availableSlots, hasConflict, fimDoAgendamento } from './schedule'
import type { Agendamento, Profissional, Servico } from './data'

const DIA = '2026-11-24'
const wd = new Date(2026, 10, 24).getDay() // dia da semana real dessa data
const iso = (hhmm: string) => `${DIA}T${hhmm}:00`

function prof(disp: Profissional['disponibilidade'] = [{ dia: wd, inicio: '09:00', fim: '18:00' }]): Profissional {
  return { id: 'p1', nome: 'P', servicos: ['s-corte'], disponibilidade: disp, comissaoPct: 0 }
}
const corte: Servico = { id: 's-corte', nome: 'Corte', duracaoMin: 30, precoBRL: 45, categoria: 'Cabelo', executores: ['p1'] }
const longo: Servico = { id: 's-longo', nome: 'Longo', duracaoMin: 60, precoBRL: 1, categoria: 'x', executores: ['p1'] }

// agendamento existente usa serviço real do db (s-corte = 30min) p/ a resolução de duração
const agCorte09 = (): Agendamento => ({ id: 'a', clienteId: 'c', servicoId: 's-corte', profissionalId: 'p1', inicio: iso('09:00'), status: 'marcado' })

test('availableSlots exclui horário que sobrepõe agendamento existente', () => {
  const slots = availableSlots(prof(), corte, DIA, [agCorte09()])
  expect(slots).not.toContain(iso('09:00'))
  expect(slots).toContain(iso('09:30'))
})

test('availableSlots exclui início cujo serviço ultrapassa o fim do expediente', () => {
  const slots = availableSlots(prof(), longo, DIA, [])
  expect(slots).toContain(iso('17:00')) // 17:00 + 60 = 18:00 (ok)
  expect(slots).not.toContain(iso('17:30')) // 17:30 + 60 = 18:30 (passa do fim)
})

test('availableSlots vazio quando profissional está de folga no dia', () => {
  const outroDia = (wd + 1) % 7
  const slots = availableSlots(prof([{ dia: outroDia, inicio: '09:00', fim: '18:00' }]), corte, DIA, [])
  expect(slots).toEqual([])
})

test('fimDoAgendamento soma duração não múltipla da grade', () => {
  expect(fimDoAgendamento('2026-11-24T09:00:00', 45)).toBe('2026-11-24T09:45:00')
  expect(fimDoAgendamento('2026-11-24T09:30:00', 45)).toBe('2026-11-24T10:15:00')
})

test('hasConflict detecta interseção de intervalos e ignora adjacência', () => {
  expect(hasConflict(prof(), iso('09:15'), 30, [agCorte09()])).toBe(true) // 09:15 dentro de 09:00-09:30
  expect(hasConflict(prof(), iso('09:30'), 30, [agCorte09()])).toBe(false) // encosta, não sobrepõe
})
