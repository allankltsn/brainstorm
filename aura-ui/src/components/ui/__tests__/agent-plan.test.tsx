import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AgentPlan, type PlanStep } from '@/components/ui/agent-plan'

describe('AgentPlan', () => {
  it('renderiza o plano com todos os passos e subpassos', () => {
    const steps: PlanStep[] = [
      { id: '1', label: 'Analisar requisitos', status: 'done' },
      {
        id: '2',
        label: 'Montar componente',
        status: 'active',
        substeps: [{ id: '2a', label: 'Escrever testes', status: 'pending' }],
      },
      { id: '3', label: 'Publicar na main', status: 'pending' },
    ]

    render(<AgentPlan title="Plano do agente" steps={steps} />)

    expect(screen.getByText('Analisar requisitos')).toBeInTheDocument()
    expect(screen.getByText('Montar componente')).toBeInTheDocument()
    expect(screen.getByText('Escrever testes')).toBeInTheDocument()
    expect(screen.getByText('Publicar na main')).toBeInTheDocument()
    expect(
      document.querySelector('[data-slot="agent-plan"]'),
    ).not.toBeNull()
  })
})
