import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import {
  AgentRouter,
  type AgentCandidate,
} from '@/components/ui/agent-router'

const candidates: AgentCandidate[] = [
  {
    id: 'pesquisa',
    name: 'Agente de Pesquisa',
    score: 92,
    selected: true,
    reason: 'Melhor afinidade com buscas em múltiplos arquivos.',
  },
  {
    id: 'redacao',
    name: 'Agente de Redação',
    score: 54,
    reason: 'Bom para texto, fraco para busca.',
  },
]

describe('agent-router aura-ui', () => {
  it('mostra o pedido e os candidatos', () => {
    const { container } = render(
      <AgentRouter
        request="Encontre onde a autenticação é validada."
        candidates={candidates}
      />,
    )
    expect(
      screen.getByText('Encontre onde a autenticação é validada.'),
    ).toBeInTheDocument()
    expect(screen.getByText('Agente de Pesquisa')).toBeInTheDocument()
    expect(screen.getByText('Agente de Redação')).toBeInTheDocument()
    expect(
      container.querySelector('[data-slot="agent-router"]'),
    ).toBeInTheDocument()
  })

  it('destaca o candidato escolhido', () => {
    const { container } = render(<AgentRouter candidates={candidates} />)
    expect(screen.getByText('Escolhido')).toBeInTheDocument()
    expect(
      container.querySelector('[data-selected="true"]'),
    ).toBeInTheDocument()
  })
})
