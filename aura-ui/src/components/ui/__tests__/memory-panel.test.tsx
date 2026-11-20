import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { MemoryPanel, type Memory } from '@/components/ui/memory-panel'

describe('memory-panel aura-ui', () => {
  it('renderiza as memórias e chama onForget com o id correto', () => {
    const memories: Memory[] = [
      {
        id: 'mem-1',
        title: 'Prefere respostas curtas',
        type: 'user',
        detail: 'Confirmado em várias conversas',
      },
      {
        id: 'mem-2',
        title: 'Projeto usa pnpm',
        type: 'project',
        at: 'há 2 dias',
      },
    ]
    const onForget = vi.fn()

    render(<MemoryPanel memories={memories} onForget={onForget} />)

    expect(screen.getByText('Prefere respostas curtas')).toBeInTheDocument()
    expect(screen.getByText('Projeto usa pnpm')).toBeInTheDocument()

    fireEvent.click(
      screen.getByRole('button', { name: 'Esquecer Projeto usa pnpm' })
    )

    expect(onForget).toHaveBeenCalledTimes(1)
    expect(onForget).toHaveBeenCalledWith('mem-2')
  })
})
