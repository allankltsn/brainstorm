import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { TraceWaterfall, type TraceSpan } from '@/components/ui/trace-waterfall'

const spans: TraceSpan[] = [
  { id: 'root', label: 'handleRequest', start: 0, duration: 1200 },
  { id: 'db', label: 'db.query', start: 100, duration: 320, depth: 1 },
  { id: 'cache', label: 'cache.get', start: 450, duration: 80, depth: 1, status: 'error' },
]

describe('TraceWaterfall aura-ui', () => {
  it('monta com spans aninhados e um erro', () => {
    render(<TraceWaterfall spans={spans} />)
    expect(screen.getByText('handleRequest')).toBeTruthy()
    expect(screen.getByText('db.query')).toBeTruthy()
    expect(screen.getByText('cache.get')).toBeTruthy()
    expect(screen.getByText('1.2s')).toBeTruthy()
    expect(screen.getByText('320ms')).toBeTruthy()
    expect(screen.getByText('80ms')).toBeTruthy()
  })
})
