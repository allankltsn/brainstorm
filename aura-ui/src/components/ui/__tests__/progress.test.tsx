import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Progress } from '@/components/ui/progress'

describe('Progress aura-ui', () => {
  it('renderiza com slot progress', () => {
    const { container } = render(<Progress value={60} />)
    expect(container.querySelector('[data-slot="progress"]')).toBeTruthy()
  })
})