import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import {
  NotificationStack,
  type Notice,
} from '@/components/ui/notification-stack'

const notices: Notice[] = [
  { id: 'n1', title: 'Novo aviso', text: 'Seu treino foi atualizado.' },
]

describe('notification-stack aura-ui', () => {
  it('monta e renderiza o texto do aviso', () => {
    const { container } = render(<NotificationStack notices={notices} />)
    expect(screen.getByText('Novo aviso')).toBeInTheDocument()
    expect(screen.getByText('Seu treino foi atualizado.')).toBeInTheDocument()
    expect(
      container.querySelector('[data-slot="notification-stack"]'),
    ).toBeInTheDocument()
  })
})
