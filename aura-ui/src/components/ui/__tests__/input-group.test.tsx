import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
} from '@/components/ui/input-group'

describe('input-group aura-ui', () => {
  it('renderiza root com addon e input', () => {
    const { container } = render(
      <InputGroup>
        <InputGroupInput placeholder="Buscar" />
        <InputGroupAddon>@</InputGroupAddon>
      </InputGroup>,
    )
    expect(
      container.querySelector('[data-slot="input-group"]'),
    ).toBeInTheDocument()
  })
})
