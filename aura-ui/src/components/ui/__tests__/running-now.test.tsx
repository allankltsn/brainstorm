import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { RunningNow } from "../running-now"

describe("RunningNow", () => {
  it("renders the agent, step and elapsed time", () => {
    render(
      <RunningNow
        agent="Codador"
        step="Editando registry.json"
        elapsed="00:42"
      />
    )

    const el = screen
      .getByText("Codador")
      .closest("[data-slot='running-now']")
    expect(el).toBeInTheDocument()
    expect(el).toHaveAttribute("data-status", "running")

    expect(screen.getByText("Codador")).toBeInTheDocument()
    expect(screen.getByText("Editando registry.json")).toBeInTheDocument()
    expect(screen.getByText("00:42")).toBeInTheDocument()
  })
})
