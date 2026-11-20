import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AgentFleet, type FleetAgent } from '@/components/ui/agent-fleet'

describe('agent-fleet aura-ui', () => {
  const agents: FleetAgent[] = [
    { id: 'a1', name: 'Scout', status: 'running', task: 'Indexando repo', progress: 42 },
    { id: 'a2', name: 'Builder', status: 'error', task: 'Falha no build' },
  ]

  it('renderiza um card por agente com nome e status', () => {
    render(<AgentFleet agents={agents} />)
    expect(screen.getByText('Scout')).toBeInTheDocument()
    expect(screen.getByText('Builder')).toBeInTheDocument()
    expect(screen.getByText('Em execução')).toBeInTheDocument()
    expect(screen.getByText('Erro')).toBeInTheDocument()
  })

  it('mostra a barra de progresso apenas quando progress é número', () => {
    render(<AgentFleet agents={agents} />)
    expect(screen.getByText('42%')).toBeInTheDocument()
    expect(screen.queryByText('NaN%')).not.toBeInTheDocument()
  })
})
