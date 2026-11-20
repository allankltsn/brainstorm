import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { DelegateBoard, type DelegateTask } from '@/components/ui/delegate-board'

describe('delegate-board aura-ui', () => {
  const tasks: DelegateTask[] = [
    {
      id: 't1',
      title: 'Revisar proposta do aluno',
      assignee: 'Ana',
      status: 'doing',
    },
    {
      id: 't2',
      title: 'Preparar relatório mensal',
      status: 'todo',
    },
  ]

  it('renderiza títulos, responsável e placeholder de não atribuído', () => {
    const { container } = render(<DelegateBoard tasks={tasks} />)

    expect(screen.getByText('Revisar proposta do aluno')).toBeInTheDocument()
    expect(screen.getByText('Preparar relatório mensal')).toBeInTheDocument()
    expect(screen.getByText('Ana')).toBeInTheDocument()
    expect(screen.getByText('Sem responsável')).toBeInTheDocument()
    expect(
      container.querySelector('[data-slot="delegate-board"]'),
    ).toBeInTheDocument()
  })
})
