import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ModelUsage, type ModelUsageItem } from '@/components/ui/model-usage'

const models: ModelUsageItem[] = [
  { id: 'opus', name: 'Opus', tokens: 3200, cost: '$0.48' },
  { id: 'haiku', name: 'Haiku', tokens: 800, cost: '$0.02' },
]

describe('ModelUsage aura-ui', () => {
  it('mostra os nomes dos modelos e um valor de tokens formatado', () => {
    render(<ModelUsage models={models} />)
    expect(screen.getByText('Opus')).toBeTruthy()
    expect(screen.getByText('Haiku')).toBeTruthy()
    expect(screen.getByText('3.2k')).toBeTruthy()
  })
})
