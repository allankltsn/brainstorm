import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ReviewCenter, type ReviewItem } from '@/components/ui/review-center'

describe('review-center aura-ui', () => {
  const items: ReviewItem[] = [
    {
      id: 'r1',
      title: 'Adicionar fluxo de convite do aluno',
      author: 'Ana Souza',
      status: 'pending',
    },
    {
      id: 'r2',
      title: 'Atualizar documentação da API',
      author: 'Bruno Lima',
      status: 'approved',
      reviewer: 'Carla',
    },
  ]

  it('renderiza os títulos, um status e dispara onReview no item pendente', () => {
    const onReview = vi.fn()
    render(<ReviewCenter items={items} onReview={onReview} />)

    expect(
      screen.getByText('Adicionar fluxo de convite do aluno'),
    ).toBeInTheDocument()
    expect(
      screen.getByText('Atualizar documentação da API'),
    ).toBeInTheDocument()
    expect(screen.getAllByText('Aprovado').length).toBeGreaterThan(0)

    fireEvent.click(screen.getByRole('button', { name: 'Revisar' }))
    expect(onReview).toHaveBeenCalledTimes(1)
    expect(onReview).toHaveBeenCalledWith('r1')
  })
})
