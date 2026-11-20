import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

describe('select aura-ui', () => {
  it('renderiza o trigger com placeholder sem abrir o portal', () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Escolha" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="a">A</SelectItem>
        </SelectContent>
      </Select>,
    )
    expect(screen.getByRole('combobox')).toBeInTheDocument()
    expect(screen.getByText('Escolha')).toBeInTheDocument()
  })
})
