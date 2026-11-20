import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ScheduledRuns } from '@/components/ui/scheduled-runs'

const runs = [
  {
    id: 'weekly',
    label: 'Resumo semanal',
    schedule: '0 9 * * 1',
    nextRun: 'seg 09:00',
    enabled: false,
  },
  {
    id: 'daily',
    label: 'Varredura diária',
    schedule: '0 6 * * *',
    nextRun: 'ter 06:00',
    enabled: true,
  },
]

describe('scheduled-runs aura-ui', () => {
  it('renderiza labels e o schedule de cada execução', () => {
    render(<ScheduledRuns runs={runs} onToggle={vi.fn()} />)
    expect(screen.getByText('Resumo semanal')).toBeInTheDocument()
    expect(screen.getByText('Varredura diária')).toBeInTheDocument()
    expect(screen.getByText('0 9 * * 1')).toBeInTheDocument()
  })

  it('chama onToggle com (id, novoValor) ao clicar no primeiro switch', () => {
    const onToggle = vi.fn()
    render(<ScheduledRuns runs={runs} onToggle={onToggle} />)

    const switches = screen.getAllByRole('switch')
    fireEvent.click(switches[0])

    expect(onToggle).toHaveBeenCalledWith('weekly', true)
  })
})
