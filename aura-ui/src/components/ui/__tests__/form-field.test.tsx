import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import {
  FormControl,
  FormDescription,
  FormField,
  FormLabel,
} from '@/components/ui/form-field'

describe('form-field aura-ui', () => {
  it('conecta label e controle pelo id', () => {
    render(
      <FormField>
        <FormLabel>E-mail</FormLabel>
        <FormControl>
          <input />
        </FormControl>
        <FormDescription>obrigatório</FormDescription>
      </FormField>,
    )

    const label = screen.getByText('E-mail')
    const input = screen.getByRole('textbox')

    expect(label).toBeInTheDocument()
    expect(label.getAttribute('for')).toBe(input.getAttribute('id'))
    expect(input.getAttribute('id')).toBeTruthy()

    const field = screen.getByText('E-mail').closest('[data-slot="form-field"]')
    expect(field).not.toBeNull()
  })
})
