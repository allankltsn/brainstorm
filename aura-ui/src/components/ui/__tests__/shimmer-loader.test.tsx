import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { ShimmerSkeleton, ShimmerText } from "../shimmer-loader"

describe("shimmer-loader", () => {
  it("renders ShimmerText children", () => {
    render(<ShimmerText>Carregando</ShimmerText>)
    const text = screen.getByText("Carregando")
    expect(text).toBeInTheDocument()
    expect(text).toHaveAttribute("data-slot", "shimmer-text")
  })

  it("renders a ShimmerSkeleton block", () => {
    const { container } = render(<ShimmerSkeleton className="h-4 w-20" />)
    const skeleton = container.querySelector('[data-slot="shimmer-skeleton"]')
    expect(skeleton).toBeInTheDocument()
    expect(skeleton).toHaveClass("h-4", "w-20")
  })
})
