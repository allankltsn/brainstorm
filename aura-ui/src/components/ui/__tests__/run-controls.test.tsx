import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { RunControls } from '@/components/ui/run-controls'

describe('run-controls aura-ui', () => {
  it('mostra controle de pausa em running e dispara onPause e onStop', () => {
    const onPause = vi.fn()
    const onStop = vi.fn()

    render(
      <RunControls status="running" onPause={onPause} onStop={onStop} />,
    )

    const pause = screen.getByRole('button', { name: 'Pausar' })
    expect(pause).toBeInTheDocument()
    expect(pause).not.toBeDisabled()

    fireEvent.click(pause)
    expect(onPause).toHaveBeenCalledTimes(1)

    fireEvent.click(screen.getByRole('button', { name: 'Parar' }))
    expect(onStop).toHaveBeenCalledTimes(1)
  })
})
