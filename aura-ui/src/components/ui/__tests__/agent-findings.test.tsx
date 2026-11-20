import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AgentFindings } from '@/components/ui/agent-findings'

describe('AgentFindings', () => {
  it('renderiza os achados com título e severidade', () => {
    render(
      <AgentFindings
        findings={[
          {
            id: '1',
            title: 'Chave de API exposta',
            severity: 'high',
            location: 'src/config.ts:12',
          },
          {
            id: '2',
            title: 'Dependência desatualizada',
            severity: 'low',
            detail: 'A versão instalada está duas major atrás.',
          },
        ]}
      />,
    )

    expect(screen.getByText('Chave de API exposta')).toBeInTheDocument()
    expect(screen.getByText('Dependência desatualizada')).toBeInTheDocument()
    expect(screen.getAllByText('Alto').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Baixo').length).toBeGreaterThan(0)
    expect(
      document.querySelector('[data-slot="agent-findings"]'),
    ).not.toBeNull()
  })
})
