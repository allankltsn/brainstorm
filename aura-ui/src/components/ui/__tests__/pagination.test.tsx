import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

describe('Pagination', () => {
  it('renderiza a navegação e marca o link ativo com aria-current', () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>
              2
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>,
    )

    const nav = screen.getByRole('navigation', { name: 'pagination' })
    expect(nav).toBeInTheDocument()

    const activeLink = screen.getByText('2')
    expect(activeLink).toHaveAttribute('aria-current', 'page')

    const inactiveLink = screen.getByText('1')
    expect(inactiveLink).not.toHaveAttribute('aria-current')
  })
})
