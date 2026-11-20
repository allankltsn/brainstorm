import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import {
  WritingAssistant,
  type WritingSuggestion,
} from '@/components/ui/writing-assistant'

const suggestions: WritingSuggestion[] = [
  {
    id: 'tom-1',
    type: 'tom',
    before: 'Ei, manda o relatório pra mim.',
    after: 'Você poderia me enviar o relatório, por favor?',
    note: 'Um tom mais formal combina melhor com o contexto.',
  },
  {
    id: 'clareza-1',
    type: 'clareza',
    before: 'A coisa ficou meio estranha ali.',
    after: 'O gráfico apresentou uma queda inesperada no terceiro trimestre.',
  },
]

describe('writing-assistant aura-ui', () => {
  it('mostra o tipo da sugestão e o texto proposto', () => {
    render(<WritingAssistant suggestions={suggestions} />)
    expect(screen.getByText('tom')).toBeInTheDocument()
    expect(
      screen.getByText('Você poderia me enviar o relatório, por favor?'),
    ).toBeInTheDocument()
  })

  it('chama onApply com o id ao clicar em Aplicar', () => {
    const onApply = vi.fn()
    render(<WritingAssistant suggestions={suggestions} onApply={onApply} />)
    const applyButtons = screen.getAllByRole('button', { name: /Aplicar/i })
    fireEvent.click(applyButtons[1])
    expect(onApply).toHaveBeenCalledWith('clareza-1')
  })
})
