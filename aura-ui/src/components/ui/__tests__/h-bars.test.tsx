import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { HBars, type HBarRow } from '@/components/ui/h-bars'

const rows: HBarRow[] = [
  { id: 'a', label: 'Segunda', value: 12 },
  { id: 'b', label: 'Terça', sub: '3 turmas', value: 8 },
  { id: 'c', label: 'Quarta', value: 20 },
]

describe('HBars aura-ui', () => {
  it('monta sem erro com dados mínimos', () => {
    const { container } = render(<HBars rows={rows} />)
    expect(container.firstChild).toBeTruthy()
  })
})
