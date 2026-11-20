import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MemoryGraph } from '@/components/ui/memory-graph'

describe('MemoryGraph', () => {
  it('renderiza o grafo com todos os nós e relações', () => {
    render(
      <MemoryGraph
        nodes={[
          { id: 'a', label: 'Usa Rust', kind: 'fact' },
          { id: 'b', label: 'Allan', kind: 'entity' },
          { id: 'c', label: 'Tema escuro', kind: 'preference' },
        ]}
        edges={[
          { from: 'b', to: 'a', label: 'prefere' },
          { from: 'b', to: 'c' },
        ]}
      />,
    )

    expect(screen.getByText('Usa Rust')).toBeInTheDocument()
    expect(screen.getByText('Allan')).toBeInTheDocument()
    expect(screen.getByText('Tema escuro')).toBeInTheDocument()
    expect(document.querySelector('[data-slot="memory-graph"]')).not.toBeNull()
  })
})
