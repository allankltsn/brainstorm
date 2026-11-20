import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ToolCallCard } from '@/components/ui/tool-call-card'

describe('ToolCallCard', () => {
  it('renderiza nome, resultado e o data-slot', () => {
    render(
      <ToolCallCard
        name="search_web"
        status="success"
        args={'{"q":"aura"}'}
        result="2 resultados"
      />,
    )

    expect(screen.getByText('search_web')).toBeInTheDocument()
    expect(screen.getByText('2 resultados')).toBeInTheDocument()
    expect(
      document.querySelector('[data-slot="tool-call-card"]'),
    ).not.toBeNull()
  })
})
