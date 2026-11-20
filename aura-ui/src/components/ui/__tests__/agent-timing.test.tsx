import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AgentTiming, type AgentTimingPhase } from '@/components/ui/agent-timing'

const phases: AgentTimingPhase[] = [
  { id: 'plan', label: 'Planejar', ms: 1200 },
  { id: 'run', label: 'Executar', ms: 800 },
]

describe('AgentTiming aura-ui', () => {
  it('mostra rótulos das fases e a duração formatada', () => {
    render(<AgentTiming phases={phases} />)
    expect(screen.getByText('Planejar')).toBeTruthy()
    expect(screen.getByText('Executar')).toBeTruthy()
    expect(screen.getByText('1.2s')).toBeTruthy()
  })
})
