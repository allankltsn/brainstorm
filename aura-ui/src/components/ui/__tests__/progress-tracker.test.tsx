import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ProgressTracker, type ProgressStep } from '@/components/ui/progress-tracker'

describe('ProgressTracker', () => {
  it('renderiza o rastreador com todos os passos', () => {
    const steps: ProgressStep[] = [
      { id: '1', label: 'Criar conta', done: true },
      { id: '2', label: 'Convidar aluno' },
      { id: '3', label: 'Montar treino' },
    ]

    render(<ProgressTracker title="Primeiros passos" steps={steps} />)

    expect(screen.getByText('Criar conta')).toBeInTheDocument()
    expect(screen.getByText('Convidar aluno')).toBeInTheDocument()
    expect(screen.getByText('Montar treino')).toBeInTheDocument()
    expect(
      document.querySelector('[data-slot="progress-tracker"]'),
    ).not.toBeNull()
  })
})
