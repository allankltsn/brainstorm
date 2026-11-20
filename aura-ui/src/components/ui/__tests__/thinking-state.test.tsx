import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { ThinkingState } from "../thinking-state"

describe("ThinkingState", () => {
  it("renders the default label, child text and data-slot", () => {
    render(<ThinkingState>raciocinando sobre o plano…</ThinkingState>)

    const el = screen.getByText("Pensando…").closest("[data-slot='thinking-state']")
    expect(el).toBeInTheDocument()
    expect(el).toHaveAttribute("data-slot", "thinking-state")

    expect(screen.getByText("Pensando…")).toBeInTheDocument()
    expect(screen.getByText("raciocinando sobre o plano…")).toBeInTheDocument()
  })
})
