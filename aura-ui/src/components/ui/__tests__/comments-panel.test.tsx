import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import {
  CommentsPanel,
  type PanelComment,
} from '@/components/ui/comments-panel'

describe('comments-panel aura-ui', () => {
  it('lista comentários e resolve o pendente', () => {
    const comments: PanelComment[] = [
      { id: 'c1', author: 'Ana', text: 'Primeiro comentário' },
      {
        id: 'c2',
        author: 'Bruno',
        text: 'Segundo comentário',
        resolved: true,
      },
    ]
    const onResolve = vi.fn()

    const { container } = render(
      <CommentsPanel comments={comments} onResolve={onResolve} />,
    )

    expect(
      container.querySelector('[data-slot="comments-panel"]'),
    ).toBeInTheDocument()
    expect(screen.getByText('Primeiro comentário')).toBeInTheDocument()
    expect(screen.getByText('Segundo comentário')).toBeInTheDocument()

    const resolver = screen.getByRole('button', {
      name: 'Resolver comentário de Ana',
    })
    fireEvent.click(resolver)

    expect(onResolve).toHaveBeenCalledTimes(1)
    expect(onResolve).toHaveBeenCalledWith('c1')
  })
})
