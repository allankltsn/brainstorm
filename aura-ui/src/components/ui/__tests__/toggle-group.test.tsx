import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

describe('toggle-group aura-ui', () => {
  it('renderiza o item do grupo', () => {
    render(
      <ToggleGroup type="single">
        <ToggleGroupItem value="a">A</ToggleGroupItem>
      </ToggleGroup>,
    )
    expect(screen.getByText('A')).toBeInTheDocument()
  })
})
