import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ChartCard } from '@/components/ui/chart-card'
import { ChartTip } from '@/components/ui/chart-tip'
import { Reveal } from '@/components/ui/reveal'
import { StatCard } from '@/components/ui/stat-card'

describe('charts — extras', () => {
  it('ChartCard mostra rótulo, valor e conteúdo', () => {
    render(
      <ChartCard label="Receita" value="R$ 12k" delta={{ text: '+8%' }}>
        <div>grafico</div>
      </ChartCard>,
    )
    expect(screen.getByText('Receita')).toBeInTheDocument()
    expect(screen.getByText('R$ 12k')).toBeInTheDocument()
    expect(screen.getByText('grafico')).toBeInTheDocument()
  })

  it('StatCard mostra rótulo e valor', () => {
    const { container } = render(<StatCard label="Alunos" value={128} delta={{ text: '+4' }} />)
    expect(screen.getByText('Alunos')).toBeInTheDocument()
    expect(container.querySelector('[data-slot="stat-card"]')).toBeTruthy()
  })

  it('Reveal renderiza os filhos (sem IntersectionObserver no jsdom)', () => {
    render(
      <Reveal className="h-10">
        <span>conteudo</span>
      </Reveal>,
    )
    expect(screen.getByText('conteudo')).toBeInTheDocument()
  })

  it('ChartTip mostra a linha da série quando ativo', () => {
    render(
      <ChartTip
        series={[{ key: 'a', label: 'Série A', color: '#f00' }]}
        format={(v) => String(v)}
        active
        label="Jan"
        payload={[{ dataKey: 'a', value: 42 }]}
      />,
    )
    expect(screen.getByText('Série A')).toBeInTheDocument()
    expect(screen.getByText('42')).toBeInTheDocument()
  })
})
