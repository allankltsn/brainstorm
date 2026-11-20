import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ParallelAttempts } from '@/components/ui/parallel-attempts'

describe('ParallelAttempts', () => {
  it('renderiza todas as tentativas e destaca a melhor', () => {
    render(
      <ParallelAttempts
        title="Tentativas paralelas"
        attempts={[
          { id: '1', label: 'Tentativa A', status: 'done', best: true, result: 'Solução ótima' },
          { id: '2', label: 'Tentativa B', status: 'running' },
          { id: '3', label: 'Tentativa C', status: 'error' },
        ]}
      />,
    )

    expect(screen.getByText('Tentativa A')).toBeInTheDocument()
    expect(screen.getByText('Tentativa B')).toBeInTheDocument()
    expect(screen.getByText('Tentativa C')).toBeInTheDocument()
    expect(screen.getByText('Melhor')).toBeInTheDocument()
    expect(document.querySelector('[data-slot="parallel-attempts"]')).not.toBeNull()
  })
})
