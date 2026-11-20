import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import {
  AgentRecap,
  type AgentRecapAction,
  type AgentRecapStat,
} from '@/components/ui/agent-recap'

describe('AgentRecap', () => {
  it('renderiza o resumo, estatisticas e acoes', () => {
    const stats: AgentRecapStat[] = [
      { label: 'Arquivos', value: 3 },
      { label: 'Tempo', value: '12s' },
    ]
    const actions: AgentRecapAction[] = [
      { id: 'a1', label: 'Criou agent-recap.tsx', status: 'done' },
    ]

    render(
      <AgentRecap
        summary="Executei a tarefa e criei o componente solicitado."
        stats={stats}
        actions={actions}
      />
    )

    expect(
      screen.getByText('Executei a tarefa e criei o componente solicitado.')
    ).toBeInTheDocument()
    expect(screen.getByText('Arquivos')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('Criou agent-recap.tsx')).toBeInTheDocument()
    expect(document.querySelector('[data-slot="agent-recap"]')).not.toBeNull()
  })
})
