import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { DecisionTree, type DecisionNode } from '@/components/ui/decision-tree'

describe('decision-tree aura-ui', () => {
  it('renderiza condição e desfechos das ramificações', () => {
    const node: DecisionNode = {
      id: 'root',
      label: 'Cliente é VIP?',
      children: [
        {
          id: 'yes',
          label: 'Aplicar desconto',
          branchLabel: 'Sim',
          outcome: true,
          chosen: true,
        },
        {
          id: 'no',
          label: 'Preço padrão',
          branchLabel: 'Não',
          outcome: true,
        },
      ],
    }

    const { container } = render(<DecisionTree node={node} />)

    expect(screen.getByText('Cliente é VIP?')).toBeInTheDocument()
    expect(screen.getByText('Aplicar desconto')).toBeInTheDocument()
    expect(screen.getByText('Preço padrão')).toBeInTheDocument()
    expect(
      container.querySelector('[data-slot="decision-tree"]'),
    ).toBeInTheDocument()
    expect(
      container.querySelector('[data-slot="decision-tree-node"][data-chosen]'),
    ).toBeInTheDocument()
  })
})
