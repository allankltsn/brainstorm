import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { AnimatedShinyText } from "../animated-shiny-text"

describe("AnimatedShinyText", () => {
  it("renders its children", () => {
    render(<AnimatedShinyText>Novo</AnimatedShinyText>)
    expect(screen.getByText("Novo")).toBeInTheDocument()
  })
})
