import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { ContextWindow } from "@/components/ui/context-window"

describe("ContextWindow", () => {
  it("renders the label and formatted token counts", () => {
    const { container } = render(
      <ContextWindow used={120000} total={200000} />
    )

    expect(screen.getByText("Contexto")).toBeInTheDocument()
    expect(screen.getByText(/120\.000/)).toBeInTheDocument()
    expect(screen.getByText(/200\.000/)).toBeInTheDocument()
    expect(
      container.querySelector('[data-slot="context-window"]')
    ).not.toBeNull()
  })
})
