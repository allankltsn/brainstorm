import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ChangeSummary, type MetricChange } from '@/components/ui/change-summary'

describe('ChangeSummary', () => {
  it('renderiza o resumo com rotulo, valor e slot', () => {
    const changes: MetricChange[] = [
      { label: 'Treinos concluidos', change: 'Subiu 6,1% para 18,2K', tone: 'good' },
    ]

    render(<ChangeSummary title="O que mudou" period="Esta semana" changes={changes} />)

    expect(screen.getByText('Treinos concluidos')).toBeInTheDocument()
    expect(screen.getByText('Subiu 6,1% para 18,2K')).toBeInTheDocument()
    expect(screen.getByText('O que mudou')).toBeInTheDocument()
    expect(document.querySelector('[data-slot="change-summary"]')).not.toBeNull()
  })
})
