import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

describe('Tooltip aura-ui', () => {
  it('renderiza o trigger', () => {
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>Oi</TooltipTrigger>
          <TooltipContent>Dica</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    )
    const trigger = screen.getByText('Oi')
    expect(trigger).toBeInTheDocument()
    expect(trigger).toHaveAttribute('data-slot', 'tooltip-trigger')
  })
})
