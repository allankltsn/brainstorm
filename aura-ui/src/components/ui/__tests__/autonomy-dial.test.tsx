import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { AutonomyDial } from '@/components/ui/autonomy-dial'

describe('autonomy-dial aura-ui', () => {
  it('renderiza os níveis e emite o valor ao selecionar', () => {
    const onValueChange = vi.fn()

    render(
      <AutonomyDial defaultValue="supervised" onValueChange={onValueChange} />,
    )

    expect(screen.getByRole('radio', { name: 'Manual' })).toBeInTheDocument()
    expect(
      screen.getByRole('radio', { name: 'Supervisionado' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'Autônomo' })).toBeInTheDocument()

    expect(
      screen.getByRole('radio', { name: 'Supervisionado' }),
    ).toHaveAttribute('aria-checked', 'true')

    fireEvent.click(screen.getByRole('radio', { name: 'Autônomo' }))

    expect(onValueChange).toHaveBeenCalledWith('autonomous')
    expect(screen.getByRole('radio', { name: 'Autônomo' })).toHaveAttribute(
      'aria-checked',
      'true',
    )
  })
})
