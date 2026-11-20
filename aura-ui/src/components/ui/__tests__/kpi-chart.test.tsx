import { render, screen } from "@testing-library/react"
import { beforeAll, describe, expect, it } from "vitest"
import { KpiChart } from "@/components/ui/kpi-chart"

// Sparkline usa useInView (IntersectionObserver). Em jsdom o observer não
// dispara sozinho, então instalamos um polyfill que reporta o alvo como
// visível imediatamente — mantém a renderização determinística.
beforeAll(() => {
  class IO {
    constructor(private cb: IntersectionObserverCallback) {}
    observe(el: Element) {
      this.cb(
        [{ isIntersecting: true, target: el } as IntersectionObserverEntry],
        this as unknown as IntersectionObserver,
      )
    }
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return []
    }
    root = null
    rootMargin = ""
    thresholds = []
  }
  // @ts-expect-error — polyfill mínimo para o ambiente de teste
  globalThis.IntersectionObserver = IO
})

describe("KpiChart", () => {
  it("renderiza rótulo, valor e variação", () => {
    render(
      <KpiChart
        label="Receita"
        value="R$ 48k"
        delta="+12%"
        trend="up"
        data={[3, 5, 4, 7, 6, 9]}
      />,
    )

    expect(screen.getByText("Receita")).toBeInTheDocument()
    expect(screen.getByText("R$ 48k")).toBeInTheDocument()
    expect(screen.getByText("+12%")).toBeInTheDocument()
  })
})
