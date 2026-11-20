import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { FanOutGrid } from '@/components/ui/fan-out-grid'

describe('FanOutGrid', () => {
  it('renderiza todas as células com seus rótulos', () => {
    render(
      <FanOutGrid
        title="Tentativas paralelas"
        cells={[
          { id: '1', label: 'Worker 1', status: 'done' },
          { id: '2', label: 'Worker 2', status: 'running' },
          { id: '3', label: 'Worker 3', status: 'pending' },
          { id: '4', label: 'Worker 4', status: 'error' },
        ]}
      />,
    )

    expect(screen.getByText('Worker 1')).toBeInTheDocument()
    expect(screen.getByText('Worker 2')).toBeInTheDocument()
    expect(screen.getByText('Worker 3')).toBeInTheDocument()
    expect(screen.getByText('Worker 4')).toBeInTheDocument()
    expect(document.querySelector('[data-slot="fan-out-grid"]')).not.toBeNull()
  })
})
