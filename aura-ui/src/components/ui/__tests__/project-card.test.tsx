import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ProjectCard } from '@/components/ui/project-card'

describe('ProjectCard', () => {
  it('renderiza nome, situação, progresso, métrica e membros', () => {
    const { container } = render(
      <ProjectCard
        name="Aura UI"
        status="active"
        progress={60}
        members={['Allan Klitson', 'Maria Souza']}
        metrics={[{ label: 'Tarefas', value: 12 }]}
      />,
    )

    expect(screen.getByText('Aura UI')).toBeInTheDocument()
    expect(screen.getByText('Ativo')).toBeInTheDocument()
    expect(screen.getByText('12')).toBeInTheDocument()
    expect(screen.getByText('AK')).toBeInTheDocument()
    expect(screen.getByText('MS')).toBeInTheDocument()
    expect(
      container.querySelector('[data-slot="project-card"]'),
    ).toBeInTheDocument()
  })
})
