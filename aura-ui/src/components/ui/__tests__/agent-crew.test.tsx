import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AgentCrew, type AgentCrewMember } from '@/components/ui/agent-crew'

describe('AgentCrew', () => {
  it('renderiza o líder e os executores da equipe', () => {
    const members: AgentCrewMember[] = [
      { id: '1', name: 'Ana Lima', role: 'lead', status: 'running' },
      { id: '2', name: 'Bruno Souza', role: 'worker', status: 'idle' },
      { id: '3', name: 'Carla Dias', role: 'worker', status: 'done' },
    ]

    render(<AgentCrew members={members} />)

    expect(screen.getByText('Ana Lima')).toBeInTheDocument()
    expect(screen.getByText('Bruno Souza')).toBeInTheDocument()
    expect(screen.getByText('Carla Dias')).toBeInTheDocument()
    expect(screen.getByText('Líder')).toBeInTheDocument()
  })
})
