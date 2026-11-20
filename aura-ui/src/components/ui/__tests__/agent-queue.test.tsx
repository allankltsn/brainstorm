import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AgentQueue } from '@/components/ui/agent-queue'

describe('AgentQueue', () => {
  it('renderiza a fila com todos os itens, posição e prioridade', () => {
    render(
      <AgentQueue
        items={[
          { id: '1', label: 'Indexar repositório', priority: 'high', status: 'running' },
          { id: '2', label: 'Rodar testes', priority: 'normal', eta: '2 min' },
          { id: '3', label: 'Gerar relatório', priority: 'low', status: 'queued' },
        ]}
      />,
    )

    expect(screen.getByText('Indexar repositório')).toBeInTheDocument()
    expect(screen.getByText('Rodar testes')).toBeInTheDocument()
    expect(screen.getByText('Gerar relatório')).toBeInTheDocument()
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('Alta')).toBeInTheDocument()
    expect(document.querySelector('[data-slot="agent-queue"]')).not.toBeNull()
  })
})
