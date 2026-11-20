import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AgentLedger, type AgentLedgerEntry } from '@/components/ui/agent-ledger'

const entries: AgentLedgerEntry[] = [
  {
    id: '2',
    at: '14:32:10',
    label: 'Chamou a ferramenta de busca',
    kind: 'tool',
    amount: '1.2k tokens',
  },
  {
    id: '1',
    at: '14:31:58',
    label: 'Gerou resposta do modelo',
    kind: 'cost',
    amount: 'R$ 0,04',
  },
]

describe('AgentLedger', () => {
  it('renderiza as entradas com descrição, horário e valor', () => {
    render(<AgentLedger entries={entries} />)

    expect(screen.getByText('Chamou a ferramenta de busca')).toBeInTheDocument()
    expect(screen.getByText('Gerou resposta do modelo')).toBeInTheDocument()
    expect(screen.getByText('14:32:10')).toBeInTheDocument()
    expect(screen.getByText('R$ 0,04')).toBeInTheDocument()
  })

  it('expõe o data-slot na raiz', () => {
    const { container } = render(<AgentLedger entries={entries} />)
    expect(container.querySelector('[data-slot="agent-ledger"]')).not.toBeNull()
  })
})
