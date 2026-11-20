import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { BillingSchedule } from '@/components/ui/billing-schedule'

describe('BillingSchedule', () => {
  it('renderiza os itens com rótulos, valores e status', () => {
    render(
      <BillingSchedule
        items={[
          {
            id: '1',
            date: '01/11',
            label: 'Mensalidade Novembro',
            amount: 'R$ 120,00',
            status: 'paid',
          },
          {
            id: '2',
            date: '01/12',
            label: 'Mensalidade Dezembro',
            amount: 'R$ 120,00',
            status: 'upcoming',
          },
        ]}
      />,
    )

    expect(screen.getByText('Mensalidade Novembro')).toBeInTheDocument()
    expect(screen.getByText('Mensalidade Dezembro')).toBeInTheDocument()
    expect(screen.getAllByText('R$ 120,00').length).toBeGreaterThanOrEqual(2)
    expect(screen.getByText('Pago')).toBeInTheDocument()
    expect(screen.getAllByText('Agendado').length).toBeGreaterThanOrEqual(1)
    expect(
      document.querySelector('[data-slot="billing-schedule"]'),
    ).not.toBeNull()
  })
})
