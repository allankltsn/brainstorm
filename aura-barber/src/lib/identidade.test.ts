import { describe, it, expect } from 'vitest'
import { idValido, lerProfId, lerClienteId, PROF_PADRAO, CLIENTE_PADRAO } from './identidade'

function fakeStore(init: Record<string, string> = {}) {
  const m = new Map(Object.entries(init))
  return {
    getItem: (k: string) => m.get(k) ?? null,
    setItem: (k: string, v: string) => {
      m.set(k, v)
    },
  }
}

describe('idValido', () => {
  it('cai no padrão quando o valor é null', () => expect(idValido(null, ['a'], 'a')).toBe('a'))
  it('cai no padrão quando o valor não está na lista', () => expect(idValido('x', ['a'], 'a')).toBe('a'))
  it('aceita um valor presente na lista', () => expect(idValido('a', ['a', 'b'], 'b')).toBe('a'))
})

describe('lerProfId', () => {
  it('usa o profissional padrão quando o storage está vazio', () => expect(lerProfId(fakeStore())).toBe(PROF_PADRAO))
  it('lê um profissional válido do storage', () => expect(lerProfId(fakeStore({ 'aura-barber-prof': 'p-joao' }))).toBe('p-joao'))
  it('rejeita um profissional inexistente e cai no padrão', () =>
    expect(lerProfId(fakeStore({ 'aura-barber-prof': 'zzz' }))).toBe(PROF_PADRAO))
})

describe('lerClienteId', () => {
  it('usa o cliente padrão quando o storage está vazio', () => expect(lerClienteId(fakeStore())).toBe(CLIENTE_PADRAO))
  it('lê um cliente válido do storage', () =>
    expect(lerClienteId(fakeStore({ 'aura-barber-cliente': 'c-bruno' }))).toBe('c-bruno'))
})
