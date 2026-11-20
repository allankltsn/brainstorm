import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import {
  AgentSequence,
  type AgentSequenceStep,
} from '@/components/ui/agent-sequence'

describe('AgentSequence', () => {
  it('renderiza todos os agentes da sequência', () => {
    const steps: AgentSequenceStep[] = [
      { id: '1', agent: 'Planejador', action: 'Define o escopo', status: 'done' },
      { id: '2', agent: 'Executor', action: 'Escreve o código', status: 'active' },
      { id: '3', agent: 'Revisor', action: 'Valida o resultado', status: 'pending' },
    ]

    render(<AgentSequence steps={steps} />)

    expect(screen.getByText('Planejador')).toBeInTheDocument()
    expect(screen.getByText('Executor')).toBeInTheDocument()
    expect(screen.getByText('Revisor')).toBeInTheDocument()
    expect(
      document.querySelector('[data-slot="agent-sequence"]'),
    ).not.toBeNull()
  })
})
