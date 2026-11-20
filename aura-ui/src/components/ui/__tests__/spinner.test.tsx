import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { Spinner } from "../spinner"

describe("Spinner", () => {
  it("renders with the status role and spinner data-slot", () => {
    render(<Spinner />)

    const el = screen.getByRole("status")
    expect(el).toBeInTheDocument()
    expect(el).toHaveAttribute("data-slot", "spinner")
  })
})
