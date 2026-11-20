import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { RootCauseTree, type CauseNode } from '@/components/ui/root-cause-tree'

describe('root-cause-tree aura-ui', () => {
  it('renderiza causa, efeito e destaca a causa raiz', () => {
    const node: CauseNode = {
      id: 'efeito',
      label: 'Entrega atrasou',
      children: [
        {
          id: 'causa',
          label: 'Build quebrou na CI',
          children: [
            {
              id: 'raiz',
              label: 'Dependência sem versão fixada',
              isRootCause: true,
            },
          ],
        },
      ],
    }

    const { container } = render(<RootCauseTree node={node} />)

    expect(screen.getByText('Entrega atrasou')).toBeInTheDocument()
    expect(screen.getByText('Build quebrou na CI')).toBeInTheDocument()
    expect(
      screen.getByText('Dependência sem versão fixada'),
    ).toBeInTheDocument()
    expect(screen.getByText('Causa raiz')).toBeInTheDocument()
    expect(
      container.querySelector('[data-slot="root-cause-tree"]'),
    ).toBeInTheDocument()
    expect(
      container.querySelector('[data-root-cause="true"]'),
    ).toBeInTheDocument()
  })
})
