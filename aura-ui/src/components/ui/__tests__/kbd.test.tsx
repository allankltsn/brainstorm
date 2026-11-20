import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { Kbd } from "../kbd"

describe("Kbd", () => {
  it("renders its text and exposes the kbd data-slot", () => {
    render(<Kbd>Ctrl</Kbd>)

    const el = screen.getByText("Ctrl")
    expect(el).toBeInTheDocument()
    expect(el).toHaveAttribute("data-slot", "kbd")
  })
})
