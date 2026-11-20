import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { CollaborationStream } from '@/components/ui/collaboration-stream'

describe('CollaborationStream', () => {
  it('renderiza o feed com os colaboradores e suas ações', () => {
    render(
      <CollaborationStream
        events={[
          {
            id: '1',
            actor: 'Ana Silva',
            action: 'editou',
            target: 'botao.tsx',
            at: '10:02',
            kind: 'edit',
          },
          {
            id: '2',
            actor: 'Bruno Costa',
            action: 'comentou em',
            target: 'card.tsx',
            at: '10:05',
            kind: 'comment',
          },
        ]}
      />,
    )

    expect(screen.getByText('Ana Silva')).toBeInTheDocument()
    expect(screen.getByText(/editou/)).toBeInTheDocument()
    expect(screen.getByText('Bruno Costa')).toBeInTheDocument()
    expect(screen.getByText(/comentou em/)).toBeInTheDocument()
    expect(
      document.querySelector('[data-slot="collaboration-stream"]'),
    ).not.toBeNull()
  })
})
