/*
 * Identidade do protótipo: além do papel (role), "quem sou eu".
 * Barbeiro → um Profissional; Cliente → um Cliente; Dono é único (sem sub-identidade).
 * Persistido em localStorage, com fallback para padrões e validação contra o db.
 */
import { db } from './data'
import type { Role } from './data'

export const PROF_PADRAO = 'p-rafa'
export const CLIENTE_PADRAO = 'c-ana'

export const KEY_PROF = 'aura-barber-prof'
export const KEY_CLIENTE = 'aura-barber-cliente'

type Store = Pick<Storage, 'getItem' | 'setItem'>

function storagePadrao(): Store | undefined {
  try {
    return typeof localStorage !== 'undefined' ? localStorage : undefined
  } catch {
    return undefined
  }
}

/** Retorna `valor` se estiver em `validos`; senão, `padrao`. */
export function idValido(valor: string | null, validos: string[], padrao: string): string {
  return valor && validos.includes(valor) ? valor : padrao
}

export function lerProfId(ls: Store | undefined = storagePadrao()): string {
  let bruto: string | null = null
  try {
    bruto = ls?.getItem(KEY_PROF) ?? null
  } catch {
    bruto = null
  }
  return idValido(
    bruto,
    db.profissionais.map((p) => p.id),
    PROF_PADRAO,
  )
}

export function lerClienteId(ls: Store | undefined = storagePadrao()): string {
  let bruto: string | null = null
  try {
    bruto = ls?.getItem(KEY_CLIENTE) ?? null
  } catch {
    bruto = null
  }
  return idValido(
    bruto,
    db.clientes.map((c) => c.id),
    CLIENTE_PADRAO,
  )
}

/**
 * Cliente efetivo de um agendamento: o cliente logado agenda sempre para si (a identidade
 * viva vence o estado local, evitando valor defasado); dono/barbeiro usam o que escolheram na tela.
 */
export function clienteSelecionado(role: Role, euClienteId: string, estado: string | null): string | null {
  return role === 'cliente' ? euClienteId : estado
}

export function salvarId(key: string, valor: string, ls: Store | undefined = storagePadrao()): void {
  try {
    ls?.setItem(key, valor)
  } catch {
    /* ignora */
  }
}
