import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AgentTrail } from '@/components/ui/agent-trail'

describe('AgentTrail', () => {
  it('renderiza a trilha com todos os passos', () => {
    render(
      <AgentTrail
        steps={[
          { id: '1', label: 'Ler o plano', status: 'done' },
          { id: '2', label: 'Escrever código', status: 'active' },
          { id: '3', label: 'Testar', status: 'pending' },
        ]}
      />,
    )

    expect(screen.getByText('Ler o plano')).toBeInTheDocument()
    expect(screen.getByText('Escrever código')).toBeInTheDocument()
    expect(screen.getByText('Testar')).toBeInTheDocument()
    expect(document.querySelector('[data-slot="agent-trail"]')).not.toBeNull()
  })
})
