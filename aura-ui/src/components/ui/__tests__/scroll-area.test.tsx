import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ScrollArea } from '@/components/ui/scroll-area'

describe('ScrollArea', () => {
  it('renderiza o conteúdo com slot', () => {
    const { container } = render(
      <ScrollArea>
        <div>Conteúdo</div>
      </ScrollArea>,
    )
    expect(screen.getByText('Conteúdo')).toBeInTheDocument()
    expect(container.querySelector('[data-slot="scroll-area"]')).toBeTruthy()
  })
})
