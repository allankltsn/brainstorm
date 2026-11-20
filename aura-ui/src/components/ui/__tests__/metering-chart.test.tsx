import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MeteringChart } from '@/components/ui/metering-chart'

const data = [
  { label: 'Seg', value: 120 },
  { label: 'Ter', value: 340 },
  { label: 'Qua', value: 280 },
  { label: 'Qui', value: 460 },
]

describe('MeteringChart', () => {
  it('exports the expected members', () => {
    expect(typeof MeteringChart).toBe('function')
  })

  it('renders the x labels for each data point', () => {
    render(<MeteringChart data={data} cap={400} unit="req" />)

    expect(screen.getByText('Seg')).not.toBeNull()
    expect(screen.getByText('Ter')).not.toBeNull()
    expect(screen.getByText('Qua')).not.toBeNull()
    expect(screen.getByText('Qui')).not.toBeNull()
  })

  it('mounts with the metering-chart slot', () => {
    const { container } = render(<MeteringChart data={data} cap={400} />)

    expect(container.querySelector('[data-slot="metering-chart"]')).not.toBeNull()
    expect(container.querySelector('[data-slot="metering-cap"]')).not.toBeNull()
  })
})
