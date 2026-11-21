import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { LoginScreen } from '@/components/blocks/login-screen'

describe('login-screen aura-ui', () => {
  it('renderiza o título Entrar e o campo de e-mail', () => {
    render(<LoginScreen />)

    const title = screen.getByText('Entrar', { selector: '[data-slot="card-title"]' })
    expect(title).toBeInTheDocument()

    const emailLabel = screen.getByText('E-mail')
    expect(emailLabel).toBeInTheDocument()

    const emailInput = screen.getByRole('textbox')
    expect(emailLabel.getAttribute('for')).toBe(emailInput.getAttribute('id'))
  })
})
