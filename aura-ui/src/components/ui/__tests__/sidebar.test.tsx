import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import {
  Sidebar,
  SidebarContent,
  SidebarProvider,
} from '@/components/ui/sidebar'

window.matchMedia = window.matchMedia ||
  function matchMedia() {
    return {
      matches: false,
      media: '',
      onchange: null,
      addListener() {},
      removeListener() {},
      addEventListener() {},
      removeEventListener() {},
      dispatchEvent() {
        return false
      },
    } as unknown as MediaQueryList
  }

describe('sidebar aura-ui', () => {
  it('renderiza a estrutura básica da sidebar', () => {
    const { container } = render(
      <SidebarProvider>
        <Sidebar>
          <SidebarContent />
        </Sidebar>
      </SidebarProvider>,
    )
    expect(
      container.querySelector('[data-slot="sidebar-wrapper"]'),
    ).toBeTruthy()
  })
})
