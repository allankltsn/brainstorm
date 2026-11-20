import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { Marquee } from "../marquee"

describe("Marquee", () => {
  it("renders its children", () => {
    render(
      <Marquee>
        <span>a</span>
      </Marquee>
    )

    expect(screen.getAllByText("a").length).toBeGreaterThan(0)
  })
})
