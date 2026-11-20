import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'

describe('resizable aura-ui', () => {
  it('renderiza o grupo de painéis', () => {
    const { container } = render(
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={50}>Um</ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={50}>Dois</ResizablePanel>
      </ResizablePanelGroup>,
    )
    expect(
      container.querySelector('[data-slot="resizable-panel-group"]'),
    ).toBeInTheDocument()
  })
})
