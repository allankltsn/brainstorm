import '@testing-library/jest-dom'

// Polyfills para jsdom (Radix/cmdk usam APIs que o jsdom não implementa).
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver ??= ResizeObserverStub as unknown as typeof ResizeObserver

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
