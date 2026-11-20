import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AgentMonitor } from '@/components/ui/agent-monitor'

describe('AgentMonitor', () => {
  it('renderiza as métricas e os agentes', () => {
    render(
      <AgentMonitor
        metrics={{ active: 3, queued: 2, done: 10, errors: 1 }}
        agents={[{ id: '1', name: 'Indexador', status: 'running' }]}
      />,
    )

    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('10')).toBeInTheDocument()
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('Indexador')).toBeInTheDocument()
    expect(document.querySelector('[data-slot="agent-monitor"]')).not.toBeNull()
  })
})
