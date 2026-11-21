import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SignupScreen } from '@/components/blocks/signup-screen'

describe('signup-screen aura-ui', () => {
  it('mostra o título "Criar conta" e os campos Nome e E-mail', () => {
    render(<SignupScreen />)

    const titulo = screen.getByText('Criar conta', { selector: '[data-slot="card-title"]' })
    expect(titulo).toBeInTheDocument()

    expect(screen.getByText('Nome')).toBeInTheDocument()
    expect(screen.getByText('E-mail')).toBeInTheDocument()
  })

  it('renderiza a raiz com data-slot e repassa className', () => {
    const { container } = render(<SignupScreen className="custom-x" />)
    const root = container.querySelector('[data-slot="signup-screen"]')

    expect(root).not.toBeNull()
    expect(root).toHaveClass('custom-x')
  })
})
