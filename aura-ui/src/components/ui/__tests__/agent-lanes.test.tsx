import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AgentLanes, type AgentLane } from '@/components/ui/agent-lanes'

describe('agent-lanes aura-ui', () => {
  const lanes: AgentLane[] = [
    {
      id: 'fila',
      title: 'Fila',
      items: [
        { id: 'a', label: 'Revisar plano', agent: 'planner' },
        { id: 'b', label: 'Escrever testes' },
      ],
    },
    {
      id: 'pronto',
      title: 'Pronto',
      items: [],
    },
  ]

  it('renderiza títulos das raias, itens e placeholder vazio', () => {
    const { container } = render(<AgentLanes lanes={lanes} />)

    expect(screen.getByText('Fila')).toBeInTheDocument()
    expect(screen.getByText('Pronto')).toBeInTheDocument()
    expect(screen.getByText('Revisar plano')).toBeInTheDocument()
    expect(screen.getByText('Escrever testes')).toBeInTheDocument()
    expect(screen.getByText('Vazio')).toBeInTheDocument()
    expect(
      container.querySelector('[data-slot="agent-lanes"]'),
    ).toBeInTheDocument()
  })
})
