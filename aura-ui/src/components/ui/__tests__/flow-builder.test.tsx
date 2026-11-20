import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { FlowBuilder } from '@/components/ui/flow-builder'

describe('FlowBuilder', () => {
  it('renderiza os nós conectados por uma aresta', () => {
    render(
      <FlowBuilder
        nodes={[
          { id: 'a', label: 'Novo lead', type: 'trigger', x: 0, y: 0 },
          { id: 'b', label: 'Enviar e-mail', type: 'action', x: 200, y: 0 },
        ]}
        edges={[{ from: 'a', to: 'b' }]}
      />,
    )

    expect(screen.getByText('Novo lead')).toBeInTheDocument()
    expect(screen.getByText('Enviar e-mail')).toBeInTheDocument()
    expect(document.querySelector('[data-slot="flow-builder"]')).not.toBeNull()
  })
})
