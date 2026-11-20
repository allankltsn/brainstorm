import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ModelRouter, type ModelOption } from '@/components/ui/model-router'

const models: ModelOption[] = [
  {
    id: 'aura-fast',
    name: 'Aura Fast',
    score: 72,
    cost: '$',
    latency: '~0.4s',
  },
  {
    id: 'aura-pro',
    name: 'Aura Pro',
    score: 94,
    cost: '$$$',
    latency: '~1.8s',
    selected: true,
  },
]

describe('model-router aura-ui', () => {
  it('monta com a requisição e todos os modelos', () => {
    const { container } = render(
      <ModelRouter request="Resumir contrato jurídico" models={models} />,
    )
    expect(screen.getByText('Resumir contrato jurídico')).toBeInTheDocument()
    expect(screen.getByText('Aura Fast')).toBeInTheDocument()
    expect(screen.getByText('Aura Pro')).toBeInTheDocument()
    expect(
      container.querySelector('[data-slot="model-router"]'),
    ).toBeInTheDocument()
  })

  it('destaca o modelo escolhido com o selo "Escolhido"', () => {
    const { container } = render(<ModelRouter models={models} />)
    expect(screen.getByText('Escolhido')).toBeInTheDocument()
    const selected = container.querySelector('[data-selected="true"]')
    expect(selected).not.toBeNull()
    expect(selected).toHaveTextContent('Aura Pro')
  })
})
