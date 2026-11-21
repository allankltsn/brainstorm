import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { LandingScreen } from '@/components/blocks/landing-screen'

describe('landing-screen aura-ui', () => {
  it('renderiza a marca e as seções principais sem props', () => {
    render(<LandingScreen />)

    // marca (aparece no nav e no rodapé)
    expect(screen.getAllByText('aura-ui').length).toBeGreaterThan(0)

    // headline do hero
    expect(
      screen.getByText('O design system que você não precisa manter'),
    ).toBeInTheDocument()

    // seção de preços
    expect(
      screen.getByText('Preço simples, sem surpresas'),
    ).toBeInTheDocument()

    // plano recomendado em destaque
    expect(screen.getByText('Recomendado')).toBeInTheDocument()
  })
})
