import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MessageActions, MessageText } from '@/components/ui/message-actions'

describe('message-actions aura-ui', () => {
  beforeEach(() => {
    // navigator.clipboard não existe no jsdom – stub para o Copiar.
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn(() => Promise.resolve()) },
    })
  })

  it('renderiza a barra com os botões de ação', () => {
    const { container } = render(<MessageActions text="Olá" onCopy={vi.fn()} />)

    expect(
      container.querySelector('[data-slot="message-actions"]'),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Copiar texto' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Gerar outra versão' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Gostei' })).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Não gostei' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Ouvir em voz alta' }),
    ).toBeInTheDocument()
  })

  it('copia o texto e dispara onCopy', () => {
    const onCopy = vi.fn()
    render(<MessageActions text="Olá mundo" onCopy={onCopy} />)

    fireEvent.click(screen.getByRole('button', { name: 'Copiar texto' }))

    expect(onCopy).toHaveBeenCalledWith('Olá mundo')
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('Olá mundo')
  })

  it('marca feedback positivo via onFeedback', () => {
    const onFeedback = vi.fn()
    render(<MessageActions onFeedback={onFeedback} />)

    const up = screen.getByRole('button', { name: 'Gostei' })
    fireEvent.click(up)

    expect(onFeedback).toHaveBeenCalledWith('up')
    // o botão é remontado pelo tooltip ao mudar de estado; re-consulta o pressionado
    expect(screen.getByRole('button', { pressed: true })).toBeInTheDocument()
  })

  it('MessageText renderiza o conteúdo', () => {
    render(<MessageText version={1}>Olá</MessageText>)
    expect(screen.getByText('Olá')).toBeInTheDocument()
  })
})
