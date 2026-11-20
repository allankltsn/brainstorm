import { test, expect } from 'vitest'
import { db } from './data'

test('mock tem 3 profissionais e serviços com executores válidos', () => {
  expect(db.profissionais.length).toBe(3)
  const ids = new Set(db.profissionais.map((p) => p.id))
  expect(db.servicos.length).toBeGreaterThanOrEqual(6)
  for (const s of db.servicos) {
    expect(s.executores.length).toBeGreaterThan(0)
    for (const e of s.executores) expect(ids.has(e)).toBe(true)
  }
})

test('replaceServicos escreve no db e reflete em servicoById', () => {
  const novo = { id: 's-teste', nome: 'Teste', duracaoMin: 10, precoBRL: 1, categoria: 'x', executores: ['p-rafa'] }
  db.replaceServicos([...db.servicos, novo])
  expect(db.servicoById('s-teste')).toBeTruthy()
  expect(db.servicos.some((s) => s.id === 's-teste')).toBe(true)
})

test('replaceProfissionais escreve no db e reflete em profissionalById', () => {
  const novo = { id: 'p-teste', nome: 'Teste', servicos: [], disponibilidade: [], comissaoPct: 0 }
  db.replaceProfissionais([...db.profissionais, novo])
  expect(db.profissionalById('p-teste')).toBeTruthy()
})
