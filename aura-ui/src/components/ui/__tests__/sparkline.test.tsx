import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Sparkline } from '@/components/ui/sparkline'

describe('Sparkline', () => {
  it('exports a Sparkline component', () => {
    expect(typeof Sparkline).toBe('function')
  })

  it('mounts with a minimal numeric data array without throwing', () => {
    // recharts/SVG may not fully draw in jsdom; only assert the wrapper mounts.
    const { container } = render(<Sparkline data={[1, 4, 2, 8, 5, 9, 3]} />)

    expect(container.firstChild).not.toBeNull()
  })
})
