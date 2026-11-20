import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ExperimentCard } from '@/components/ui/experiment-card'

describe('experiment-card aura-ui', () => {
  it('renderiza nome, variantes e o valor do vencedor', () => {
    const { container } = render(
      <ExperimentCard
        name="Novo checkout"
        metric="Taxa de conversão"
        confidence="95%"
        variants={[
          { id: 'a', label: 'Controle', value: '3,1%', delta: '-0,4pp' },
          {
            id: 'b',
            label: 'Variante B',
            value: '4,2%',
            delta: '+1,1pp',
            winner: true,
          },
        ]}
      />,
    )

    expect(screen.getByText('Novo checkout')).toBeInTheDocument()
    expect(screen.getByText('Controle')).toBeInTheDocument()
    expect(screen.getByText('Variante B')).toBeInTheDocument()
    expect(screen.getByText('4,2%')).toBeInTheDocument()
    expect(screen.getByText('Vencedor')).toBeInTheDocument()
    expect(
      container.querySelector('[data-slot="experiment-card"]'),
    ).toBeInTheDocument()
  })
})
