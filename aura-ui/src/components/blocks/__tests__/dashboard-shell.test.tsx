import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { DashboardShell } from '@/components/blocks/dashboard-shell'

describe('DashboardShell', () => {
  it('renderiza o título, um item de navegação e o conteúdo', () => {
    render(
      <DashboardShell title="Painel">
        <div>conteúdo de teste</div>
      </DashboardShell>
    )

    expect(screen.getByText('Painel')).toBeInTheDocument()
    expect(screen.getByText('Agentes')).toBeInTheDocument()
    expect(screen.getByText('conteúdo de teste')).toBeInTheDocument()
  })

  it('usa o título padrão e o placeholder quando sem props', () => {
    render(<DashboardShell />)

    expect(screen.getByText('Visão geral')).toBeInTheDocument()
    expect(screen.getByText('Conteúdo da página')).toBeInTheDocument()
  })
})
