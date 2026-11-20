import { describe, it, expect } from 'vitest'
import { db } from './data'
import {
  gradeValida,
  horarioValido,
  updateEmpresa,
  getEmpresa,
  getMySettings,
  listMemberships,
  createInvite,
  setMembershipStatus,
  userIdDaIdentidade,
  getMe,
} from './api'

describe('validações', () => {
  it('gradeValida aceita só 15/30/60', () => {
    expect(gradeValida(30)).toBe(true)
    expect(gradeValida(20)).toBe(false)
  })
  it('horarioValido exige HH:MM e abertura < fechamento', () => {
    expect(horarioValido('09:00', '18:00')).toBe(true)
    expect(horarioValido('18:00', '09:00')).toBe(false)
    expect(horarioValido('09:00', '09:00')).toBe(false)
    expect(horarioValido('25:00', '26:00')).toBe(false)
  })
})

describe('updateEmpresa', () => {
  it('rejeita horário invertido e não grava', () => {
    const antes = getEmpresa().abertura
    const r = updateEmpresa({ abertura: '19:00', fechamento: '09:00' })
    expect(r.ok).toBe(false)
    expect(r.erro).toBeTruthy()
    expect(getEmpresa().abertura).toBe(antes)
  })
  it('rejeita grade fora de 15/30/60', () => {
    expect(updateEmpresa({ gradeMin: 20 }).ok).toBe(false)
  })
  it('rejeita slug vazio', () => {
    expect(updateEmpresa({ slug: '   ' }).ok).toBe(false)
  })
  it('grava quando válido', () => {
    expect(updateEmpresa({ gradeMin: 15, nome: 'Nova' }).ok).toBe(true)
    expect(getEmpresa().gradeMin).toBe(15)
    expect(getEmpresa().nome).toBe('Nova')
  })
})

describe('settings', () => {
  it('getMySettings devolve defaults para user sem settings', () => {
    const s = getMySettings('sem-settings')
    expect(s.theme).toBe('system')
    expect(s.locale).toBe('pt-BR')
    expect(s.notifyWhatsapp).toBe(false)
  })
})

describe('memberships e convites', () => {
  it('listMemberships(cliente) devolve só clientes, com user embutido', () => {
    const l = listMemberships('cliente')
    expect(l.length).toBeGreaterThanOrEqual(4)
    expect(l.every((m) => m.role === 'cliente')).toBe(true)
    expect(l[0].user).toBeTruthy()
  })
  it('createInvite gera código e entra em db.invites', () => {
    const n = db.invites.length
    const inv = createInvite('barbeiro')
    expect(inv.codigo).toBeTruthy()
    expect(inv.role).toBe('barbeiro')
    expect(db.invites.length).toBe(n + 1)
  })
  it('setMembershipStatus muda o status', () => {
    const m = db.memberships.find((x) => x.role === 'cliente')!
    setMembershipStatus(m.id, 'SUSPENDED')
    expect(db.memberships.find((x) => x.id === m.id)?.status).toBe('SUSPENDED')
  })
})

describe('identidade atual', () => {
  it('dono → ownerUserId', () => expect(userIdDaIdentidade('dono', '', '')).toBe(db.empresa.ownerUserId))
  it('barbeiro → userId do profissional', () => expect(userIdDaIdentidade('barbeiro', 'p-rafa', '')).toBe('u-rafa'))
  it('cliente → userId do cliente', () => expect(userIdDaIdentidade('cliente', '', 'c-ana')).toBe('u-ana'))
  it('getMe devolve o user', () => expect(getMe('u-rafa')?.name).toBe('Rafa'))
})
