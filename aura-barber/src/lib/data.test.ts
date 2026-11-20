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
