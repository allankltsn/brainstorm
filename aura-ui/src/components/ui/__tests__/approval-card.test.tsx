import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ApprovalCard } from '@/components/ui/approval-card'

describe('approval-card aura-ui', () => {
  it('renderiza título e ações quando pendente', () => {
    const onApprove = vi.fn()
    const onReject = vi.fn()
    render(
      <ApprovalCard
        title="Publicar release"
        onApprove={onApprove}
        onReject={onReject}
      />,
    )
    expect(screen.getByText('Publicar release')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Aprovar' })).toBeInTheDocument()
  })

  it('esconde as ações quando aprovado', () => {
    render(<ApprovalCard title="Publicar release" status="approved" />)
    expect(
      screen.queryByRole('button', { name: 'Aprovar' }),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'Recusar' }),
    ).not.toBeInTheDocument()
  })
})
