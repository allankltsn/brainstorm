import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { TrendChart, type TrendSeries } from '@/components/ui/trend-chart'

const series: TrendSeries[] = [
  { key: 'revenue', label: 'Receita' },
  { key: 'target', label: 'Meta', muted: true, dashed: true },
]

const data = [
  { month: 'Jan', revenue: 120, target: 100 },
  { month: 'Feb', revenue: 150, target: 110 },
  { month: 'Mar', revenue: 90, target: 120 },
]

describe('TrendChart', () => {
  it('renders without throwing inside a sized wrapper', () => {
    const { container } = render(
      <div style={{ width: 640, height: 320 }}>
        <TrendChart
          data={data}
          xKey="month"
          series={series}
          area
          reference={{ y: 110, label: 'Meta' }}
        />
      </div>
    )

    expect(container.firstChild).toBeTruthy()
    expect(container.querySelector('[data-slot="chart"]')).not.toBeNull()
  })
})
