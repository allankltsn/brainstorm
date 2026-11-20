import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
} from '@/components/ui/chart'

describe('Chart', () => {
  it('exports the expected members', () => {
    expect(typeof ChartContainer).toBe('function')
    expect(typeof ChartTooltipContent).toBe('function')
    expect(typeof ChartLegendContent).toBe('function')
    expect(typeof ChartStyle).toBe('function')
    expect(ChartTooltip).toBeDefined()
    expect(ChartLegend).toBeDefined()
  })

  it('renders a container with data-slot="chart"', () => {
    const { container } = render(
      <ChartContainer config={{}}>
        <div />
      </ChartContainer>
    )

    expect(container.querySelector('[data-slot="chart"]')).not.toBeNull()
  })
})
