import { render } from '@testing-library/react'
import { beforeAll, describe, expect, it } from 'vitest'
import { Calendar } from '@/components/ui/calendar'

beforeAll(() => {
  window.matchMedia ||= ((q: string) => ({
    matches: false,
    media: q,
    onchange: null,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
    dispatchEvent() {
      return false
    },
  })) as any
})

describe('calendar aura-ui', () => {
  it('renderiza com data-slot', () => {
    const { container } = render(<Calendar mode="single" />)
    expect(
      container.querySelector('[data-slot="calendar"]'),
    ).toBeInTheDocument()
  })
})
