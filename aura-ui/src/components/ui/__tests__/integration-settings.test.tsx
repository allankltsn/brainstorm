import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { IntegrationSettings } from '@/components/ui/integration-settings'

describe('integration-settings aura-ui', () => {
  it('renderiza o nome e os rótulos dos campos e dispara onChange ao alternar o switch', () => {
    const onChange = vi.fn()

    render(
      <IntegrationSettings
        name="Slack"
        onChange={onChange}
        fields={[
          {
            id: 'notifications',
            label: 'Notificações',
            type: 'toggle',
            value: false,
          },
          {
            id: 'webhook',
            label: 'Webhook URL',
            type: 'text',
            value: 'https://example.com',
          },
        ]}
      />
    )

    expect(screen.getByText('Slack')).toBeInTheDocument()
    expect(screen.getByText('Notificações')).toBeInTheDocument()
    expect(screen.getByText('Webhook URL')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('switch'))

    expect(onChange).toHaveBeenCalledWith('notifications', true)
  })
})
