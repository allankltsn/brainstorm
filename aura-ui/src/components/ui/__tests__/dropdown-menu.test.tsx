import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

describe('DropdownMenu', () => {
  it('renderiza o trigger com slot', () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Abrir</DropdownMenuTrigger>
      </DropdownMenu>,
    )
    expect(screen.getByText('Abrir')).toHaveAttribute(
      'data-slot',
      'dropdown-menu-trigger',
    )
  })

  it('renderiza o conteúdo e os itens quando aberto por padrão', () => {
    render(
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger>Abrir</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Conta</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Perfil</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    )
    expect(screen.getByText('Perfil')).toHaveAttribute(
      'data-slot',
      'dropdown-menu-item',
    )
  })
})
