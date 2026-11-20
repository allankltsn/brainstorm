import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { NumberInput } from '@/components/ui/number-input'

describe('number-input aura-ui', () => {
  it('incrementa o valor ao clicar em Aumentar', () => {
    render(<NumberInput defaultValue={2} min={0} max={5} />)

    const input = screen.getByRole('spinbutton') as HTMLInputElement
    expect(input.value).toBe('2')

    fireEvent.click(screen.getByRole('button', { name: 'Aumentar' }))

    expect(input.value).toBe('3')
  })
})
