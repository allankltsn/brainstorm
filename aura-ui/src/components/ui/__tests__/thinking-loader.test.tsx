import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ThinkingLoader } from '@/components/ui/thinking-loader'

describe('thinking-loader aura-ui', () => {
  it('monta com o rótulo da fase inicial', () => {
    const { container } = render(<ThinkingLoader phases={['Pensando']} />)
    expect(
      container.querySelector('[data-slot="thinking-loader"]'),
    ).toBeInTheDocument()
    expect(screen.getByText('Pensando')).toBeInTheDocument()
  })

  it('mostra o rótulo de conclusão quando done', () => {
    render(<ThinkingLoader done doneLabel="Concluído" />)
    expect(screen.getByText('Concluído')).toBeInTheDocument()
  })
})
