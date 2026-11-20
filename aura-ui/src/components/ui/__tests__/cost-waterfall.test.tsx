import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { CostWaterfall, type CostWaterfallStep } from '@/components/ui/cost-waterfall'

const steps: CostWaterfallStep[] = [
  { id: 'a', label: 'Input tokens', amount: 2 },
  { id: 'b', label: 'Output tokens', amount: 1 },
  { id: 'c', label: 'Tools', amount: 0.5 },
]

describe('CostWaterfall aura-ui', () => {
  it('renderiza os rótulos de cada passo', () => {
    render(<CostWaterfall steps={steps} />)
    expect(screen.getByText('Input tokens')).toBeTruthy()
    expect(screen.getByText('Output tokens')).toBeTruthy()
    expect(screen.getByText('Tools')).toBeTruthy()
  })

  it('mostra a linha Total com o total formatado', () => {
    render(<CostWaterfall steps={steps} />)
    expect(screen.getByText('Total')).toBeTruthy()
    expect(screen.getByText('$3.50')).toBeTruthy()
  })
})
