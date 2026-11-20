import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ChatComposer } from '@/components/ui/chat-composer'

describe('chat-composer aura-ui', () => {
  it('chama onSubmit com o texto ao clicar em enviar', () => {
    const onSubmit = vi.fn()
    render(<ChatComposer onSubmit={onSubmit} />)

    const textarea = screen.getByPlaceholderText('Pergunte à Aura…')
    fireEvent.change(textarea, { target: { value: 'Olá Aura' } })
    fireEvent.click(screen.getByRole('button', { name: 'Enviar' }))

    expect(onSubmit).toHaveBeenCalledWith('Olá Aura')
  })
})
