import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { AiPrompt } from '@/components/ui/ai-prompt'

describe('ai-prompt aura-ui', () => {
  it('renderiza o campo e uma sugestão, e submete ao clicar na sugestão', () => {
    const onSubmit = vi.fn()
    render(<AiPrompt suggestions={['Resumir o plano']} onSubmit={onSubmit} />)

    expect(screen.getByPlaceholderText('Peça algo à Aura…')).toBeInTheDocument()

    const chip = screen.getByRole('button', { name: 'Resumir o plano' })
    expect(chip).toBeInTheDocument()

    fireEvent.click(chip)
    expect(onSubmit).toHaveBeenCalledWith('Resumir o plano')
  })
})
