import { describe, expect, it } from 'vitest'
import {
  aplicarCancelar,
  aplicarContratar,
  readStoredProfileId,
  resolveProfileId,
  subscriptionsFor,
} from './store'

describe('store — lógica de perfis e assinaturas', () => {
  it('perfil padrão é "completo" quando nada válido está salvo', () => {
    expect(resolveProfileId(null)).toBe('completo')
    expect(resolveProfileId('inexistente')).toBe('completo')
    expect(resolveProfileId('novo')).toBe('novo')
  })

  it('perfil "novo" não tem nenhuma assinatura', () => {
    expect(subscriptionsFor('novo')).toEqual([])
  })

  it('contratar ativa o serviço ausente (perfil parcial não tem barber)', () => {
    const subs = subscriptionsFor('parcial')
    expect(subs.some((s) => s.serviceId === 'barber')).toBe(false)
    const next = aplicarContratar(subs, 'barber')
    expect(next.find((s) => s.serviceId === 'barber')?.status).toBe('ativa')
  })

  it('cancelar marca o serviço contratado como "cancelada" (parcial tem fit)', () => {
    const next = aplicarCancelar(subscriptionsFor('parcial'), 'fit')
    expect(next.find((s) => s.serviceId === 'fit')?.status).toBe('cancelada')
  })

  it('readStoredProfileId não quebra quando o storage lança', () => {
    const throwing = {
      getItem() {
        throw new Error('storage bloqueado')
      },
    } as unknown as Storage
    expect(readStoredProfileId(throwing)).toBeNull()
  })
})
