/*
 * Domínio do Aura Barber (dados mock, em memória — sem backend).
 * Os tipos modelam uma barbearia: serviços com duração, profissionais com
 * disponibilidade e comissão, clientes e agendamentos.
 */

export type Role = 'dono' | 'barbeiro' | 'cliente'

export type Servico = {
  id: string
  nome: string
  duracaoMin: number
  precoBRL: number
  categoria: string
  executores: string[] // ids de Profissional que executam o serviço
}

export type Disponibilidade = {
  dia: number // 0=domingo … 6=sábado
  inicio: string // "HH:MM"
  fim: string // "HH:MM"
}

export type Profissional = {
  id: string
  nome: string
  servicos: string[] // ids de Servico que o profissional executa
  disponibilidade: Disponibilidade[]
  comissaoPct: number
}

export type Cliente = {
  id: string
  nome: string
  telefone: string
}

export type AgendamentoStatus = 'marcado' | 'concluido' | 'cancelado'

export type Agendamento = {
  id: string
  clienteId: string
  servicoId: string
  profissionalId: string
  inicio: string // ISO local "YYYY-MM-DDTHH:MM:00"
  status: AgendamentoStatus
}

export type Empresa = {
  nome: string
  fuso: string
  abertura: string // "HH:MM"
  fechamento: string // "HH:MM"
}

/** ISO local (sem fuso) para hoje em uma dada hora "HH:MM". */
function hojeAs(hhmm: string): string {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${dd}T${hhmm}:00`
}

const semanaComercial: Disponibilidade[] = [
  { dia: 2, inicio: '09:00', fim: '18:00' },
  { dia: 3, inicio: '09:00', fim: '18:00' },
  { dia: 4, inicio: '09:00', fim: '18:00' },
  { dia: 5, inicio: '09:00', fim: '20:00' },
  { dia: 6, inicio: '08:00', fim: '17:00' },
]

const profissionais: Profissional[] = [
  {
    id: 'p-rafa',
    nome: 'Rafa',
    servicos: ['s-corte', 's-barba', 's-corte-barba', 's-pezinho'],
    disponibilidade: semanaComercial,
    comissaoPct: 50,
  },
  {
    id: 'p-joao',
    nome: 'João',
    servicos: ['s-corte', 's-barba', 's-corte-barba', 's-combo'],
    disponibilidade: semanaComercial,
    comissaoPct: 45,
  },
  {
    id: 'p-bruna',
    nome: 'Bruna',
    servicos: ['s-corte', 's-luzes', 's-pigmentacao'],
    disponibilidade: [
      { dia: 3, inicio: '10:00', fim: '19:00' },
      { dia: 4, inicio: '10:00', fim: '19:00' },
      { dia: 5, inicio: '10:00', fim: '19:00' },
      { dia: 6, inicio: '09:00', fim: '16:00' },
    ],
    comissaoPct: 55,
  },
]

const servicos: Servico[] = [
  { id: 's-corte', nome: 'Corte', duracaoMin: 30, precoBRL: 45, categoria: 'Cabelo', executores: ['p-rafa', 'p-joao', 'p-bruna'] },
  { id: 's-barba', nome: 'Barba', duracaoMin: 30, precoBRL: 35, categoria: 'Barba', executores: ['p-rafa', 'p-joao'] },
  { id: 's-corte-barba', nome: 'Corte + Barba', duracaoMin: 60, precoBRL: 70, categoria: 'Combo', executores: ['p-rafa', 'p-joao'] },
  { id: 's-combo', nome: 'Combo Completo', duracaoMin: 90, precoBRL: 110, categoria: 'Combo', executores: ['p-joao'] },
  { id: 's-pezinho', nome: 'Pezinho', duracaoMin: 15, precoBRL: 20, categoria: 'Cabelo', executores: ['p-rafa'] },
  { id: 's-luzes', nome: 'Luzes', duracaoMin: 120, precoBRL: 180, categoria: 'Coloração', executores: ['p-bruna'] },
  { id: 's-pigmentacao', nome: 'Pigmentação', duracaoMin: 45, precoBRL: 60, categoria: 'Coloração', executores: ['p-bruna'] },
]

const clientes: Cliente[] = [
  { id: 'c-ana', nome: 'Ana Souza', telefone: '(11) 90000-0001' },
  { id: 'c-bruno', nome: 'Bruno Lima', telefone: '(11) 90000-0002' },
  { id: 'c-carla', nome: 'Carla Dias', telefone: '(11) 90000-0003' },
  { id: 'c-diego', nome: 'Diego Reis', telefone: '(11) 90000-0004' },
]

const agendamentos: Agendamento[] = [
  { id: 'a-1', clienteId: 'c-ana', servicoId: 's-corte', profissionalId: 'p-rafa', inicio: hojeAs('09:00'), status: 'marcado' },
  { id: 'a-2', clienteId: 'c-bruno', servicoId: 's-corte-barba', profissionalId: 'p-joao', inicio: hojeAs('10:00'), status: 'marcado' },
  { id: 'a-3', clienteId: 'c-carla', servicoId: 's-luzes', profissionalId: 'p-bruna', inicio: hojeAs('10:00'), status: 'marcado' },
  { id: 'a-4', clienteId: 'c-diego', servicoId: 's-pezinho', profissionalId: 'p-rafa', inicio: hojeAs('11:30'), status: 'marcado' },
]

const empresa: Empresa = {
  nome: 'Aura Barber',
  fuso: 'America/Sao_Paulo',
  abertura: '08:00',
  fechamento: '20:00',
}

export const db = {
  empresa,
  servicos,
  profissionais,
  clientes,
  agendamentos,
  servicoById: (id: string) => servicos.find((s) => s.id === id),
  profissionalById: (id: string) => profissionais.find((p) => p.id === id),
  clienteById: (id: string) => clientes.find((c) => c.id === id),
}

export { hojeAs }
