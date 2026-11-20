import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ToolAccessMap } from '@/components/ui/tool-access-map'

describe('ToolAccessMap', () => {
  it('renderiza os nomes das ferramentas e os rotulos de acesso', () => {
    render(
      <ToolAccessMap
        tools={[
          { id: 'read', name: 'read_file', access: 'allowed' },
          { id: 'write', name: 'write_file', access: 'ask' },
          { id: 'exec', name: 'run_shell', access: 'denied' },
        ]}
      />,
    )

    expect(screen.getByText('read_file')).toBeInTheDocument()
    expect(screen.getByText('write_file')).toBeInTheDocument()
    expect(screen.getByText('run_shell')).toBeInTheDocument()

    // Rotulos de acesso aparecem na legenda e por ferramenta
    expect(screen.getAllByText('Permitido').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Perguntar').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Negado').length).toBeGreaterThan(0)

    expect(
      document.querySelector('[data-slot="tool-access-map"]'),
    ).not.toBeNull()
  })
})
