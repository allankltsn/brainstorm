import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AgentConsole } from '@/components/blocks/agent-console'

describe('AgentConsole', () => {
  it('renderiza o título e um agente da frota', () => {
    render(<AgentConsole />)

    expect(screen.getByText('Console de agentes')).toBeInTheDocument()
    expect(screen.getByText('Agente de Conteúdo')).toBeInTheDocument()
    expect(
      document.querySelector('[data-slot="agent-console"]'),
    ).not.toBeNull()
  })
})
