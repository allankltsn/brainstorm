import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { RepoMap } from '@/components/ui/repo-map'

describe('repo-map aura-ui', () => {
  it('renderiza a raiz e os filhos, com marcador de alteração', () => {
    const { container } = render(
      <RepoMap
        root={{
          id: 'src',
          name: 'src',
          kind: 'dir',
          children: [
            { id: 'app', name: 'App.tsx', kind: 'file', change: 'modified', lines: 42 },
            { id: 'index', name: 'index.ts', kind: 'file' },
          ],
        }}
      />,
    )
    expect(screen.getByText('src')).toBeInTheDocument()
    expect(screen.getByText('App.tsx')).toBeInTheDocument()
    expect(screen.getByText('index.ts')).toBeInTheDocument()
    expect(container.querySelector('[data-slot="repo-map"]')).toBeInTheDocument()
  })
})
