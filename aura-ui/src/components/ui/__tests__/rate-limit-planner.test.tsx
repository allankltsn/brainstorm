import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { RateLimitPlanner } from '@/components/ui/rate-limit-planner'

describe('rate-limit-planner aura-ui', () => {
  it('renderiza limites com uso vs cap e alerta perto do limite', () => {
    const { container } = render(
      <RateLimitPlanner
        limits={[
          { id: 'req', label: 'Requisições', used: 90, cap: 100, unit: 'req' },
          { id: 'tok', label: 'Tokens', used: 20, cap: 100, unit: 'k' },
        ]}
      />,
    )

    expect(screen.getByText('Requisições')).toBeInTheDocument()
    expect(screen.getByText('Tokens')).toBeInTheDocument()
    expect(screen.getByText(/90 \/ 100 req/)).toBeInTheDocument()
    expect(screen.getByText(/20 \/ 100 k/)).toBeInTheDocument()
    expect(screen.getByText('Atenção')).toBeInTheDocument()
    expect(
      container.querySelector('[data-slot="rate-limit-planner"]'),
    ).toBeInTheDocument()
  })
})
