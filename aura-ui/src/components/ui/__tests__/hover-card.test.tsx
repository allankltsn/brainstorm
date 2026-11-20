import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'

describe('hover-card aura-ui', () => {
  it('renderiza o texto do trigger', () => {
    render(
      <HoverCard openDelay={0}>
        <HoverCardTrigger>Oi</HoverCardTrigger>
        <HoverCardContent>Conteúdo</HoverCardContent>
      </HoverCard>,
    )
    expect(screen.getByText('Oi')).toBeInTheDocument()
  })
})
