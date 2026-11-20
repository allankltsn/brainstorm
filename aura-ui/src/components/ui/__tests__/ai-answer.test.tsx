import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { AiAnswer } from "@/components/ui/ai-answer"

describe("AiAnswer", () => {
  it("renders the answer body and cited sources", () => {
    const { container } = render(
      <AiAnswer citations={[{ id: 1, label: "PLANO.md", href: "#" }]}>
        <p>Resposta da IA.</p>
      </AiAnswer>
    )

    expect(screen.getByText("Resposta da IA.")).toBeInTheDocument()
    expect(screen.getByText("PLANO.md")).toBeInTheDocument()
    expect(container.querySelector('[data-slot="ai-answer"]')).toBeInTheDocument()
  })
})
