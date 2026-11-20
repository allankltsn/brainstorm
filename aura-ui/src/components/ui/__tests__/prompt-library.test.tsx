import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { PromptLibrary } from '@/components/ui/prompt-library'

const prompts = [
  { id: '1', title: 'Resumo de reunião', category: 'Produtividade', text: 'Resuma a reunião a seguir' },
  { id: '2', title: 'Revisão de código', category: 'Dev', text: 'Revise o código abaixo' },
  { id: '3', title: 'E-mail de vendas', category: 'Vendas', text: 'Escreva um e-mail de vendas' },
]

describe('prompt-library aura-ui', () => {
  it('renderiza todos os prompts', () => {
    render(<PromptLibrary prompts={prompts} onUse={vi.fn()} />)
    expect(screen.getByText('Resumo de reunião')).toBeInTheDocument()
    expect(screen.getByText('Revisão de código')).toBeInTheDocument()
    expect(screen.getByText('E-mail de vendas')).toBeInTheDocument()
  })

  it('filtra a lista pela busca', () => {
    render(<PromptLibrary prompts={prompts} onUse={vi.fn()} />)
    fireEvent.change(screen.getByLabelText('Buscar prompts'), {
      target: { value: 'vendas' },
    })
    expect(screen.getByText('E-mail de vendas')).toBeInTheDocument()
    expect(screen.queryByText('Resumo de reunião')).not.toBeInTheDocument()
    expect(screen.queryByText('Revisão de código')).not.toBeInTheDocument()
  })

  it('chama onUse ao clicar em Usar', () => {
    const onUse = vi.fn()
    render(<PromptLibrary prompts={prompts} onUse={onUse} />)
    fireEvent.click(screen.getAllByRole('button', { name: /Usar/ })[0])
    expect(onUse).toHaveBeenCalledWith('1')
  })
})
