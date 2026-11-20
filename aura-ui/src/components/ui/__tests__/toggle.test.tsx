import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Toggle } from '@/components/ui/toggle'

describe('toggle aura-ui', () => {
  it('renderiza como botão com o texto', () => {
    render(<Toggle aria-label="Negrito">B</Toggle>)
    expect(screen.getByRole('button', { name: 'Negrito' })).toBeInTheDocument()
    expect(screen.getByText('B')).toBeInTheDocument()
  })
})
