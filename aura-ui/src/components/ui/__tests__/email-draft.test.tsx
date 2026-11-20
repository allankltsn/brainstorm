import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { EmailDraft } from '@/components/ui/email-draft'

describe('email-draft aura-ui', () => {
  it('mostra o assunto e chama onSend com os valores atuais ao clicar em enviar', () => {
    const onSend = vi.fn()
    render(
      <EmailDraft
        to="aluno@exemplo.com"
        subject="Seu treino desta semana"
        body="Olá! Segue o plano."
        onSend={onSend}
      />
    )

    expect(screen.getByDisplayValue('Seu treino desta semana')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Enviar' }))

    expect(onSend).toHaveBeenCalledTimes(1)
    expect(onSend).toHaveBeenCalledWith(
      expect.objectContaining({ subject: 'Seu treino desta semana' })
    )
  })
})
