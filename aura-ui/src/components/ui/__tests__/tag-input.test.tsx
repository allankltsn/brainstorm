import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { TagInput } from '@/components/ui/tag-input'

describe('tag-input aura-ui', () => {
  it('renderiza a tag inicial e adiciona nova ao pressionar Enter', () => {
    const onValueChange = vi.fn()
    render(<TagInput defaultValue={['react']} onValueChange={onValueChange} />)

    expect(screen.getByText('react')).toBeInTheDocument()

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'aura' } })
    fireEvent.keyDown(input, { key: 'Enter' })

    expect(onValueChange).toHaveBeenCalledWith(['react', 'aura'])
  })
})
