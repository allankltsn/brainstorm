import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { AgentWorkbench } from '@/components/ui/agent-workbench'

describe('AgentWorkbench', () => {
  it('mostra o agente, a tool call e chama onStop ao clicar em Parar', () => {
    const onStop = vi.fn()

    render(
      <AgentWorkbench
        agent={{ name: 'Pesquisador', model: 'opus-4', status: 'running' }}
        currentAction="Lendo arquivos"
        toolCalls={[{ id: 'tc1', name: 'search_web', status: 'running' }]}
        onStop={onStop}
      />,
    )

    expect(screen.getByText('Pesquisador')).toBeInTheDocument()
    expect(screen.getByText('search_web')).toBeInTheDocument()
    expect(
      document.querySelector('[data-slot="agent-workbench"]'),
    ).not.toBeNull()

    fireEvent.click(screen.getByText('Parar'))
    expect(onStop).toHaveBeenCalledTimes(1)
  })
})
