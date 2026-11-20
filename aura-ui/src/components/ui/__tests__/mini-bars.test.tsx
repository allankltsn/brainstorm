import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MiniBars } from '@/components/ui/mini-bars'

describe('MiniBars', () => {
  it('exports the expected members', () => {
    expect(typeof MiniBars).toBe('function')
  })

  it('mounts without throwing', () => {
    const { container } = render(
      <MiniBars data={[1, 4, 2, 8, 5]} label="Receita" format={(v) => `R$ ${v}`} />
    )

    expect(container.firstChild).not.toBeNull()
    expect(container.querySelector('[role="img"]')).not.toBeNull()
  })
})
