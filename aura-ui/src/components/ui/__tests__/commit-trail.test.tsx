import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { CommitTrail } from '@/components/ui/commit-trail'

describe('CommitTrail', () => {
  it('renderiza os commits com mensagem e hash curto', () => {
    render(
      <CommitTrail
        commits={[
          {
            id: '1',
            hash: 'a1b2c3d4e5f6',
            message: 'Adiciona componente CommitTrail',
            author: 'Allan',
            at: '2h atrás',
            added: 120,
            removed: 8,
          },
          {
            id: '2',
            hash: 'f6e5d4c3b2a1',
            message: 'Corrige truncamento da mensagem',
            author: 'Allan',
            at: 'ontem',
          },
        ]}
      />,
    )

    expect(
      screen.getByText('Adiciona componente CommitTrail'),
    ).toBeInTheDocument()
    expect(
      screen.getByText('Corrige truncamento da mensagem'),
    ).toBeInTheDocument()
    expect(screen.getByText('a1b2c3d')).toBeInTheDocument()
    expect(
      document.querySelector('[data-slot="commit-trail"]'),
    ).not.toBeNull()
  })
})
