import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import {
  ApprovalGates,
  type ApprovalGate,
} from '@/components/ui/approval-gates'

const gates: ApprovalGate[] = [
  { id: 'lint', label: 'Lint e testes', status: 'approved', approver: 'CI' },
  { id: 'review', label: 'Revisão de código', status: 'pending' },
  { id: 'deploy', label: 'Deploy em produção', status: 'pending' },
]

describe('approval-gates aura-ui', () => {
  it('renderiza os rótulos de todos os gates', () => {
    render(<ApprovalGates gates={gates} />)
    expect(screen.getByText('Lint e testes')).toBeInTheDocument()
    expect(screen.getByText('Revisão de código')).toBeInTheDocument()
    expect(screen.getByText('Deploy em produção')).toBeInTheDocument()
  })

  it('aprova o primeiro gate pendente chamando onApprove com o id', () => {
    const onApprove = vi.fn()
    render(<ApprovalGates gates={gates} onApprove={onApprove} />)

    fireEvent.click(screen.getByRole('button', { name: 'Aprovar' }))

    expect(onApprove).toHaveBeenCalledTimes(1)
    expect(onApprove).toHaveBeenCalledWith('review')
  })
})
