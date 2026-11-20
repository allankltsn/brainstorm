import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'

describe('context-menu aura-ui', () => {
  it('renderiza o trigger com data-slot', () => {
    const { container } = render(
      <ContextMenu>
        <ContextMenuTrigger>Abrir</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>Item</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>,
    )
    expect(
      container.querySelector('[data-slot="context-menu-trigger"]'),
    ).toBeInTheDocument()
  })
})
