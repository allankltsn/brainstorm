import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { BarsChart } from '@/components/ui/bars-chart'

const data = [
  { month: 'Jan', value: 120 },
  { month: 'Feb', value: 210 },
  { month: 'Mar', value: 90 },
]

describe('BarsChart', () => {
  it('is a function export', () => {
    expect(typeof BarsChart).toBe('function')
  })

  it('mounts without throwing', () => {
    const { container } = render(
      <div style={{ width: 600, height: 300 }}>
        <BarsChart data={data} xKey="month" yKey="value" label="Value" />
      </div>
    )

    // recharts does not draw in jsdom (0-size); only assert it mounted.
    expect(container.firstChild).toBeTruthy()
    expect(container.querySelector('[data-slot="chart"]')).not.toBeNull()
  })
})
