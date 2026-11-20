import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { AgentInbox, type AgentInboxItem } from '@/components/ui/agent-inbox'

describe('agent-inbox aura-ui', () => {
  const items: AgentInboxItem[] = [
    {
      id: 'a1',
      agent: 'Agente de Vendas',
      title: 'Aprovar desconto de 15% para a academia parceira',
      detail: 'O cliente pediu um abatimento acima do limite padrão.',
      kind: 'approval',
    },
  ]

  it('mostra o agente, o título e dispara onResolve ao responder', () => {
    const onResolve = vi.fn()
    render(<AgentInbox items={items} onResolve={onResolve} />)

    expect(screen.getByText('Agente de Vendas')).toBeInTheDocument()
    expect(
      screen.getByText('Aprovar desconto de 15% para a academia parceira'),
    ).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Responder' }))
    expect(onResolve).toHaveBeenCalledWith('a1', 'accept')
  })
})
