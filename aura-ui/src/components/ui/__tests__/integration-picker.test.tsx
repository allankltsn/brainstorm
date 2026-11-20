import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { IntegrationPicker } from '@/components/ui/integration-picker'

describe('integration-picker aura-ui', () => {
  it('renderiza integrações e conecta a desconectada', () => {
    const onConnect = vi.fn()
    render(
      <IntegrationPicker
        integrations={[
          { id: 'github', name: 'GitHub' },
          { id: 'slack', name: 'Slack', connected: true },
        ]}
        onConnect={onConnect}
      />,
    )

    expect(screen.getByText('GitHub')).toBeInTheDocument()
    expect(screen.getByText('Slack')).toBeInTheDocument()
    expect(screen.getByText('Conectado')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Conectar' }))
    expect(onConnect).toHaveBeenCalledWith('github')
  })
})
