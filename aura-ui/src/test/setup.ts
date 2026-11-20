import '@testing-library/jest-dom'

// Polyfills para jsdom (Radix/cmdk usam APIs que o jsdom não implementa).
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver ??= ResizeObserverStub as unknown as typeof ResizeObserver

class IntersectionObserverStub {
  root = null
  rootMargin = ""
  thresholds = []
  // biome-ignore lint: test stub
  cb: (entries: unknown[], obs: unknown) => void
  constructor(cb: (entries: unknown[], obs: unknown) => void) {
    this.cb = cb
  }
  observe(el: Element) {
    // Reporta "visível" na hora, para componentes com useInView mostrarem o conteúdo nos testes.
    this.cb?.([{ isIntersecting: true, intersectionRatio: 1, target: el }], this)
  }
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return []
  }
}
globalThis.IntersectionObserver ??= IntersectionObserverStub as unknown as typeof IntersectionObserver

if (typeof window !== 'undefined') {
  window.matchMedia ??= ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
    dispatchEvent() {
      return false
    },
  })) as unknown as typeof window.matchMedia

  // cmdk e alguns componentes chamam scrollIntoView, ausente no jsdom.
  window.Element.prototype.scrollIntoView ??= function () {}
}
