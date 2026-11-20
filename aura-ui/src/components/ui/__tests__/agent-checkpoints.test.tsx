import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { AgentCheckpoints } from '@/components/ui/agent-checkpoints'

describe('AgentCheckpoints', () => {
  it('renderiza os checkpoints e restaura o não atual', () => {
    const onRestore = vi.fn()

    render(
      <AgentCheckpoints
        onRestore={onRestore}
        checkpoints={[
          { id: 'cp1', label: 'Plano inicial', at: '10:00' },
          { id: 'cp2', label: 'Execução', at: '10:05', current: true },
        ]}
      />,
    )

    expect(screen.getByText('Plano inicial')).toBeInTheDocument()
    expect(screen.getByText('Execução')).toBeInTheDocument()

    const restoreButtons = screen.getAllByRole('button', { name: /Restaurar/ })
    expect(restoreButtons).toHaveLength(1)

    fireEvent.click(restoreButtons[0])
    expect(onRestore).toHaveBeenCalledWith('cp1')
  })
})
