import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { StepperForm, type StepperFormStep } from '@/components/ui/stepper-form'

describe('StepperForm', () => {
  const steps: StepperFormStep[] = [
    { id: '1', label: 'Dados', content: <p>Conteúdo do passo um</p> },
    { id: '2', label: 'Plano', content: <p>Conteúdo do passo dois</p> },
    { id: '3', label: 'Revisão', content: <p>Conteúdo do passo três</p> },
  ]

  it('avança pelos passos (não controlado) e conclui', () => {
    const onFinish = vi.fn()

    render(<StepperForm steps={steps} onFinish={onFinish} />)

    // Os rótulos de todos os passos aparecem no indicador
    expect(screen.getByText('Dados')).toBeInTheDocument()
    expect(screen.getByText('Plano')).toBeInTheDocument()
    expect(screen.getByText('Revisão')).toBeInTheDocument()

    // O conteúdo do primeiro passo é exibido
    expect(screen.getByText('Conteúdo do passo um')).toBeInTheDocument()
    expect(
      document.querySelector('[data-slot="stepper-form"]'),
    ).not.toBeNull()

    // Avança duas vezes até o último passo
    fireEvent.click(screen.getByText('Avançar'))
    fireEvent.click(screen.getByText('Avançar'))

    // O conteúdo do último passo é exibido e "Concluir" aparece
    expect(screen.getByText('Conteúdo do passo três')).toBeInTheDocument()
    expect(screen.getByText('Concluir')).toBeInTheDocument()

    // Concluir dispara onFinish
    fireEvent.click(screen.getByText('Concluir'))
    expect(onFinish).toHaveBeenCalledTimes(1)
  })
})
