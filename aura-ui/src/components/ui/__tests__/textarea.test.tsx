import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Textarea } from '@/components/ui/textarea'

describe('textarea aura-ui', () => {
  it('renderiza com placeholder e data-slot', () => {
    render(<Textarea placeholder="Escreva" />)
    expect(screen.getByPlaceholderText('Escreva')).toHaveAttribute(
      'data-slot',
      'textarea',
    )
  })
})
