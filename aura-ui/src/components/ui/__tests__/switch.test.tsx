import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Switch } from '@/components/ui/switch'

describe('switch aura-ui', () => {
  it('renderiza com role switch e data-slot', () => {
    const { container } = render(<Switch />)
    expect(screen.getByRole('switch')).toBeInTheDocument()
    expect(container.querySelector('[data-slot="switch"]')).toBeInTheDocument()
  })
})
