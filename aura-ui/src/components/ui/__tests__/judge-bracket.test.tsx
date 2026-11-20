import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { JudgeBracket } from '@/components/ui/judge-bracket'

describe('JudgeBracket', () => {
  it('renderiza um match com as duas respostas', () => {
    render(
      <JudgeBracket
        rounds={[
          {
            id: 'r1',
            matches: [
              { id: 'm1', a: 'Resposta A', b: 'Resposta B', winner: 'a' },
            ],
          },
        ]}
      />,
    )

    expect(screen.getAllByText('Resposta A').length).toBeGreaterThan(0)
    expect(screen.getByText('Resposta B')).toBeInTheDocument()
    expect(document.querySelector('[data-slot="judge-bracket"]')).not.toBeNull()
  })
})
