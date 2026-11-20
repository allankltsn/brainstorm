import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Rating } from '@/components/ui/rating'

describe('rating aura-ui', () => {
  it('renderiza max estrelas e dispara onValueChange ao clicar', () => {
    const onValueChange = vi.fn()
    render(<Rating defaultValue={2} max={5} onValueChange={onValueChange} />)

    const stars = screen.getAllByRole('radio')
    expect(stars).toHaveLength(5)

    fireEvent.click(screen.getByRole('radio', { name: '4 estrelas' }))
    expect(onValueChange).toHaveBeenCalledWith(4)
  })
})
