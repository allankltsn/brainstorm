import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { BreakdownChart, type BreakdownSegment } from '@/components/ui/breakdown-chart'

const segments: BreakdownSegment[] = [
  { id: 'a', label: 'Mensal', value: 50 },
  { id: 'b', label: 'Trimestral', value: 30 },
  { id: 'c', label: 'Anual', value: 20 },
]

describe('BreakdownChart aura-ui', () => {
  it('monta sem erro com dados mínimos', () => {
    const { container } = render(<BreakdownChart segments={segments} />)
    expect(container.firstChild).toBeTruthy()
  })

  it('mostra todos os rótulos e as porcentagens', () => {
    render(<BreakdownChart segments={segments} title="Planos" />)
    expect(screen.getByText('Mensal')).toBeTruthy()
    expect(screen.getByText('Trimestral')).toBeTruthy()
    expect(screen.getByText('Anual')).toBeTruthy()
    // total = 100, então 50 -> 50%, 30 -> 30%, 20 -> 20%
    expect(screen.getByText('50%')).toBeTruthy()
    expect(screen.getByText('30%')).toBeTruthy()
    expect(screen.getByText('20%')).toBeTruthy()
  })
})
