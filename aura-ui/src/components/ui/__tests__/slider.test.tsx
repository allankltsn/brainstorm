import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Slider } from '@/components/ui/slider'

describe('Slider aura-ui', () => {
  it('renderiza thumb com role slider e slot', () => {
    const { container, getAllByRole } = render(
      <Slider defaultValue={[40]} max={100} />
    )
    expect(getAllByRole('slider').length).toBeGreaterThan(0)
    expect(container.querySelector('[data-slot="slider"]')).toBeTruthy()
  })
})
