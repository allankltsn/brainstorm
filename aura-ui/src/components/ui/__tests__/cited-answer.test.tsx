import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { CitedAnswer } from "@/components/ui/cited-answer"

describe("CitedAnswer", () => {
  it("renders the answer text, inline markers and the sources list", () => {
    const { container } = render(
      <CitedAnswer
        answer="O céu é azul [1] por Rayleigh [2]."
        citations={[
          { id: "a", n: 1, title: "Espalhamento de Rayleigh" },
          { id: "b", n: 2, title: "Óptica atmosférica", url: "https://example.com" },
        ]}
      />
    )

    // Answer words survive the marker split.
    expect(screen.getByText(/O céu é azul/)).toBeInTheDocument()
    expect(screen.getByText(/por Rayleigh/)).toBeInTheDocument()

    // Both citation titles appear in the sources list.
    expect(screen.getByText("Espalhamento de Rayleigh")).toBeInTheDocument()
    expect(screen.getByText("Óptica atmosférica")).toBeInTheDocument()

    expect(
      container.querySelector('[data-slot="cited-answer"]')
    ).toBeInTheDocument()
  })
})
