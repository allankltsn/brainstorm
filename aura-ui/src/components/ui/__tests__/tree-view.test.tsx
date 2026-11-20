import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { TreeView } from '@/components/ui/tree-view'

describe('tree-view aura-ui', () => {
  it('renderiza nós de pasta e arquivo', () => {
    const { container } = render(
      <TreeView
        nodes={[
          {
            id: 'src',
            label: 'src',
            defaultOpen: true,
            children: [{ id: 'a', label: 'App.tsx' }],
          },
        ]}
      />,
    )
    expect(screen.getByText('src')).toBeInTheDocument()
    expect(screen.getByText('App.tsx')).toBeInTheDocument()
    expect(container.querySelector('[data-slot="tree-view"]')).toBeInTheDocument()
  })
})
