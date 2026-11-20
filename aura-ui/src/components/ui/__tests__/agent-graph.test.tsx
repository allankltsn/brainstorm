import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AgentGraph } from '@/components/ui/agent-graph'

describe('AgentGraph', () => {
  it('renderiza os nós do grafo', () => {
    render(
      <AgentGraph
        nodes={[
          { id: 'plan', label: 'Planejar', status: 'done' },
          { id: 'code', label: 'Codar', status: 'running' },
          { id: 'test', label: 'Testar', status: 'idle' },
        ]}
        edges={[
          { from: 'plan', to: 'code' },
          { from: 'code', to: 'test' },
        ]}
      />,
    )

    expect(screen.getByText('Planejar')).toBeInTheDocument()
    expect(screen.getByText('Codar')).toBeInTheDocument()
    expect(screen.getByText('Testar')).toBeInTheDocument()
    expect(document.querySelector('[data-slot="agent-graph"]')).not.toBeNull()
  })
})
