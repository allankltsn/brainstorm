import { describe, it, expect } from 'vitest'
import type { Agendamento, Profissional } from './data'
import {
  faturamentoDoDia,
  comissaoDoDia,
  agendaDoProfissional,
  ocupacaoPorProfissional,
  proximosDoCliente,
  historicoDoCliente,
} from './metrics'

const D = '2026-11-20'
function ag(p: Partial<Agendamento> & Pick<Agendamento, 'servicoId' | 'inicio'>): Agendamento {
  return {
    id: p.id ?? `a-${Math.random()}`,
    clienteId: p.clienteId ?? 'c-ana',
    profissionalId: p.profissionalId ?? 'p-rafa',
    status: p.status ?? 'marcado',
    servicoId: p.servicoId,
    inicio: p.inicio,
  }
}

describe('faturamentoDoDia', () => {
  it('soma só os ativos do dia, ignorando cancelado e outros dias', () => {
    const ags = [
      ag({ servicoId: 's-corte', inicio: `${D}T09:00:00` }), // 45
      ag({ servicoId: 's-corte', inicio: `${D}T10:00:00`, status: 'cancelado' }), // ignora
      ag({ servicoId: 's-corte', inicio: '2026-11-21T09:00:00' }), // outro dia
    ]
    expect(faturamentoDoDia(ags, D)).toBe(45)
  })
})

describe('comissaoDoDia', () => {
  it('aplica a comissão do profissional sobre os serviços dele no dia', () => {
    const ags = [
      ag({ servicoId: 's-corte', inicio: `${D}T09:00:00`, profissionalId: 'p-rafa' }), // 45
      ag({ servicoId: 's-barba', inicio: `${D}T10:00:00`, profissionalId: 'p-rafa' }), // 35
      ag({ servicoId: 's-corte', inicio: `${D}T11:00:00`, profissionalId: 'p-joao' }), // outro prof
      ag({ servicoId: 's-corte', inicio: `${D}T12:00:00`, profissionalId: 'p-rafa', status: 'cancelado' }),
    ]
    // (45+35) * 50% = 40
    expect(comissaoDoDia('p-rafa', ags, D)).toBe(40)
  })
})

describe('agendaDoProfissional', () => {
  it('filtra pelo profissional e dia, ordenado por horário', () => {
    const ags = [
      ag({ id: 'x2', servicoId: 's-corte', inicio: `${D}T11:00:00`, profissionalId: 'p-rafa' }),
      ag({ id: 'x1', servicoId: 's-corte', inicio: `${D}T09:00:00`, profissionalId: 'p-rafa' }),
      ag({ id: 'y', servicoId: 's-corte', inicio: `${D}T10:00:00`, profissionalId: 'p-joao' }),
    ]
    expect(agendaDoProfissional('p-rafa', ags, D).map((a) => a.id)).toEqual(['x1', 'x2'])
  })
})

describe('ocupacaoPorProfissional', () => {
  const todoDia = (ini: string, fim: string): Profissional['disponibilidade'] =>
    [0, 1, 2, 3, 4, 5, 6].map((dia) => ({ dia, inicio: ini, fim }))
  const trabalha: Profissional = { id: 'p-x', nome: 'X', servicos: [], disponibilidade: todoDia('09:00', '12:00'), comissaoPct: 50 }
  const folga: Profissional = { id: 'p-y', nome: 'Y', servicos: [], disponibilidade: [], comissaoPct: 50 }

  it('calcula pct = ocupado/janela', () => {
    const ags = [ag({ servicoId: 's-corte', inicio: `${D}T09:00:00`, profissionalId: 'p-x' })] // 30 min
    const r = ocupacaoPorProfissional(D, ags, [trabalha])
    expect(r[0].janelaMin).toBe(180)
    expect(r[0].ocupadoMin).toBe(30)
    expect(r[0].pct).toBe(17) // round(30/180*100)
  })

  it('não divide por zero quando o profissional não trabalha no dia', () => {
    const ags = [ag({ servicoId: 's-corte', inicio: `${D}T09:00:00`, profissionalId: 'p-y' })]
    const r = ocupacaoPorProfissional(D, ags, [folga])
    expect(r[0].janelaMin).toBe(0)
    expect(r[0].pct).toBe(0)
  })
})

describe('próximos e histórico do cliente', () => {
  const agora = `${D}T12:00:00`
  const ags = [
    ag({ id: 'fut', servicoId: 's-corte', inicio: `${D}T15:00:00`, clienteId: 'c-ana', status: 'marcado' }),
    ag({ id: 'pass', servicoId: 's-corte', inicio: `${D}T09:00:00`, clienteId: 'c-ana', status: 'marcado' }),
    ag({ id: 'concl', servicoId: 's-corte', inicio: '2026-11-21T10:00:00', clienteId: 'c-ana', status: 'concluido' }),
    ag({ id: 'outro', servicoId: 's-corte', inicio: `${D}T16:00:00`, clienteId: 'c-bruno', status: 'marcado' }),
  ]

  it('próximos = marcados futuros do cliente', () => {
    expect(proximosDoCliente('c-ana', ags, agora).map((a) => a.id)).toEqual(['fut'])
  })

  it('histórico = o resto do cliente, mais recente primeiro', () => {
    expect(historicoDoCliente('c-ana', ags, agora).map((a) => a.id)).toEqual(['concl', 'pass'])
  })
})
