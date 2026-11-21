import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { StatsOverview } from '@/components/blocks/stats-overview'

describe('StatsOverview', () => {
  it('is a function export', () => {
    expect(typeof StatsOverview).toBe('function')
  })

  it('renderiza um KPI e o título do gráfico', () => {
    // O setup de teste faz o IntersectionObserver reportar "visível",
    // então os gráficos montam sem lançar erro.
    render(<StatsOverview />)

    // Rótulo de um dos KPIs do topo
    expect(screen.getByText('Receita')).toBeInTheDocument()

    // Título do card de gráfico
    expect(screen.getByText('Treinos por mês')).toBeInTheDocument()
  })
})
