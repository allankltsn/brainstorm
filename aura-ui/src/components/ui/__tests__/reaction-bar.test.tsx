import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ReactionBar } from '@/components/ui/reaction-bar'

describe('reaction-bar aura-ui', () => {
  const reactions = [
    { emoji: '👍', count: 3, reacted: true },
    { emoji: '🎉', count: 1 },
  ]

  it('renderiza cada reação com emoji e contagem', () => {
    const { container } = render(
      <ReactionBar reactions={reactions} onReact={vi.fn()} />,
    )

    expect(
      container.querySelector('[data-slot="reaction-bar"]'),
    ).toBeInTheDocument()
    expect(screen.getByText('👍')).toBeInTheDocument()
    expect(screen.getByText('🎉')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('1')).toBeInTheDocument()
  })

  it('chama onReact com o emoji da pílula clicada', () => {
    const onReact = vi.fn()
    render(<ReactionBar reactions={reactions} onReact={onReact} />)

    fireEvent.click(screen.getByRole('button', { name: '🎉 1' }))

    expect(onReact).toHaveBeenCalledTimes(1)
    expect(onReact).toHaveBeenCalledWith('🎉')
  })
})
