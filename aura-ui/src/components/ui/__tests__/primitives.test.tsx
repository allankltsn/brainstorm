import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Alert, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'

describe('primitivos aura-ui', () => {
  it('Button renderiza com slot e variante', () => {
    render(<Button variant="secondary">Oi</Button>)
    const b = screen.getByRole('button', { name: 'Oi' })
    expect(b).toHaveAttribute('data-slot', 'button')
    expect(b).toHaveAttribute('data-variant', 'secondary')
  })

  it('Badge renderiza', () => {
    render(<Badge>B</Badge>)
    expect(screen.getByText('B')).toHaveAttribute('data-slot', 'badge')
  })

  it('Card renderiza o conteúdo', () => {
    render(
      <Card>
        <CardContent>Conteúdo</CardContent>
      </Card>,
    )
    expect(screen.getByText('Conteúdo')).toBeInTheDocument()
  })

  it('Input tem slot', () => {
    render(<Input placeholder="digite" />)
    expect(screen.getByPlaceholderText('digite')).toHaveAttribute('data-slot', 'input')
  })

  it('Label tem slot', () => {
    render(<Label>Nome</Label>)
    expect(screen.getByText('Nome')).toHaveAttribute('data-slot', 'label')
  })

  it('Separator renderiza', () => {
    const { container } = render(<Separator />)
    expect(container.querySelector('[data-slot="separator"]')).toBeTruthy()
  })

  it('Skeleton renderiza', () => {
    const { container } = render(<Skeleton />)
    expect(container.querySelector('[data-slot="skeleton"]')).toBeTruthy()
  })

  it('Alert tem role alert', () => {
    render(
      <Alert>
        <AlertTitle>Título</AlertTitle>
      </Alert>,
    )
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })
})
