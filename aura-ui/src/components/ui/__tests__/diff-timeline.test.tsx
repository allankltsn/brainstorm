import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { DiffTimeline } from '@/components/ui/diff-timeline'

describe('DiffTimeline', () => {
  it('renderiza as entradas com rótulos e estatísticas de adições', () => {
    render(
      <DiffTimeline
        entries={[
          {
            id: '1',
            at: '2h atrás',
            label: 'Adiciona componente de timeline',
            added: 42,
            removed: 3,
            author: 'Allan',
          },
          {
            id: '2',
            at: '1h atrás',
            label: 'Corrige espaçamento vertical',
            added: 8,
            removed: 12,
          },
        ]}
      />,
    )

    expect(
      screen.getByText('Adiciona componente de timeline'),
    ).toBeInTheDocument()
    expect(
      screen.getByText('Corrige espaçamento vertical'),
    ).toBeInTheDocument()
    expect(screen.getByText('+42')).toBeInTheDocument()
    expect(document.querySelector('[data-slot="diff-timeline"]')).not.toBeNull()
  })
})
