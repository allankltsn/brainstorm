import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command'

describe('command aura-ui', () => {
  it('renderiza item dentro do grupo', () => {
    render(
      <Command>
        <CommandInput placeholder="Buscar" />
        <CommandList>
          <CommandEmpty>Nada encontrado</CommandEmpty>
          <CommandGroup heading="Ações">
            <CommandItem>Novo arquivo</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>,
    )
    expect(screen.getByText('Novo arquivo')).toBeInTheDocument()
  })
})
