import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import {
  SegmentedControl,
  SegmentedControlItem,
} from '@/components/ui/segmented-control'

describe('segmented-control aura-ui', () => {
  it('renderiza itens e alterna o pressionado ao clicar', () => {
    render(
      <SegmentedControl defaultValue="a">
        <SegmentedControlItem value="a">Opção A</SegmentedControlItem>
        <SegmentedControlItem value="b">Opção B</SegmentedControlItem>
      </SegmentedControl>,
    )

    const itemA = screen.getByRole('button', { name: 'Opção A' })
    const itemB = screen.getByRole('button', { name: 'Opção B' })

    expect(itemA).toBeInTheDocument()
    expect(itemB).toBeInTheDocument()
    expect(itemA).toHaveAttribute('aria-pressed', 'true')
    expect(itemB).toHaveAttribute('aria-pressed', 'false')

    fireEvent.click(itemB)

    expect(screen.getByRole('button', { name: 'Opção B' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(screen.getByRole('button', { name: 'Opção A' })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
  })
})
