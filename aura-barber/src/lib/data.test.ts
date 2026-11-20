import { test, expect } from 'vitest'
import { db } from './data'

test('mock tem 3 profissionais e todo serviço tem ao menos um executor derivado', () => {
  expect(db.profissionais.length).toBe(3)
  const ids = new Set(db.profissionais.map((p) => p.id))
  expect(db.servicos.length).toBeGreaterThanOrEqual(6)
  for (const s of db.servicos) {
    const execs = db.executoresDe(s.id)
    expect(execs.length).toBeGreaterThan(0)
    for (const e of execs) expect(ids.has(e)).toBe(true)
  }
})

test('replaceServicos escreve no db e reflete em servicoById', () => {
  const novo = { id: 's-teste', nome: 'Teste', duracaoMin: 10, precoBRL: 1, categoria: 'x' }
  db.replaceServicos([...db.servicos, novo])
  expect(db.servicoById('s-teste')).toBeTruthy()
  expect(db.servicos.some((s) => s.id === 's-teste')).toBe(true)
})

test('replaceProfissionais escreve no db e reflete em profissionalById', () => {
  const novo = { id: 'p-teste', userId: 'u-dono', filialId: 'f-centro', nome: 'Teste', servicos: [], disponibilidade: [], comissaoPct: 0 }
  db.replaceProfissionais([...db.profissionais, novo])
  expect(db.profissionalById('p-teste')).toBeTruthy()
})

test('executoresDe deriva de Profissional.servicos, na ordem de db.profissionais', () => {
  // s-corte está em servicos de rafa, joao e bruna; s-combo só de joao
  expect(db.executoresDe('s-corte')).toEqual(['p-rafa', 'p-joao', 'p-bruna'])
  expect(db.executoresDe('s-combo')).toEqual(['p-joao'])
  // serviço sem ninguém que o execute → lista vazia
  expect(db.executoresDe('s-inexistente')).toEqual([])
})

test('a relação serviço⇄executor tem fonte única: editar Profissional.servicos muda executoresDe', () => {
  const base = db.profissionais.map((p) => ({ ...p, servicos: [...p.servicos] }))
  // remove s-corte de rafa
  const semRafa = base.map((p) => (p.id === 'p-rafa' ? { ...p, servicos: p.servicos.filter((s) => s !== 's-corte') } : p))
  db.replaceProfissionais(semRafa)
  expect(db.executoresDe('s-corte')).not.toContain('p-rafa')
  expect(db.executoresDe('s-corte')).toContain('p-joao')
  // adiciona s-luzes a joao
  const comLuzesJoao = db.profissionais.map((p) =>
    p.id === 'p-joao' ? { ...p, servicos: [...p.servicos, 's-luzes'] } : { ...p, servicos: [...p.servicos] },
  )
  db.replaceProfissionais(comLuzesJoao)
  expect(db.executoresDe('s-luzes')).toContain('p-joao')
})

test('cancelarAgendamento marca o status como cancelado', () => {
  db.cancelarAgendamento('a-1')
  expect(db.agendamentos.find((a) => a.id === 'a-1')?.status).toBe('cancelado')
})

test('cancelarAgendamento com id inexistente não lança nem altera a lista', () => {
  const antes = db.agendamentos.length
  expect(() => db.cancelarAgendamento('nao-existe')).not.toThrow()
  expect(db.agendamentos.length).toBe(antes)
})

test('identidade: seed tem users para dono + 3 barbeiros + 4 clientes', () => {
  expect(db.users.length).toBe(8)
  expect(db.userById('u-dono')?.name).toBeTruthy()
  expect(db.userById('inexistente')).toBeUndefined()
})

test('identidade: cada profissional e cliente tem userId de um user existente', () => {
  for (const p of db.profissionais) expect(db.userById(p.userId)).toBeTruthy()
  for (const c of db.clientes) expect(db.userById(c.userId)).toBeTruthy()
})

test('identidade: empresa tem shape de tenant e atualizarEmpresa grava', () => {
  expect(db.userById(db.empresa.ownerUserId)).toBeTruthy()
  expect(db.empresa.slug).toBeTruthy()
  db.atualizarEmpresa({ nome: 'Barbearia Z' })
  expect(db.empresa.nome).toBe('Barbearia Z')
})

test('identidade: memberships — um por user, com o papel correspondente', () => {
  expect(db.memberships.length).toBe(8)
  expect(db.memberships.find((m) => m.userId === 'u-dono')?.role).toBe('dono')
  expect(db.memberships.filter((m) => m.role === 'cliente').length).toBe(4)
})

test('multiunidade: seed tem 2 filiais e cada profissional pertence a uma filial existente', () => {
  expect(db.filiais.length).toBe(2)
  for (const p of db.profissionais) expect(db.filialById(p.filialId)).toBeTruthy()
  for (const a of db.agendamentos) expect(db.filialById(a.filialId)).toBeTruthy()
})

test('multiunidade: horário/grade saíram da empresa para a filial', () => {
  expect('gradeMin' in db.empresa).toBe(false)
  expect([15, 30, 60]).toContain(db.filiais[0].gradeMin)
  expect(db.filiais[0].abertura).toMatch(/^\d{2}:\d{2}$/)
})
