import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

describe('Table', () => {
  it('renderiza cabeçalho e célula com slots', () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Aluno</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    )
    const cell = screen.getByText('Aluno')
    expect(cell).toBeInTheDocument()
    expect(cell).toHaveAttribute('data-slot', 'table-cell')
    expect(screen.getByText('Nome')).toHaveAttribute('data-slot', 'table-head')
  })
})
