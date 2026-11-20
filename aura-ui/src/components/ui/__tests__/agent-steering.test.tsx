import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { AgentSteering } from '@/components/ui/agent-steering'

describe('agent-steering aura-ui', () => {
  it('chama onSteer com o texto digitado ao clicar em Enviar', () => {
    const onSteer = vi.fn()
    render(<AgentSteering onSteer={onSteer} suggestions={['Seja mais conciso']} />)

    const textarea = screen.getByPlaceholderText('Oriente o agente…')
    fireEvent.change(textarea, { target: { value: 'Foque no bug de login' } })
    fireEvent.click(screen.getByRole('button', { name: 'Enviar' }))

    expect(onSteer).toHaveBeenCalledWith('Foque no bug de login')
  })

  it('chama onSteer ao clicar em um chip de sugestão', () => {
    const onSteer = vi.fn()
    render(<AgentSteering onSteer={onSteer} suggestions={['Seja mais conciso']} />)

    fireEvent.click(screen.getByRole('button', { name: 'Seja mais conciso' }))

    expect(onSteer).toHaveBeenCalledWith('Seja mais conciso')
  })
})
