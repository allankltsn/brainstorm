import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import {
  FallbackChain,
  type FallbackChainLink,
} from '@/components/ui/fallback-chain'

describe('FallbackChain', () => {
  it('renderiza a cadeia e destaca o elo que atendeu', () => {
    const links: FallbackChainLink[] = [
      { id: '1', label: 'Modelo primário', status: 'failed' },
      { id: '2', label: 'Modelo reserva', status: 'failed' },
      { id: '3', label: 'Modelo local', status: 'ok' },
    ]

    render(<FallbackChain links={links} />)

    expect(screen.getByText('Modelo primário')).toBeInTheDocument()
    expect(screen.getByText('Modelo reserva')).toBeInTheDocument()
    expect(screen.getByText('Modelo local')).toBeInTheDocument()

    expect(
      document.querySelector('[data-slot="fallback-chain"]'),
    ).not.toBeNull()

    const okLink = document.querySelector(
      '[data-slot="fallback-chain-link"][data-status="ok"]',
    )
    expect(okLink).not.toBeNull()
    expect(okLink).toHaveTextContent('Atendeu')
  })
})
