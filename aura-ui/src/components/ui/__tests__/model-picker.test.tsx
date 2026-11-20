import { render, screen } from '@testing-library/react'
import { beforeAll, describe, expect, it } from 'vitest'
import { ModelPicker } from '@/components/ui/model-picker'

beforeAll(() => {
  if (!window.matchMedia) {
    window.matchMedia = ((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    })) as unknown as typeof window.matchMedia
  }
})

describe('ModelPicker', () => {
  it('renderiza o trigger com o texto padrão', () => {
    render(
      <ModelPicker
        models={[
          { id: 'opus', label: 'Opus 4.8', provider: 'Anthropic' },
          { id: 'sonnet', label: 'Sonnet 5.5' },
        ]}
      />,
    )

    const trigger = screen.getByText('Escolher modelo')
    expect(trigger).toHaveAttribute('data-slot', 'model-picker')
  })
})
