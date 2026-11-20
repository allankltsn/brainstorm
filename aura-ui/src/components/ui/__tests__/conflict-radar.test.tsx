import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ConflictRadar } from '@/components/ui/conflict-radar'

describe('ConflictRadar', () => {
  it('renderiza os conflitos com títulos e partes', () => {
    render(
      <ConflictRadar
        conflicts={[
          {
            id: '1',
            title: 'Dois agentes editando README.md',
            severity: 'high',
            location: 'README.md',
            parties: ['Agente A', 'Agente B'],
          },
          {
            id: '2',
            title: 'Divergência de plano',
            severity: 'medium',
          },
        ]}
      />,
    )

    expect(
      screen.getByText('Dois agentes editando README.md'),
    ).toBeInTheDocument()
    expect(screen.getByText('Divergência de plano')).toBeInTheDocument()
    expect(screen.getByText('Agente A')).toBeInTheDocument()
    expect(
      document.querySelector('[data-slot="conflict-radar"]'),
    ).not.toBeNull()
  })
})
