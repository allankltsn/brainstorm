import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import {
  SmartRecommendation,
  type Recommendation,
} from '@/components/ui/smart-recommendation'

const options: Recommendation[] = [
  {
    id: 'incremental',
    label: 'Sincronização incremental',
    reason: 'Transfere apenas o que mudou desde a última execução.',
    signal: 3,
  },
  {
    id: 'completa',
    label: 'Sincronização completa',
    reason: 'Reenvia todos os dados a cada execução.',
    signal: 1,
  },
]

describe('smart-recommendation aura-ui', () => {
  it('monta com título e razão da recomendação', () => {
    const { container } = render(
      <SmartRecommendation title="Sugestão de sincronização" options={options} />,
    )
    expect(
      screen.getByText('Sugestão de sincronização'),
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        'Transfere apenas o que mudou desde a última execução.',
      ),
    ).toBeInTheDocument()
    expect(
      container.querySelector('[data-slot="smart-recommendation"]'),
    ).toBeInTheDocument()
  })

  it('aceita a recomendação ao clicar em Aplicar', async () => {
    const onAccept = vi.fn()
    render(<SmartRecommendation options={options} onAccept={onAccept} />)
    fireEvent.click(
      screen.getByRole('button', { name: /Aplicar: sincronização incremental/i }),
    )
    expect(onAccept).toHaveBeenCalledWith(options[0])
    expect(screen.getByText(/aplicado/i)).toBeInTheDocument()
  })
})
