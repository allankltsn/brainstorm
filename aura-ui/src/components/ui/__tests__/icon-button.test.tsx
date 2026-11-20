import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { IconButton } from '@/components/ui/icon-button'

describe('icon-button aura-ui', () => {
  it('renderiza botão com aria-label e data-slot', () => {
    render(
      <IconButton label="Fechar">
        <span>x</span>
      </IconButton>,
    )
    const button = screen.getByRole('button', { name: 'Fechar' })
    expect(button).toBeInTheDocument()
    expect(button).toHaveAttribute('data-slot', 'icon-button')
  })
})
