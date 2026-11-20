import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PlanVsActual, type PlanVsActualRow } from '@/components/ui/plan-vs-actual'

const rows: PlanVsActualRow[] = [
  { id: 'a', label: 'Janeiro', plan: 100, actual: 120 },
  { id: 'b', label: 'Fevereiro', plan: 80, actual: 60 },
]

describe('PlanVsActual aura-ui', () => {
  it('monta sem erro com dados mínimos', () => {
    const { container } = render(<PlanVsActual rows={rows} />)
    expect(container.firstChild).toBeTruthy()
  })

  it('mostra os rótulos das linhas', () => {
    render(<PlanVsActual rows={rows} />)
    expect(screen.getByText('Janeiro')).toBeTruthy()
    expect(screen.getByText('Fevereiro')).toBeTruthy()
  })

  it('mostra os valores de plano e real de cada linha', () => {
    render(<PlanVsActual rows={rows} />)
    // Linha "Janeiro": plano 100, real 120
    expect(screen.getByText('100')).toBeTruthy()
    expect(screen.getByText('120')).toBeTruthy()
  })
})
