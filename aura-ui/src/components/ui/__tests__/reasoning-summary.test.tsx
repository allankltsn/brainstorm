import { render, screen, fireEvent } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { ReasoningSummary } from "../reasoning-summary"

describe("ReasoningSummary", () => {
  it("shows the summary and steps when defaultOpen is true", () => {
    render(
      <ReasoningSummary
        summary="Analisei o pedido e montei o plano."
        steps={[
          { id: "1", text: "Li os arquivos de referência." },
          { id: "2", text: "Escrevi o componente." },
        ]}
        defaultOpen={true}
      />
    )

    expect(
      screen.getByText("Analisei o pedido e montei o plano.")
    ).toBeInTheDocument()
    expect(
      screen.getByText("Li os arquivos de referência.")
    ).toBeInTheDocument()
    expect(screen.getByText("Escrevi o componente.")).toBeInTheDocument()
  })

  it("hides steps until the header is clicked when defaultOpen is false", () => {
    render(
      <ReasoningSummary
        summary="Resumo oculto."
        steps={[
          { id: "1", text: "Primeiro passo." },
          { id: "2", text: "Segundo passo." },
        ]}
        defaultOpen={false}
      />
    )

    expect(screen.queryByText("Primeiro passo.")).not.toBeInTheDocument()
    expect(screen.queryByText("Segundo passo.")).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole("button", { name: /Raciocínio/ }))

    expect(screen.getByText("Primeiro passo.")).toBeInTheDocument()
    expect(screen.getByText("Segundo passo.")).toBeInTheDocument()
  })
})
