import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AgentTree, type AgentNode } from '@/components/ui/agent-tree'

describe('agent-tree aura-ui', () => {
  it('renderiza o agente líder e os sub-agentes', () => {
    const root: AgentNode = {
      id: 'lead',
      name: 'Lead Agent',
      role: 'orchestrator',
      status: 'running',
      children: [
        { id: 'c1', name: 'Research Agent', status: 'done' },
        { id: 'c2', name: 'Writer Agent', status: 'idle' },
      ],
    }

    const { container } = render(<AgentTree root={root} />)

    expect(screen.getByText('Lead Agent')).toBeInTheDocument()
    expect(screen.getByText('Research Agent')).toBeInTheDocument()
    expect(screen.getByText('Writer Agent')).toBeInTheDocument()
    expect(
      container.querySelector('[data-slot="agent-tree"]'),
    ).toBeInTheDocument()
  })
})
