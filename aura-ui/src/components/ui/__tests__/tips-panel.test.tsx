import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { TipsPanel, type Tip } from '@/components/ui/tips-panel'

describe('tips-panel aura-ui', () => {
  it('monta e renderiza a dica informada', () => {
    const tips: Tip[] = [
      {
        id: 'atalhos',
        title: 'Use atalhos',
        description: 'Agilize sua navegação',
        action: 'Ativar',
      },
    ]

    const { container } = render(<TipsPanel tips={tips} />)

    expect(container.querySelector('[data-slot="tips-panel"]')).toBeInTheDocument()
    expect(screen.getByText('Use atalhos')).toBeInTheDocument()
    expect(screen.getByText('Agilize sua navegação')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Ativar' })).toBeInTheDocument()
  })
})
