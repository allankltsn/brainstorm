import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { CodeBlock } from '@/components/ui/code-block'

const writeText = vi.fn()

beforeEach(() => {
  writeText.mockReset()
  Object.assign(navigator, {
    clipboard: { writeText },
  })
})

describe('code-block aura-ui', () => {
  it('renderiza o código e o botão de copiar', () => {
    render(<CodeBlock code="const a = 1" language="ts" />)
    expect(screen.getByText('const a = 1')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Copiar código' }),
    ).toBeInTheDocument()
  })

  it('copia o código ao clicar', () => {
    render(<CodeBlock code="const a = 1" language="ts" />)
    fireEvent.click(screen.getByRole('button', { name: 'Copiar código' }))
    expect(writeText).toHaveBeenCalledWith('const a = 1')
  })
})
