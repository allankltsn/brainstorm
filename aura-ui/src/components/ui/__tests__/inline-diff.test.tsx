import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { InlineDiff, type InlineDiffLine } from '@/components/ui/inline-diff'

const lines: InlineDiffLine[] = [
  { type: 'context', text: 'const total = sum(items)', oldNo: 1, newNo: 1 },
  { type: 'add', text: 'const taxa = total * 0.1', newNo: 2 },
  { type: 'del', text: 'const taxa = total * 0.2', oldNo: 2 },
]

describe('inline-diff aura-ui', () => {
  it('renderiza as linhas de contexto, adicionada e removida', () => {
    render(<InlineDiff lines={lines} filename="caixa.ts" />)
    expect(screen.getByText('const total = sum(items)')).toBeInTheDocument()
    expect(screen.getByText('const taxa = total * 0.1')).toBeInTheDocument()
    expect(screen.getByText('const taxa = total * 0.2')).toBeInTheDocument()
  })
})
