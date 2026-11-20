import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AgentCursors } from '@/components/ui/agent-cursors'

describe('AgentCursors', () => {
  it('renderiza os nomes dos cursores', () => {
    render(
      <AgentCursors
        cursors={[
          { id: 'a', name: 'Agente Alfa', x: 10, y: 20 },
          { id: 'b', name: 'Agente Beta', x: 60, y: 70, color: '#f00' },
        ]}
      />,
    )
    expect(screen.getByText('Agente Alfa')).toBeInTheDocument()
    expect(screen.getByText('Agente Beta')).toBeInTheDocument()
  })
})
