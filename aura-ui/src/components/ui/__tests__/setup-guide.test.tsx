import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { SetupGuide, type SetupStep } from '@/components/ui/setup-guide'

describe('SetupGuide', () => {
  it('mostra os passos, a contagem e dispara a ação do passo ativo', () => {
    const steps: SetupStep[] = [
      { id: '1', label: 'Criar conta', done: true },
      { id: '2', label: 'Convidar aluno', actionLabel: 'Convidar' },
      { id: '3', label: 'Montar treino' },
    ]
    const onAction = vi.fn()

    render(<SetupGuide steps={steps} onAction={onAction} />)

    // Todos os rótulos aparecem
    expect(screen.getByText('Criar conta')).toBeInTheDocument()
    expect(screen.getByText('Convidar aluno')).toBeInTheDocument()
    expect(screen.getByText('Montar treino')).toBeInTheDocument()

    // Contagem "1 de 3"
    expect(screen.getByText('1 de 3 concluídos')).toBeInTheDocument()

    // O primeiro passo não concluído ('2') tem o botão de ação
    const button = screen.getByRole('button', { name: 'Convidar' })
    fireEvent.click(button)

    expect(onAction).toHaveBeenCalledTimes(1)
    expect(onAction).toHaveBeenCalledWith('2')
  })
})
