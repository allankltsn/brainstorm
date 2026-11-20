import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

describe('Dialog', () => {
  it('renderiza o conteúdo quando aberto por padrão', () => {
    render(
      <Dialog defaultOpen>
        <DialogTrigger>Abrir</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar</DialogTitle>
            <DialogDescription>Esta ação não pode ser desfeita.</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>,
    )
    const title = screen.getByText('Confirmar')
    expect(title).toHaveAttribute('data-slot', 'dialog-title')
    expect(screen.getByText('Esta ação não pode ser desfeita.')).toBeInTheDocument()
  })
})
