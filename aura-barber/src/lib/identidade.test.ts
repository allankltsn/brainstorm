import { describe, it, expect } from 'vitest'
import { idValido, resolverId, lerProfId, lerClienteId, clienteSelecionado, PROF_PADRAO, CLIENTE_PADRAO } from './identidade'

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

describe('resolverId (resiliência a id removido na sessão)', () => {
  it('mantém o id quando ainda existe', () => expect(resolverId('b', ['a', 'b'], 'a')).toBe('b'))
  it('cai no padrão quando o id sumiu', () => expect(resolverId('x', ['a', 'b'], 'a')).toBe('a'))
  it('usa o primeiro disponível quando id e padrão sumiram', () => expect(resolverId('x', ['b', 'c'], 'a')).toBe('b'))
  it('devolve o próprio id quando não há nenhum disponível', () => expect(resolverId('x', [], 'a')).toBe('x'))
})

describe('clienteSelecionado', () => {
  it('cliente usa sempre a própria identidade, ignorando estado local', () =>
    expect(clienteSelecionado('cliente', 'c-ana', 'c-bruno')).toBe('c-ana'))
  it('cliente usa a identidade mesmo com estado null', () =>
    expect(clienteSelecionado('cliente', 'c-ana', null)).toBe('c-ana'))
  it('dono usa o estado local escolhido na tela', () =>
    expect(clienteSelecionado('dono', 'c-ana', 'c-bruno')).toBe('c-bruno'))
  it('barbeiro usa o estado local (null até escolher)', () =>
    expect(clienteSelecionado('barbeiro', 'c-ana', null)).toBe(null))
})

describe('lerClienteId', () => {
  it('usa o cliente padrão quando o storage está vazio', () => expect(lerClienteId(fakeStore())).toBe(CLIENTE_PADRAO))
  it('lê um cliente válido do storage', () =>
    expect(lerClienteId(fakeStore({ 'aura-barber-cliente': 'c-bruno' }))).toBe('c-bruno'))
})
