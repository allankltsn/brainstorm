import { render } from '@testing-library/react'
import { beforeAll, describe, expect, it } from 'vitest'
import { Toaster } from '@/components/ui/sonner'

beforeAll(() => {
  if (!window.matchMedia) {
    window.matchMedia = (query: string) =>
      ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      }) as unknown as MediaQueryList
  }
})

describe('Toaster aura-ui', () => {
  it('monta sem lançar erro', () => {
    const { container } = render(<Toaster />)
    expect(container).toBeInTheDocument()
  })
})
