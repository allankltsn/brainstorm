import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { DecisionInbox, type Decision } from '@/components/ui/decision-inbox'

describe('decision-inbox aura-ui', () => {
  const decisions: Decision[] = [
    {
      id: 'd1',
      title: 'Aprovar pagamento ao fornecedor',
      detail: 'R$ 1.284 para a academia parceira',
      primary: 'Aprovar',
      secondary: 'Recusar',
    },
  ]

  it('renderiza o título da decisão e o slot', () => {
    const { container } = render(<DecisionInbox decisions={decisions} />)
    expect(
      screen.getByText('Aprovar pagamento ao fornecedor'),
    ).toBeInTheDocument()
    expect(
      container.querySelector('[data-slot="decision-inbox"]'),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Aprovar' }),
    ).toBeInTheDocument()
  })
})
