import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { BlurFade } from "../blur-fade"

describe("BlurFade", () => {
  it("renders its children", () => {
    render(
      <BlurFade>
        <span>oi</span>
      </BlurFade>
    )
    expect(screen.getByText("oi")).toBeTruthy()
  })
})
