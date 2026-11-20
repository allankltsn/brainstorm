import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { CompactBreakdown } from '@/components/ui/compact-breakdown'

describe('compact-breakdown aura-ui', () => {
  it('renderiza os rótulos dos segmentos e o data-slot', () => {
    const { container } = render(
      <CompactBreakdown
        label="Uso por categoria"
        segments={[
          { id: 'a', label: 'Documentos', value: 70 },
          { id: 'b', label: 'Imagens', value: 30 },
        ]}
      />,
    )
    expect(screen.getByText('Documentos')).toBeInTheDocument()
    expect(screen.getByText('Imagens')).toBeInTheDocument()
    expect(
      container.querySelector('[data-slot="compact-breakdown"]'),
    ).toBeInTheDocument()
  })
})
