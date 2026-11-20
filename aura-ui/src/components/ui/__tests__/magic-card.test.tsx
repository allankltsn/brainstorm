import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"

import { MagicCard } from "../magic-card"

describe("MagicCard", () => {
  it("renders its children", () => {
    render(
      <MagicCard>
        <span>oi</span>
      </MagicCard>
    )
    expect(screen.getByText("oi")).toBeInTheDocument()
  })
})
