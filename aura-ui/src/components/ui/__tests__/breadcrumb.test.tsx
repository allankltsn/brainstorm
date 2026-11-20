import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from '@/components/ui/breadcrumb'

describe('Breadcrumb', () => {
  it('renderiza lista, item e link', () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Início</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>,
    )

    const link = screen.getByText('Início')
    expect(link).toHaveAttribute('data-slot', 'breadcrumb-link')
    expect(link).toBeInTheDocument()
  })
})
