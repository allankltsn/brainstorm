import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Checkbox } from '@/components/ui/checkbox'

describe('checkbox aura-ui', () => {
  it('renderiza com role checkbox e data-slot', () => {
    const { container } = render(<Checkbox />)
    expect(screen.getByRole('checkbox')).toBeInTheDocument()
    expect(container.querySelector('[data-slot="checkbox"]')).toBeInTheDocument()
  })
})
