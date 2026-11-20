import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty-state'

describe('Empty', () => {
  it('renderiza o estado vazio com titulo e slot', () => {
    render(
      <Empty>
        <EmptyHeader>
          <EmptyTitle>Nenhum aluno</EmptyTitle>
          <EmptyDescription>Convide seu primeiro aluno.</EmptyDescription>
        </EmptyHeader>
      </Empty>,
    )

    const title = screen.getByText('Nenhum aluno')
    expect(title).toBeInTheDocument()
    expect(title).toHaveAttribute('data-slot', 'empty-title')
    expect(document.querySelector('[data-slot="empty"]')).not.toBeNull()
  })
})
