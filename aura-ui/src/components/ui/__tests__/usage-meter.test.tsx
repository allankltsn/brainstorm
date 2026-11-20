import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { UsageMeter } from '@/components/ui/usage-meter'

describe('usage-meter aura-ui', () => {
  it('renderiza label, valor formatado e data-slot', () => {
    const { container } = render(
      <UsageMeter value={8} max={10} label="Armazenamento" unit="GB" />,
    )
    expect(screen.getByText('Armazenamento')).toBeInTheDocument()
    expect(screen.getByText(/8 \/ 10 GB/)).toBeInTheDocument()
    expect(
      container.querySelector('[data-slot="usage-meter"]'),
    ).toBeInTheDocument()
  })
})
