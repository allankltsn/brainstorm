import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { ContextMap } from "@/components/ui/context-map"

describe("ContextMap", () => {
  it("renders every item label with its token count and percentage", () => {
    const { container } = render(
      <ContextMap
        items={[
          { id: "a", label: "System prompt", tokens: 5000, kind: "system" },
          { id: "b", label: "utils.ts", tokens: 3000, kind: "file" },
          { id: "c", label: "Mensagem do usuário", tokens: 2000, kind: "message" },
        ]}
        capTokens={20000}
      />
    )

    // All three labels appear.
    expect(screen.getByText("System prompt")).toBeInTheDocument()
    expect(screen.getByText("utils.ts")).toBeInTheDocument()
    expect(screen.getByText("Mensagem do usuário")).toBeInTheDocument()

    // Header total uses the cap.
    expect(screen.getByText(/10\.000 \/ 20\.000 tokens/)).toBeInTheDocument()

    // A token count and a percentage value appear.
    expect(screen.getByText("5.000")).toBeInTheDocument()
    expect(screen.getByText("50%")).toBeInTheDocument()

    expect(
      container.querySelector('[data-slot="context-map"]')
    ).not.toBeNull()
  })
})
