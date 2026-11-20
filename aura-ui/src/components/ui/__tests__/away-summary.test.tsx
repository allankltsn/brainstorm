import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AwaySummary, type AwaySummaryItem } from '@/components/ui/away-summary'

describe('AwaySummary', () => {
  it('renderiza o titulo e todos os itens', () => {
    const items: AwaySummaryItem[] = [
      { id: '1', label: '3 novos comentarios', count: 3, kind: 'comment' },
      { id: '2', label: 'Voce foi mencionado', count: 1, kind: 'mention' },
      { id: '3', label: '2 commits enviados', count: 2, kind: 'commit' },
    ]

    render(<AwaySummary since="desde ontem" items={items} />)

    expect(screen.getByText('Enquanto você esteve fora')).toBeInTheDocument()
    expect(screen.getByText('3 novos comentarios')).toBeInTheDocument()
    expect(screen.getByText('Voce foi mencionado')).toBeInTheDocument()
    expect(screen.getByText('2 commits enviados')).toBeInTheDocument()
    expect(document.querySelector('[data-slot="away-summary"]')).not.toBeNull()
  })
})
