import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AgentHandoff } from '@/components/ui/agent-handoff'

describe('AgentHandoff', () => {
  it('renderiza os repasses entre agentes', () => {
    render(
      <AgentHandoff
        handoffs={[
          {
            id: '1',
            from: 'Planner',
            to: 'Coder',
            task: 'Implementar o componente',
            at: '10:00',
          },
          {
            id: '2',
            from: 'Coder',
            to: 'Reviewer',
            task: 'Revisar o código',
            at: '10:30',
          },
        ]}
      />,
    )

    expect(screen.getByText('Planner')).toBeInTheDocument()
    expect(screen.getAllByText('Coder')).toHaveLength(2)
    expect(screen.getByText('Reviewer')).toBeInTheDocument()
    expect(screen.getByText('Implementar o componente')).toBeInTheDocument()
    expect(screen.getByText('Revisar o código')).toBeInTheDocument()
    expect(
      document.querySelector('[data-slot="agent-handoff"]'),
    ).not.toBeNull()
  })
})
