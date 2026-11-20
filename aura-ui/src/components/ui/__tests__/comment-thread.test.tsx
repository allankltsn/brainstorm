import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import {
  CommentThread,
  type ThreadMessage,
} from '@/components/ui/comment-thread'

describe('comment-thread aura-ui', () => {
  it('renderiza a mensagem e o slot', () => {
    const messages: ThreadMessage[] = [
      {
        id: '1',
        author: { name: 'Ana' },
        createdAt: Date.now(),
        text: 'Olá, tudo bem?',
      },
    ]

    const { container } = render(
      <CommentThread messages={messages} currentUser={{ name: 'Ana' }} />,
    )

    expect(screen.getByText('Olá, tudo bem?')).toBeInTheDocument()
    expect(
      container.querySelector('[data-slot="comment-thread"]'),
    ).toBeInTheDocument()
  })
})
