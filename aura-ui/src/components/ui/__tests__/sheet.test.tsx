import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

describe('Sheet', () => {
  it('renderiza o conteúdo quando aberto por padrão', () => {
    render(
      <Sheet defaultOpen>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Título do painel</SheetTitle>
            <SheetDescription>Descrição do painel</SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>,
    )
    const title = screen.getByText('Título do painel')
    expect(title).toHaveAttribute('data-slot', 'sheet-title')
    expect(screen.getByText('Descrição do painel')).toBeInTheDocument()
  })
})
