import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { PermissionRequest } from '@/components/ui/permission-request'

describe('PermissionRequest', () => {
  it('renderiza o titulo e o botao Permitir quando pendente', () => {
    const onAllow = vi.fn()
    const onDeny = vi.fn()

    render(
      <PermissionRequest
        title="Acessar o repositório"
        scope="Ler arquivos"
        onAllow={onAllow}
        onDeny={onDeny}
      />,
    )

    expect(screen.getByText('Acessar o repositório')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Permitir' }),
    ).toBeInTheDocument()
    expect(
      document.querySelector('[data-slot="permission-request"]'),
    ).not.toBeNull()
  })
})
