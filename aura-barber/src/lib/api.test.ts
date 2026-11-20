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
  listFiliais,
  getFilial,
  updateFilial,
  profissionaisDaFilial,
  agendamentosDaFilial,
  filialPadrao,
  criarProfissional,
  criarFilial,
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

describe('updateEmpresa (marca)', () => {
  it('rejeita slug vazio e não grava', () => {
    const antes = getEmpresa().slug
    expect(updateEmpresa({ slug: '   ' }).ok).toBe(false)
    expect(getEmpresa().slug).toBe(antes)
  })
  it('rejeita nome vazio', () => {
    expect(updateEmpresa({ nome: '  ' }).ok).toBe(false)
  })
  it('grava nome válido', () => {
    expect(updateEmpresa({ nome: 'Nova' }).ok).toBe(true)
    expect(getEmpresa().nome).toBe('Nova')
  })
})

describe('filiais', () => {
  it('listFiliais retorna as filiais da marca', () => {
    expect(listFiliais().length).toBeGreaterThanOrEqual(2)
  })
  it('updateFilial rejeita horário invertido e não grava', () => {
    const f = listFiliais()[0]
    const r = updateFilial(f.id, { abertura: '19:00', fechamento: '09:00' })
    expect(r.ok).toBe(false)
    expect(getFilial(f.id)?.abertura).not.toBe('19:00')
  })
  it('updateFilial rejeita grade fora de 15/30/60', () => {
    expect(updateFilial(listFiliais()[0].id, { gradeMin: 20 }).ok).toBe(false)
  })
  it('updateFilial grava quando válido', () => {
    const f = listFiliais()[0]
    expect(updateFilial(f.id, { gradeMin: 15 }).ok).toBe(true)
    expect(getFilial(f.id)?.gradeMin).toBe(15)
  })
  it('profissionaisDaFilial traz só os da filial', () => {
    const f = listFiliais()[0]
    expect(profissionaisDaFilial(f.id).every((p) => p.filialId === f.id)).toBe(true)
  })
  it('agendamentosDaFilial traz só os da filial', () => {
    const f = listFiliais()[0]
    expect(agendamentosDaFilial(f.id).every((a) => a.filialId === f.id)).toBe(true)
  })
  it('filialPadrao: barbeiro usa a própria filial; dono usa a primeira', () => {
    expect(filialPadrao('barbeiro', 'p-rafa')).toBe(db.profissionalById('p-rafa')!.filialId)
    expect(filialPadrao('dono', '')).toBe(listFiliais()[0].id)
  })
  it('criarFilial valida (rejeita horário invertido) e cria quando válido', () => {
    expect(criarFilial({ nome: 'X', abertura: '19:00', fechamento: '09:00', gradeMin: 30 }).ok).toBe(false)
    expect(criarFilial({ nome: '  ', abertura: '08:00', fechamento: '18:00', gradeMin: 30 }).ok).toBe(false)
    const r = criarFilial({ nome: 'Unidade Teste', abertura: '08:00', fechamento: '18:00', gradeMin: 30 })
    expect(r.ok).toBe(true)
    expect(r.filial && listFiliais().some((f) => f.id === r.filial!.id)).toBe(true)
  })
  it('criarProfissional respeita a filial informada (nasce na filial ativa)', () => {
    const alvo = listFiliais()[1]?.id ?? listFiliais()[0].id
    const p = criarProfissional({ nome: 'Teste Filial', servicos: [], disponibilidade: [], comissaoPct: 0, filialId: alvo })
    expect(p.filialId).toBe(alvo)
    expect(db.memberships.find((m) => m.userId === p.userId)?.filialId).toBe(alvo)
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
