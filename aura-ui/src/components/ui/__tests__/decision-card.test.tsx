import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import {
  DecisionCard,
  type DecisionOption,
} from '@/components/ui/decision-card'

const options: DecisionOption[] = [
  {
    id: 'incremental',
    label: 'Sincronização incremental',
    pros: ['Transfere apenas o que mudou desde a última execução.'],
    recommended: true,
  },
  {
    id: 'completa',
    label: 'Sincronização completa',
    cons: ['Reenvia todos os dados a cada execução.'],
  },
]

describe('decision-card aura-ui', () => {
  it('monta com título, opções e selo de recomendação', () => {
    render(
      <DecisionCard
        title="Como sincronizar os dados?"
        question="Escolha a estratégia de sincronização."
        options={options}
      />,
    )
    expect(screen.getByText('Como sincronizar os dados?')).toBeInTheDocument()
    expect(screen.getByText('Sincronização incremental')).toBeInTheDocument()
    expect(screen.getByText('Sincronização completa')).toBeInTheDocument()
    expect(screen.getByText('Recomendado')).toBeInTheDocument()
    expect(
      screen.getByText(
        'Transfere apenas o que mudou desde a última execução.',
      ),
    ).toBeInTheDocument()
  })

  it('chama onChoose com o id da opção ao clicar em Escolher', () => {
    const onChoose = vi.fn()
    render(
      <DecisionCard
        title="Como sincronizar os dados?"
        options={options}
        onChoose={onChoose}
      />,
    )
    const buttons = screen.getAllByRole('button', { name: 'Escolher' })
    expect(buttons).toHaveLength(2)
    fireEvent.click(buttons[0])
    expect(onChoose).toHaveBeenCalledWith('incremental')
    fireEvent.click(buttons[1])
    expect(onChoose).toHaveBeenCalledWith('completa')
  })
})
