import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ProfileMenu } from '@/components/ui/profile-menu'

describe('ProfileMenu', () => {
  const user = {
    name: 'Ana Silva',
    email: 'ana@exemplo.com',
    plan: 'Pro',
  }

  const items = [
    { id: 'profile', label: 'Perfil' },
    { id: 'settings', label: 'Configurações' },
  ]

  it('mostra o gatilho e, aberto, o nome e os itens', () => {
    render(<ProfileMenu user={user} items={items} onSignOut={vi.fn()} defaultOpen />)

    expect(screen.getByLabelText('Ana Silva')).toBeInTheDocument()
    expect(screen.getAllByText('Ana Silva').length).toBeGreaterThan(0)
    expect(screen.getByText('Perfil')).toBeInTheDocument()
  })

  it('chama onSignOut ao clicar em Sair', () => {
    const onSignOut = vi.fn()
    render(<ProfileMenu user={user} items={items} onSignOut={onSignOut} defaultOpen />)

    fireEvent.click(screen.getByText('Sair'))

    expect(onSignOut).toHaveBeenCalledTimes(1)
  })
})
